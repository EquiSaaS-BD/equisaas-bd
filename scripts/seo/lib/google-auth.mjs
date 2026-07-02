import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import { spawn } from "node:child_process";

import {
  getGoogleTokenPath,
  loadGoogleOAuthClient,
  loadGoogleToken,
  saveGoogleToken,
} from "./context.mjs";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest();
}

function openInBrowser(url) {
  try {
    if (process.platform === "win32") {
      const escapedUrl = url.replace(/'/g, "''");
      spawn("powershell", ["-NoProfile", "-Command", `Start-Process '${escapedUrl}'`], {
        detached: true,
        stdio: "ignore",
      }).unref();
      return true;
    }

    if (process.platform === "darwin") {
      spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
      return true;
    }

    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
    return true;
  } catch {
    return false;
  }
}

export async function runGoogleOAuthLogin() {
  const client = loadGoogleOAuthClient();
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = base64UrlEncode(crypto.randomBytes(48));
  const codeChallenge = base64UrlEncode(sha256(codeVerifier));

  const server = http.createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to open a local OAuth callback server.");
  }

  const redirectUri = `http://localhost:${address.port}`;

  const authUrl = new URL(client.auth_uri);
  authUrl.searchParams.set("client_id", client.client_id);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", GOOGLE_SCOPES.join(" "));
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  const authPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close();
      reject(new Error("Google OAuth timed out. Run the login command again."));
    }, 180000);

    server.on("request", async (req, res) => {
      try {
        const requestUrl = new URL(req.url || "/", `${redirectUri}/`);
        const returnedState = requestUrl.searchParams.get("state");
        const code = requestUrl.searchParams.get("code");
        const error = requestUrl.searchParams.get("error");

        if (error) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<h1>Authorization failed</h1><p>You can close this tab.</p>");
          clearTimeout(timeout);
          server.close();
          reject(new Error(`Google OAuth error: ${error}`));
          return;
        }

        if (!code || returnedState !== state) {
          res.writeHead(400, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<h1>Invalid callback</h1><p>You can close this tab.</p>");
          clearTimeout(timeout);
          server.close();
          reject(new Error("Invalid Google OAuth callback state."));
          return;
        }

        const tokenResponse = await fetch(client.token_uri, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: client.client_id,
            client_secret: client.client_secret ?? "",
            code,
            code_verifier: codeVerifier,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }),
        });

        const tokenBody = await tokenResponse.json();
        if (!tokenResponse.ok) {
          throw new Error(JSON.stringify(tokenBody));
        }

        const expiresAt = Date.now() + Number(tokenBody.expires_in || 0) * 1000;
        saveGoogleToken({
          ...tokenBody,
          expires_at: expiresAt,
          scope: tokenBody.scope || GOOGLE_SCOPES.join(" "),
        });

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Google SEO login complete</h1><p>You can close this tab and return to Codex.</p>");
        clearTimeout(timeout);
        server.close();
        resolve({
          ok: true,
          tokenPath: getGoogleTokenPath(),
          scopes: GOOGLE_SCOPES,
        });
      } catch (error) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Google SEO login failed</h1><p>You can close this tab.</p>");
        clearTimeout(timeout);
        server.close();
        reject(error);
      }
    });
  });

  const opened = openInBrowser(authUrl.toString());
  console.log(
    JSON.stringify(
      {
        ok: true,
        action: "authorize_google_oauth",
        openedBrowser: opened,
        url: authUrl.toString(),
        note: "Sign in with the Google account that already has Search Console access for equisaas-bd.com.",
      },
      null,
      2,
    ),
  );

  return authPromise;
}

export async function getGoogleAccessToken() {
  const token = loadGoogleToken();
  if (!token?.refresh_token && !token?.access_token) {
    throw new Error("Google SEO token not found. Run `npm run seo:google:login` first.");
  }

  if (token.access_token && token.expires_at && token.expires_at > Date.now() + 60000) {
    return token.access_token;
  }

  if (!token.refresh_token) {
    throw new Error("Google SEO token has no refresh_token. Run `npm run seo:google:login` again.");
  }

  const client = loadGoogleOAuthClient();
  const response = await fetch(client.token_uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: client.client_id,
      client_secret: client.client_secret ?? "",
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    }),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to refresh Google token: ${JSON.stringify(body)}`);
  }

  const nextToken = {
    ...token,
    ...body,
    refresh_token: token.refresh_token,
    expires_at: Date.now() + Number(body.expires_in || 0) * 1000,
  };

  saveGoogleToken(nextToken);
  return nextToken.access_token;
}

export async function googleApiFetch(url, init = {}) {
  const accessToken = await getGoogleAccessToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google API request failed (${response.status}): ${body}`);
  }

  return response.json();
}

export function getSavedGoogleTokenStatus() {
  const token = loadGoogleToken();
  if (!token) {
    return {
      exists: false,
      tokenPath: getGoogleTokenPath(),
    };
  }

  return {
    exists: true,
    tokenPath: getGoogleTokenPath(),
    hasRefreshToken: Boolean(token.refresh_token),
    expiresAt: token.expires_at || null,
  };
}

export function backupGoogleToken(targetPath) {
  const token = loadGoogleToken();
  if (!token) {
    throw new Error("No Google SEO token found to back up.");
  }

  fs.copyFileSync(getGoogleTokenPath(), targetPath);
}
