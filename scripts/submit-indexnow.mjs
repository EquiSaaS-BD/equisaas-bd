import fs from "node:fs";
import path from "node:path";

const key = "equisaas-bd-20260406-seo";
const host = "equisaas-bd.com";
const keyLocation = `https://${host}/${key}.txt`;

const sitemapPath = path.join(process.cwd(), "dist_deploy", "sitemap.xml");

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const urlsFromArgs = process.argv.slice(2).filter(Boolean);
const urls =
  urlsFromArgs.length > 0
    ? urlsFromArgs
    : extractUrls(fs.readFileSync(sitemapPath, "utf8")).filter((url) => url.startsWith(`https://${host}/`));

const uniqueUrls = [...new Set(urls)];

if (!uniqueUrls.length) {
  console.error("No URLs found for IndexNow submission.");
  process.exit(1);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: uniqueUrls,
  }),
});

if (!response.ok) {
  const body = await response.text();
  console.error(
    JSON.stringify(
      {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        body,
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      status: response.status,
      submitted: uniqueUrls.length,
      keyLocation,
    },
    null,
    2,
  ),
);
