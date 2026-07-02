import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    env[key] = value;
  }

  return env;
}

const rootEnv = parseEnvFile(path.join(repoRoot, ".env"));
const legacySeoEnv = parseEnvFile(path.join(repoRoot, ".env.seo.local"));
const mergedEnv = {
  ...rootEnv,
  ...legacySeoEnv,
  ...process.env,
};

export function getRepoRoot() {
  return repoRoot;
}

export function getSeoEnv() {
  return mergedEnv;
}

export function requireSeoEnv(name) {
  const value = mergedEnv[name];

  if (!value) {
    throw new Error(`Missing ${name}. Add it to the repo root .env file (see .env.example).`);
  }

  return value;
}

export function getSecretsDir() {
  return path.join(repoRoot, "artifacts", "secrets");
}

export function getGoogleOAuthClientPath() {
  return requireSeoEnv("GOOGLE_OAUTH_CLIENT_JSON");
}

export function getGoogleTokenPath() {
  return path.join(getSecretsDir(), "google-seo-token.json");
}

export function loadGoogleOAuthClient() {
  const oauthClientPath = getGoogleOAuthClientPath();

  if (!fs.existsSync(oauthClientPath)) {
    throw new Error(`OAuth client JSON not found at ${oauthClientPath}`);
  }

  const json = JSON.parse(fs.readFileSync(oauthClientPath, "utf8"));
  const client = json.installed || json.web;

  if (!client?.client_id || !client?.token_uri || !client?.auth_uri) {
    throw new Error("OAuth client JSON is missing required Google OAuth fields.");
  }

  return client;
}

export function loadGoogleToken() {
  const tokenPath = getGoogleTokenPath();

  if (!fs.existsSync(tokenPath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(tokenPath, "utf8"));
}

export function saveGoogleToken(token) {
  const tokenPath = getGoogleTokenPath();
  fs.mkdirSync(path.dirname(tokenPath), { recursive: true });
  fs.writeFileSync(tokenPath, JSON.stringify(token, null, 2));
}

export function maskValue(value) {
  if (!value) {
    return "<empty>";
  }

  if (value.length <= 8) {
    return `${value[0]}***${value.at(-1)}`;
  }

  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export function formatDateOffset(daysAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}
