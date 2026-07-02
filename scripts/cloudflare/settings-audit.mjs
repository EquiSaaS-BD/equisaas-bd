import { callCloudflare, ensureConfig, printJson, requestCloudflare, resolveZoneId } from "./lib/context.mjs";
import { SAFE_BASELINE_SETTINGS, pickImportantSettings } from "./lib/settings.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();

const data = await callCloudflare(`/zones/${zoneId}/settings`, {
  method: "GET",
});

const allSettings = data.result || [];
const important = pickImportantSettings(allSettings);
const managedWafEntrypoint = await requestCloudflare(
  `/zones/${zoneId}/rulesets/phases/http_request_firewall_managed/entrypoint`,
  { method: "GET" },
);

const managedWafRule = managedWafEntrypoint.ok
  ? managedWafEntrypoint.data?.result?.rules?.find((rule) => rule.action === "execute" && rule.enabled)
  : null;

const audit = SAFE_BASELINE_SETTINGS.map((baseline) => {
  const current = allSettings.find((setting) => setting.id === baseline.id);
  return {
    id: baseline.id,
    current: current?.value ?? null,
    desired: baseline.desired,
    aligned: current?.value === baseline.desired,
    editable: current?.editable ?? false,
    reason: baseline.reason,
  };
});

printJson({
  ok: true,
  zoneName,
  zoneId,
  important,
  managedWaf: {
    deployed: Boolean(managedWafRule),
    entrypointId: managedWafEntrypoint.ok ? managedWafEntrypoint.data?.result?.id || null : null,
    executeRuleId: managedWafRule?.id || null,
    managedRulesetId: managedWafRule?.action_parameters?.id || null,
  },
  audit,
});
