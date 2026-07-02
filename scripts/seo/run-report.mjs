import fs from "node:fs";
import path from "node:path";

import { getRepoRoot, requireSeoEnv } from "./lib/context.mjs";
import { fetchGa4Overview } from "./lib/ga4.mjs";
import { fetchSearchConsoleOverview } from "./lib/search-console.mjs";

async function fetchBingSites() {
  const apiKey = requireSeoEnv("BING_WEBMASTER_API_KEY");
  const endpoint = new URL("https://ssl.bing.com/webmaster/api.svc/json/GetUserSites");
  endpoint.searchParams.set("apikey", apiKey);

  const response = await fetch(endpoint);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`Bing API failed (${response.status}): ${JSON.stringify(body)}`);
  }

  return body;
}

async function fetchPageSpeed(targetUrl, strategy) {
  const apiKey = requireSeoEnv("GOOGLE_PAGESPEED_API_KEY");
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
    throw new Error(`PageSpeed API failed (${response.status}): ${JSON.stringify(body)}`);
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

function buildMarkdownReport(report) {
  const lines = [];
  lines.push("# SEO Platform Report");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push("## Search Console");
  lines.push(`- Property: ${report.searchConsole.site}`);
  lines.push(`- Date range: ${report.searchConsole.startDate} to ${report.searchConsole.endDate}`);
  lines.push("");
  lines.push("### Top Pages");
  for (const page of report.searchConsole.topPages.slice(0, 12)) {
    lines.push(`- ${page.page} | clicks ${page.clicks} | impressions ${page.impressions} | CTR ${(page.ctr * 100).toFixed(2)}% | position ${page.position.toFixed(2)}`);
  }
  lines.push("");
  lines.push("### Top Queries");
  for (const query of report.searchConsole.topQueries.slice(0, 12)) {
    lines.push(`- ${query.query} | clicks ${query.clicks} | impressions ${query.impressions} | CTR ${(query.ctr * 100).toFixed(2)}% | position ${query.position.toFixed(2)}`);
  }
  lines.push("");
  lines.push("### Query Clusters");
  for (const cluster of report.searchConsole.queryClusters.slice(0, 8)) {
    lines.push(`- ${cluster.label} | queries ${cluster.queryCount} | clicks ${cluster.clicks} | impressions ${cluster.impressions} | CTR ${(cluster.ctr * 100).toFixed(2)}% | avg position ${cluster.averagePosition.toFixed(2)}`);
  }
  lines.push("");
  lines.push("### CTR Opportunities");
  for (const opportunity of report.searchConsole.opportunities.slice(0, 8)) {
    lines.push(`- ${opportunity.page} | issue ${opportunity.issue} | impressions ${opportunity.impressions} | CTR ${(opportunity.ctr * 100).toFixed(2)}% | position ${opportunity.position.toFixed(2)} | target CTR ${(opportunity.targetCtr * 100).toFixed(2)}%`);
    if (opportunity.topQueries.length) {
      lines.push(`  Top intent: ${opportunity.topQueries[0].query}`);
    }
    lines.push(`  Action: ${opportunity.actionHint}`);
  }
  lines.push("");
  lines.push("## Bing Webmaster");
  for (const site of report.bing.sites) {
    lines.push(`- ${site.Url} | verified: ${site.IsVerified ? "yes" : "no"}`);
  }
  lines.push("");
  lines.push("## GA4 Traffic");
  if (report.ga4.ok === false) {
    lines.push(`- Unavailable: ${report.ga4.error}`);
  } else {
    lines.push(`- Property ID: ${report.ga4.propertyId}`);
    lines.push(`- Date range: ${report.ga4.startDate} to ${report.ga4.endDate}`);
    lines.push("");
    lines.push("### Organic Landing Pages");
    for (const row of report.ga4.organicLandingPages.slice(0, 10)) {
      lines.push(`- ${row.landingPage} | sessions ${row.sessions} | engaged ${row.engagedSessions} | users ${row.totalUsers} | conversions ${row.conversions}`);
    }
    lines.push("");
    lines.push("### Raw Landing Traffic");
    for (const row of report.ga4.rawLandingPages.slice(0, 12)) {
      lines.push(`- ${row.landingPage} | ${row.channelGroup} | sessions ${row.sessions} | engaged ${row.engagedSessions} | users ${row.totalUsers} | conversions ${row.conversions}`);
    }
    lines.push("");
    lines.push("### Raw Page Traffic");
    for (const row of report.ga4.rawPages.slice(0, 12)) {
      lines.push(`- ${row.pagePath} | page views ${row.pageViews} | sessions ${row.sessions} | users ${row.totalUsers}`);
    }
  }
  lines.push("");
  lines.push("## PageSpeed Snapshot");
  for (const result of report.pageSpeed) {
    lines.push(`- ${result.url} (${result.strategy}) | perf ${result.scores.performance} | a11y ${result.scores.accessibility} | best ${result.scores.bestPractices} | seo ${result.scores.seo}`);
  }
  return `${lines.join("\n")}\n`;
}

try {
  const searchConsole = await fetchSearchConsoleOverview();
  const bing = await fetchBingSites();
  const ga4 = await fetchGa4Overview().catch((error) => ({
    ok: false,
    error: error instanceof Error ? error.message : String(error),
  }));
  const pageSpeed = await Promise.all([
    fetchPageSpeed("https://equisaas-bd.com/", "mobile"),
    fetchPageSpeed("https://equisaas-bd.com/", "desktop"),
    fetchPageSpeed("https://equisaas-bd.com/founder/", "mobile"),
    fetchPageSpeed("https://equisaas-bd.com/founder/", "desktop"),
  ]);

  const report = {
    ok: true,
    generatedAt: new Date().toISOString(),
    searchConsole,
    bing: {
      sites: (bing.d || []).map((site) => ({
        Url: site.Url,
        IsVerified: site.IsVerified,
      })),
    },
    ga4,
    pageSpeed,
  };

  const repoRoot = getRepoRoot();
  const outputDir = path.join(repoRoot, "artifacts", "seo");
  fs.mkdirSync(outputDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(outputDir, `seo-report-${stamp}.json`);
  const mdPath = path.join(outputDir, `seo-report-${stamp}.md`);
  const latestJsonPath = path.join(outputDir, "seo-report-latest.json");
  const latestMdPath = path.join(outputDir, "seo-report-latest.md");

  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(latestJsonPath, JSON.stringify(report, null, 2));
  fs.writeFileSync(mdPath, buildMarkdownReport(report));
  fs.writeFileSync(latestMdPath, buildMarkdownReport(report));

  console.log(
    JSON.stringify(
      {
        ok: true,
        jsonPath,
        mdPath,
        latestJsonPath,
        latestMdPath,
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
