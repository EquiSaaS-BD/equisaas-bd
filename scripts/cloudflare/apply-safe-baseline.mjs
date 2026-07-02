import { callCloudflare, ensureConfig, printJson, requestCloudflare, resolveZoneId } from "./lib/context.mjs";
import { SAFE_BASELINE_SETTINGS } from "./lib/settings.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();

const before = await callCloudflare(`/zones/${zoneId}/settings`, {
  method: "GET",
});

const currentSettings = before.result || [];
const changes = [];
const skipped = [];

for (const baseline of SAFE_BASELINE_SETTINGS) {
  const current = currentSettings.find((setting) => setting.id === baseline.id);

  if (!current?.editable) {
    skipped.push({
      id: baseline.id,
      current: current?.value ?? null,
      desired: baseline.desired,
      reason: "Setting is not editable on this zone/plan.",
    });
    continue;
  }

  if (current.value === baseline.desired) {
    skipped.push({
      id: baseline.id,
      current: current.value,
      desired: baseline.desired,
      reason: "Already aligned.",
    });
    continue;
  }

  const updateResult = await requestCloudflare(`/zones/${zoneId}/settings/${baseline.id}`, {
    method: "PATCH",
    body: JSON.stringify({ value: baseline.desired }),
  });

  if (!updateResult.ok) {
    skipped.push({
      id: baseline.id,
      current: current.value,
      desired: baseline.desired,
      reason:
        updateResult.data?.errors?.[0]?.message ||
        "Cloudflare rejected the requested baseline change.",
    });
    continue;
  }

  changes.push({
    id: baseline.id,
    before: current.value,
    after: updateResult.data?.result?.value ?? baseline.desired,
    reason: baseline.reason,
  });
}

printJson({
  ok: true,
  zoneName,
  zoneId,
  changed: changes,
  skipped,
});
