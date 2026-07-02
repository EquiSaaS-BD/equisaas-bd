import fs from "node:fs";
import path from "node:path";

import { callCloudflare, ensureConfig, printJson, resolveZoneId } from "./lib/context.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();

const data = await callCloudflare(`/zones/${zoneId}/dns_records?per_page=500`, {
  method: "GET",
});

const exportDir = path.join(process.cwd(), "artifacts", "cloudflare");
fs.mkdirSync(exportDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const filePath = path.join(exportDir, `dns-snapshot-${stamp}.json`);

const payload = {
  zoneName,
  zoneId,
  exportedAt: new Date().toISOString(),
  records: data.result || [],
};

fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

printJson({
  ok: true,
  zoneName,
  zoneId,
  filePath,
  total: payload.records.length,
});
