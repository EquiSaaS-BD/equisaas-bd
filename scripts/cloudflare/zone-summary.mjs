import { callCloudflare, ensureConfig, printJson, resolveZoneId } from "./lib/context.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();

const zoneData = await callCloudflare(`/zones/${zoneId}`, {
  method: "GET",
});

const zone = zoneData.result || {};

printJson({
  ok: true,
  zoneId,
  zoneName,
  name: zone.name || zoneName,
  status: zone.status || null,
  plan: zone.plan?.name || null,
  paused: zone.paused ?? null,
  type: zone.type || null,
  nameServers: zone.name_servers || [],
  originalNameServers: zone.original_name_servers || [],
  developmentMode: zone.development_mode || 0,
});
