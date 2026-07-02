import fs from "node:fs";
import path from "node:path";
import { GoogleAuth } from "google-auth-library";

async function run() {
  const urlsPath = "C:\\Users\\ANMS\\.gemini\\antigravity\\brain\\1ef642cd-175f-46ed-a36b-00b71bd8fa1c\\submitted_urls.md";
  const content = fs.readFileSync(urlsPath, "utf-8");
  
  // Extract URLs starting with https://
  const urls = [...content.matchAll(/- (https:\/\/[^\s]+)/g)].map(m => m[1]);
  console.log(`Found ${urls.length} URLs in submitted_urls.md`);

  const googleKeyFile = "D:\\projects\\EquiSaaS BD\\artifacts\\secrets\\equisaas-seo-681b9ef5e629.json";
  
  // 1. Submit to Google Indexing API
  if (fs.existsSync(googleKeyFile)) {
    try {
      const auth = new GoogleAuth({
        keyFile: googleKeyFile,
        scopes: ["https://www.googleapis.com/auth/indexing"],
      });
      const client = await auth.getClient();
      const token = await client.getAccessToken();

      let gSuccess = 0;
      let gErrors = 0;
      for (const url of urls) {
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
          gSuccess++;
        } else if (res.status === 429) {
          console.warn(`[Google] Quota exceeded on URL ${url}`);
          break;
        } else {
          gErrors++;
        }
      }
      console.log(`[Google] Successfully submitted ${gSuccess} URLs. Errors: ${gErrors}`);
    } catch (error) {
      console.error(`[Google] Auth/API Error: ${error.message}`);
    }
  } else {
    console.error(`[Google] Key file not found at ${googleKeyFile}`);
  }

  // 2. Submit to IndexNow
  const indexNowKey = "equisaas-bd-20260406-seo";
  const hosts = [...new Set(urls.map(u => new URL(u).hostname))];
  
  for (const host of hosts) {
    const hostUrls = urls.filter(u => new URL(u).hostname === host);
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: host,
          key: indexNowKey,
          keyLocation: `https://${host}/${indexNowKey}.txt`,
          urlList: hostUrls,
        }),
      });
      if (res.ok) {
        console.log(`[IndexNow] Successfully submitted ${hostUrls.length} URLs for ${host}`);
      } else {
        const body = await res.text();
        console.error(`[IndexNow] Error for ${host}: ${res.status} ${body}`);
      }
    } catch (error) {
      console.error(`[IndexNow] Fetch Error for ${host}: ${error.message}`);
    }
  }

  // 3. Submit via Bing Webmaster API
  const bingApiKey = "a7356d9e7c5f4a92b137ba7dffec111b"; // From .env
  const siteUrl = "https://equisaas-bd.com"; // Bing requires the siteUrl that is registered
  try {
    const res = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${bingApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteUrl: siteUrl,
        urlList: urls
      }),
    });
    if (res.ok) {
      console.log(`[BingWebmaster] Successfully submitted URLs via Bing API.`);
    } else {
      const body = await res.text();
      console.error(`[BingWebmaster] Error: ${res.status} ${body}`);
    }
  } catch (err) {
    console.error(`[BingWebmaster] Error: ${err.message}`);
  }
}

run();
