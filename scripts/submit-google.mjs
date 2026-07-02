import fs from "node:fs";
import path from "node:path";
import { GoogleAuth } from "google-auth-library";

const host = "equisaas-bd.com";
const sitemapPath = path.join(process.cwd(), "dist_deploy", "sitemap.xml");

function extractUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const urlsFromArgs = process.argv.slice(2).filter(Boolean);
let urls = [];

if (urlsFromArgs.length > 0) {
  urls = urlsFromArgs;
} else {
  if (fs.existsSync(sitemapPath)) {
    urls = extractUrls(fs.readFileSync(sitemapPath, "utf8")).filter((url) =>
      url.startsWith(`https://${host}/`)
    );
  } else {
    console.error(`Sitemap not found at ${sitemapPath}`);
    process.exit(1);
  }
}

const uniqueUrls = [...new Set(urls)];

if (!uniqueUrls.length) {
  console.error("No URLs found for Google submission.");
  process.exit(1);
}

console.log(`Found ${uniqueUrls.length} URLs to submit to Google.`);

const keyFile = path.join(process.cwd(), "artifacts", "secrets", "equisaas-seo-681b9ef5e629.json");
if (!fs.existsSync(keyFile)) {
  console.error(`Google Service Account JSON not found at ${keyFile}`);
  process.exit(1);
}

const auth = new GoogleAuth({
  keyFile: keyFile,
  scopes: ["https://www.googleapis.com/auth/indexing"],
});

try {
  const client = await auth.getClient();
  const token = await client.getAccessToken();

  let successCount = 0;
  let errorCount = 0;

  let quotaExhausted = false;

  for (const url of uniqueUrls) {
    if (quotaExhausted) {
      console.warn(`[SKIP] Quota exhausted, skipping: ${url}`);
      errorCount++;
      continue;
    }
    try {
      const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({
          url: url,
          type: "URL_UPDATED",
        }),
      });

      if (res.ok) {
        successCount++;
        console.log(`[OK] Submitted to Google: ${url}`);
      } else if (res.status === 429) {
        quotaExhausted = true;
        errorCount++;
        console.warn(`[QUOTA] Daily Google Indexing quota exhausted. Skipping remaining URLs.`);
        console.warn(`[INFO] Quota resets at midnight Pacific Time. Run 'npm run submit:google' tomorrow.`);
      } else {
        errorCount++;
        const errorText = await res.text();
        console.error(`[ERROR] Failed to submit ${url}: ${res.status} ${errorText}`);
      }
    } catch (error) {
      errorCount++;
      console.error(`[ERROR] Exception submitting ${url}: ${error.message}`);
    }
  }

  console.log(`Google Indexing API submission complete. Success: ${successCount}, Errors: ${errorCount}`);
  
  // Do not fail the build if Google throws 403 or 429 rate limit errors. Just log them.
  // Google restricts the API primarily to JobPosting/BroadcastEvent, and has quota limits.
  // if (errorCount > 0) {
  //   process.exit(1);
  // }
} catch (error) {
  console.error("Authentication failed:", error.message);
  process.exit(1);
}
