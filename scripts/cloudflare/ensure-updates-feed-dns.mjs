import { callCloudflare, printJson, resolveZoneId } from "./lib/context.mjs";

const RECORD_NAME = "updates.equisaas-bd.com";
const PLACEHOLDER_IPV4 = "192.0.2.1";
const COMMENT = "Cloudflare Worker route placeholder for BD ERP POS updates feed";

const zoneId = await resolveZoneId();

const query = new URLSearchParams({
  name: RECORD_NAME,
  per_page: "100",
});

const existingData = await callCloudflare(`/zones/${zoneId}/dns_records?${query.toString()}`, {
  method: "GET",
});

const existingRecords = existingData.result || [];
const desiredRecord = existingRecords.find(
  (record) =>
    record.type === "A" &&
    record.name === RECORD_NAME &&
    record.content === PLACEHOLDER_IPV4 &&
    record.proxied === true,
);

if (desiredRecord) {
  printJson({
    ok: true,
    changed: false,
    record: {
      id: desiredRecord.id,
      type: desiredRecord.type,
      name: desiredRecord.name,
      content: desiredRecord.content,
      proxied: desiredRecord.proxied,
    },
  });
  process.exit(0);
}

for (const record of existingRecords) {
  if (["A", "AAAA", "CNAME"].includes(record.type)) {
    await callCloudflare(`/zones/${zoneId}/dns_records/${record.id}`, {
      method: "DELETE",
    });
  }
}

const createData = await callCloudflare(`/zones/${zoneId}/dns_records`, {
  method: "POST",
  body: JSON.stringify({
    type: "A",
    name: RECORD_NAME,
    content: PLACEHOLDER_IPV4,
    proxied: true,
    ttl: 1,
    comment: COMMENT,
  }),
});

printJson({
  ok: true,
  changed: true,
  record: {
    id: createData.result?.id,
    type: createData.result?.type,
    name: createData.result?.name,
    content: createData.result?.content,
    proxied: createData.result?.proxied,
  },
});
