import { callCloudflare, ensureConfig, printJson, getArgsAfterFlags, resolveZoneId } from "./lib/context.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();
const positional = getArgsAfterFlags();
const maybeType = positional[0]?.toUpperCase() || "";
const validTypes = new Set(["A", "AAAA", "CNAME", "TXT", "MX", "NS", "CAA", "SRV", "PTR", "DS"]);
const query = validTypes.has(maybeType) ? `?per_page=500&type=${encodeURIComponent(maybeType)}` : "?per_page=500";

const data = await callCloudflare(`/zones/${zoneId}/dns_records${query}`, {
  method: "GET",
});

const records = (data.result || []).map((record) => ({
  id: record.id,
  type: record.type,
  name: record.name,
  content: record.content,
  proxied: record.proxied ?? false,
  ttl: record.ttl,
  comment: record.comment || "",
}));

printJson({
  ok: true,
  zoneName,
  total: records.length,
  filter: validTypes.has(maybeType) ? maybeType : null,
  records,
});
