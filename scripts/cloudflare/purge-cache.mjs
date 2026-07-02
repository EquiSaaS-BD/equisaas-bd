import { callCloudflare, ensureConfig, getArgsAfterFlags, hasFlag, printJson, resolveZoneId } from "./lib/context.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();
const urls = getArgsAfterFlags();
const purgeEverything = hasFlag("--everything");

if (!purgeEverything && urls.length === 0) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        message: "Pass one or more full URLs, or use --everything for a full purge.",
        examples: [
          "npm run cf:cache:purge -- https://equisaas-bd.com/ https://equisaas-bd.com/founder/",
          "npm run cf:cache:purge -- --everything",
        ],
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const body = purgeEverything ? { purge_everything: true } : { files: urls };

const data = await callCloudflare(`/zones/${zoneId}/purge_cache`, {
  method: "POST",
  body: JSON.stringify(body),
});

printJson({
  ok: true,
  zoneName,
  mode: purgeEverything ? "everything" : "files",
  files: purgeEverything ? [] : urls,
  result: data.result || null,
});
