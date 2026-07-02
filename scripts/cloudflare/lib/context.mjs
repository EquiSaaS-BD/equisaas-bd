import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const API_BASE = "https://api.cloudflare.com/client/v4";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..", "..");

function loadLocalEnvFile(fileName) {
  const candidates = [
    path.join(process.cwd(), fileName),
    path.join(repoRoot, fileName),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf8");

    for (const line of content.split(/\r?\n/u)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      const normalizedValue = rawValue.replace(/^['"]|['"]$/g, "");

      if (!(key in process.env)) {
        process.env[key] = normalizedValue;
      }
    }
  }
}

loadLocalEnvFile(".env");
loadLocalEnvFile(".env.local");
loadLocalEnvFile(".env.cloudflare");
loadLocalEnvFile(".env.cloudflare.local");

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return null;
  }

  return process.argv[index + 1] ?? null;
}

export function hasFlag(flag) {
  return process.argv.includes(flag);
}

export function getArgsAfterFlags() {
  const args = process.argv.slice(2);
  const values = [];

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    if (!current) continue;

    if (current.startsWith("--")) {
      const next = args[index + 1];
      if (next && !next.startsWith("--")) {
        index += 1;
      }
      continue;
    }

    values.push(current);
  }

  return values;
}

export function getCloudflareConfig() {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN?.trim() || "";
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim() || "";
  const zoneId = process.env.CLOUDFLARE_ZONE_ID?.trim() || "";
  const zoneName =
    getArgValue("--zone-name") ||
    process.env.CLOUDFLARE_ZONE_NAME?.trim() ||
    "equisaas-bd.com";

  return {
    apiToken,
    accountId,
    zoneId,
    zoneName,
  };
}

export function ensureConfig(required = ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_ID"]) {
  const config = getCloudflareConfig();

  const missing = required.filter((key) => {
    switch (key) {
      case "CLOUDFLARE_API_TOKEN":
        return !config.apiToken;
      case "CLOUDFLARE_ACCOUNT_ID":
        return !config.accountId;
      case "CLOUDFLARE_ZONE_ID":
        return !config.zoneId;
      case "CLOUDFLARE_ZONE_NAME":
        return !config.zoneName;
      default:
        return !process.env[key];
    }
  });

  if (missing.length > 0) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: "Missing required Cloudflare environment variables.",
          missing,
          hint:
            "Create a local .env file from .env.example and set the Cloudflare values before running this script.",
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  return config;
}

export async function requestCloudflare(path, init = {}) {
  const { apiToken } = ensureConfig(["CLOUDFLARE_API_TOKEN"]);

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  return {
    ok: response.ok && data.success !== false,
    status: response.status,
    statusText: response.statusText,
    path,
    data,
  };
}

export async function callCloudflare(path, init = {}) {
  const result = await requestCloudflare(path, init);

  if (!result.ok) {
    const primaryError = result.data?.errors?.[0] || null;
    const enhancedHint =
      primaryError?.code === 9109
        ? "The token is valid but blocked by Client IP filtering. Remove the IP restriction, or allow the current public IP shown in the error."
        : null;

    console.error(
      JSON.stringify(
        {
          ok: false,
          status: result.status,
          statusText: result.statusText,
          path: result.path,
          errors: result.data?.errors || [],
          messages: result.data?.messages || [],
          hint: enhancedHint,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  return result.data;
}

export async function resolveZoneId() {
  const config = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);

  if (config.zoneId) {
    return config.zoneId;
  }

  const query = new URLSearchParams({
    name: config.zoneName,
    per_page: "1",
  });

  const data = await callCloudflare(`/zones?${query.toString()}`, {
    method: "GET",
  });

  const zone = data.result?.[0];

  if (!zone?.id) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          message: "Could not resolve CLOUDFLARE_ZONE_ID from CLOUDFLARE_ZONE_NAME.",
          zoneName: config.zoneName,
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  return zone.id;
}

export function printJson(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
