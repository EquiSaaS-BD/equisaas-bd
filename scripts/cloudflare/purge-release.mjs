import fs from "node:fs";
import path from "node:path";

import { callCloudflare, ensureConfig, printJson, resolveZoneId } from "./lib/context.mjs";

const { zoneName } = ensureConfig(["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ZONE_NAME"]);
const zoneId = await resolveZoneId();
const deployDir = path.join(process.cwd(), "dist_deploy");
const sitemapPath = path.join(deployDir, "sitemap.xml");

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function buildReleaseUrlSet() {
  const urls = new Set([
    `https://${zoneName}/`,
    `https://www.${zoneName}/`,
    `https://${zoneName}/robots.txt`,
    `https://${zoneName}/sitemap.xml`,
    `https://${zoneName}/video-sitemap.xml`,
    `https://${zoneName}/llms.txt`,
    `https://${zoneName}/version.json`,
    `https://${zoneName}/lms/`,
    `https://${zoneName}/lms/login`,
    `https://${zoneName}/lms/register`,
    `https://${zoneName}/departments/`,
    `https://${zoneName}/roadmap/`,
    `https://${zoneName}/leadership/`,
    "https://equisaas-bd.com/lms/certificate",
    "https://equisaas-bd.com/lms/certificate-view",
    "https://equisaas-bd.com/partners/",
  ]);

  if (fs.existsSync(sitemapPath)) {
    const sitemapXml = fs.readFileSync(sitemapPath, "utf8");
    for (const url of extractUrls(sitemapXml)) {
      if (url.startsWith(`https://${zoneName}/`)) {
        urls.add(url);
      }
    }
  }

  return [...urls];
}

const files = buildReleaseUrlSet();

if (files.length === 0) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        message: "No URLs found for release purge.",
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const data = await callCloudflare(`/zones/${zoneId}/purge_cache`, {
  method: "POST",
  body: JSON.stringify({ files }),
});

printJson({
  ok: true,
  zoneName,
  purged: files.length,
  files,
  result: data.result || null,
});
