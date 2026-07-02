import { ensureConfig, printJson, requestCloudflare, resolveZoneId } from "./lib/context.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();

const rulesetsResponse = await requestCloudflare(`/zones/${zoneId}/rulesets`, {
  method: "GET",
});

if (!rulesetsResponse.ok) {
  console.error(JSON.stringify(rulesetsResponse.data, null, 2));
  process.exit(1);
}

const availableRulesets = rulesetsResponse.data?.result || [];
const managedWafRuleset = availableRulesets.find(
  (ruleset) => ruleset.phase === "http_request_firewall_managed" && ruleset.kind === "managed",
);

if (!managedWafRuleset?.id) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        message: "Could not find a deployable managed WAF ruleset for this zone.",
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const entrypointResponse = await requestCloudflare(
  `/zones/${zoneId}/rulesets/phases/http_request_firewall_managed/entrypoint`,
  { method: "GET" },
);

const description = "Deploy Cloudflare managed WAF ruleset to all incoming requests.";
const expression = "true";
const payloadRule = {
  action: "execute",
  expression,
  description,
  enabled: true,
  action_parameters: {
    id: managedWafRuleset.id,
  },
};

if (entrypointResponse.ok) {
  const entrypoint = entrypointResponse.data?.result;
  const existingRule = entrypoint?.rules?.find(
    (rule) =>
      rule.action === "execute" &&
      rule.action_parameters?.id === managedWafRuleset.id,
  );

  if (existingRule) {
    printJson({
      ok: true,
      zoneName,
      zoneId,
      status: "already_deployed",
      entrypointId: entrypoint.id,
      managedRulesetId: managedWafRuleset.id,
      executeRuleId: existingRule.id,
    });
    process.exit(0);
  }

  const addRuleResponse = await requestCloudflare(`/zones/${zoneId}/rulesets/${entrypoint.id}/rules`, {
    method: "POST",
    body: JSON.stringify(payloadRule),
  });

  if (!addRuleResponse.ok) {
    console.error(JSON.stringify(addRuleResponse.data, null, 2));
    process.exit(1);
  }

  printJson({
    ok: true,
    zoneName,
    zoneId,
    status: "rule_added",
    entrypointId: entrypoint.id,
    managedRulesetId: managedWafRuleset.id,
    result: addRuleResponse.data?.result || null,
  });
  process.exit(0);
}

const noEntrypoint = entrypointResponse.data?.errors?.some((error) => error.code === 10003);

if (!noEntrypoint) {
  console.error(JSON.stringify(entrypointResponse.data, null, 2));
  process.exit(1);
}

const createEntrypointResponse = await requestCloudflare(`/zones/${zoneId}/rulesets`, {
  method: "POST",
  body: JSON.stringify({
    name: "zone",
    description: "Zone-level phase entry point for managed WAF.",
    kind: "zone",
    phase: "http_request_firewall_managed",
    rules: [payloadRule],
  }),
});

if (!createEntrypointResponse.ok) {
  console.error(JSON.stringify(createEntrypointResponse.data, null, 2));
  process.exit(1);
}

printJson({
  ok: true,
  zoneName,
  zoneId,
  status: "entrypoint_created",
  managedRulesetId: managedWafRuleset.id,
  result: createEntrypointResponse.data?.result || null,
});
