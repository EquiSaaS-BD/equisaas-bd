import { requireSeoEnv } from "./lib/context.mjs";

const apiKey = requireSeoEnv("GOOGLE_PAGESPEED_API_KEY");
const urls = process.argv.slice(2).filter(Boolean);
const targets =
  urls.length > 0
    ? urls
    : [
        "https://equisaas-bd.com/",
        "https://equisaas-bd.com/founder/",
        "https://equisaas-bd.com/software-training-bangladesh/",
      ];

async function runForUrl(targetUrl, strategy) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", targetUrl);
  endpoint.searchParams.set("strategy", strategy);
  endpoint.searchParams.append("category", "performance");
  endpoint.searchParams.append("category", "accessibility");
  endpoint.searchParams.append("category", "best-practices");
  endpoint.searchParams.append("category", "seo");
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status} ${JSON.stringify(body)}`);
  }

  const categories = body.lighthouseResult?.categories || {};
  return {
    url: targetUrl,
    strategy,
    scores: {
      performance: categories.performance?.score ?? null,
      accessibility: categories.accessibility?.score ?? null,
      bestPractices: categories["best-practices"]?.score ?? null,
      seo: categories.seo?.score ?? null,
    },
    coreWebVitals: {
      lcp: body.loadingExperience?.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile ?? null,
      inp: body.loadingExperience?.metrics?.INTERACTION_TO_NEXT_PAINT?.percentile ?? null,
      cls: body.loadingExperience?.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile ?? null,
    },
  };
}

try {
  const results = [];

  for (const targetUrl of targets) {
    results.push(await runForUrl(targetUrl, "mobile"));
    results.push(await runForUrl(targetUrl, "desktop"));
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        checked: results.length,
        results,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
