import { formatDateOffset } from "./context.mjs";
import { googleApiFetch } from "./google-auth.mjs";

function encodeSiteUrl(siteUrl) {
  return encodeURIComponent(siteUrl);
}

export function resolveSearchConsoleTargetSite(sites) {
  const preferred = [
    "sc-domain:equisaas-bd.com",
    "https://equisaas-bd.com/",
    "http://equisaas-bd.com/",
  ];

  for (const siteUrl of preferred) {
    const match = sites.find((site) => site.siteUrl === siteUrl);
    if (match) {
      return match.siteUrl;
    }
  }

  return sites[0]?.siteUrl ?? null;
}

function normalizePageRow(row) {
  return {
    page: row.keys?.[0] || "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

function normalizeQueryRow(row) {
  return {
    query: row.keys?.[0] || "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

function normalizePageQueryRow(row) {
  return {
    page: row.keys?.[0] || "",
    query: row.keys?.[1] || "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

const CLUSTER_RULES = [
  {
    id: "brand",
    label: "Brand",
    tokens: ["equisaas", "eqbd", "equisaasbd"],
  },
  {
    id: "founder",
    label: "Founder",
    tokens: ["kholipha", "alamin", "al-amin", "founder", "ceo"],
  },
  {
    id: "training_lms",
    label: "Training & LMS",
    tokens: ["training", "course", "courses", "lesson", "lessons", "lms", "learning", "certificate", "internship"],
  },
  {
    id: "cooperative_ownership",
    label: "Cooperative & Ownership",
    tokens: ["cooperative", "co-op", "sweat", "equity", "ownership", "open", "contributor", "contribution"],
  },
  {
    id: "sme_products",
    label: "SME Products",
    tokens: ["sme", "payroll", "pos", "pharmacy", "inventory", "hr", "software", "saas"],
  },
  {
    id: "orientation_workshop",
    label: "Orientation & Workshop",
    tokens: ["orientation", "workshop", "event", "session"],
  },
  {
    id: "bangladesh_local",
    label: "Bangladesh Intent",
    tokens: ["bangladesh", "bd", "dhaka", "district"],
  },
];

const STOPWORDS = new Set(["the", "a", "an", "for", "of", "and", "in", "to", "on", "with", "by", "is", "are", "at"]);

function normalizeQueryText(query) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getFallbackClusterLabel(normalizedQuery) {
  const token = normalizedQuery
    .split(" ")
    .map((part) => part.trim())
    .find((part) => part && !STOPWORDS.has(part));

  return token ? `Other: ${token}` : "Other";
}

export function clusterQueries(rows) {
  const bucket = new Map();

  for (const row of rows) {
    const normalized = normalizeQueryText(row.query);
    const cluster = CLUSTER_RULES.find((rule) => rule.tokens.some((token) => normalized.includes(token)));
    const clusterId = cluster?.id || `other:${getFallbackClusterLabel(normalized)}`;
    const clusterLabel = cluster?.label || getFallbackClusterLabel(normalized);

    if (!bucket.has(clusterId)) {
      bucket.set(clusterId, {
        id: clusterId,
        label: clusterLabel,
        clicks: 0,
        impressions: 0,
        averagePositionAccumulator: 0,
        queryCount: 0,
        topQueries: [],
      });
    }

    const entry = bucket.get(clusterId);
    entry.clicks += row.clicks;
    entry.impressions += row.impressions;
    entry.averagePositionAccumulator += row.position * Math.max(row.impressions, 1);
    entry.queryCount += 1;
    entry.topQueries.push({
      query: row.query,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    });
  }

  return [...bucket.values()]
    .map((entry) => ({
      id: entry.id,
      label: entry.label,
      clicks: entry.clicks,
      impressions: entry.impressions,
      ctr: entry.impressions > 0 ? entry.clicks / entry.impressions : 0,
      averagePosition: entry.impressions > 0 ? entry.averagePositionAccumulator / entry.impressions : 0,
      queryCount: entry.queryCount,
      topQueries: entry.topQueries
        .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
        .slice(0, 5),
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
}

function getTargetCtr(position) {
  if (position <= 1.5) return 0.3;
  if (position <= 3) return 0.15;
  if (position <= 5) return 0.08;
  if (position <= 8) return 0.04;
  return 0.02;
}

function getPageActionHint(page) {
  if (page.includes("/founder/")) {
    return "Strengthen title/meta with founder-name intent, authority proof, and clearer reason to click.";
  }
  if (page.includes("/software-training-bangladesh/")) {
    return "Sharpen training promise in title/meta and push proof-based LMS benefit higher in the page.";
  }
  if (page.includes("/sme-software-bangladesh/")) {
    return "Make SME software intent more concrete in title/meta and surface roadmap keywords earlier.";
  }
  if (page.includes("/orientation-2026/")) {
    return "Clarify orientation year/session intent and add stronger click-through framing for first-time visitors.";
  }
  if (page === "https://equisaas-bd.com/" || page === "http://equisaas-bd.com/") {
    return "Keep homepage title/meta tightly aligned with brand + Bangladesh's first open tech cooperative + LMS value.";
  }
  return "Review title, meta description, hero copy, and internal anchors to raise click-through rate.";
}

export function buildOpportunityReport(pageRows, pageQueryRows) {
  const pageQueries = new Map();

  for (const row of pageQueryRows) {
    if (!pageQueries.has(row.page)) {
      pageQueries.set(row.page, []);
    }
    pageQueries.get(row.page).push(row);
  }

  return pageRows
    .filter((row) => row.impressions >= 25 && row.position <= 10)
    .map((row) => {
      const targetCtr = getTargetCtr(row.position);
      const ctrGap = Math.max(targetCtr - row.ctr, 0);
      const priorityScore = Number((row.impressions * ctrGap).toFixed(2));
      const issue =
        row.ctr === 0
          ? "Zero-click visible page"
          : row.ctr <= 0.03
            ? "Low CTR"
            : row.ctr < targetCtr
              ? "Below expected CTR"
              : "Monitor";

      return {
        page: row.page,
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
        targetCtr,
        ctrGap,
        priorityScore,
        issue,
        actionHint: getPageActionHint(row.page),
        topQueries: (pageQueries.get(row.page) || [])
          .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
          .slice(0, 5)
          .map((queryRow) => ({
            query: queryRow.query,
            clicks: queryRow.clicks,
            impressions: queryRow.impressions,
            ctr: queryRow.ctr,
            position: queryRow.position,
          })),
      };
    })
    .filter((row) => row.priorityScore > 0 || row.issue !== "Monitor")
    .sort((a, b) => b.priorityScore - a.priorityScore || b.impressions - a.impressions)
    .slice(0, 10);
}

export async function fetchSearchConsoleOverview() {
  const sitesBody = await googleApiFetch("https://www.googleapis.com/webmasters/v3/sites");
  const sites = sitesBody.siteEntry || [];
  const targetSite = resolveSearchConsoleTargetSite(sites);

  if (!targetSite) {
    throw new Error("No Search Console properties available for the signed-in account.");
  }

  const endDate = formatDateOffset(3);
  const startDate = formatDateOffset(30);
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeSiteUrl(targetSite)}/searchAnalytics/query`;

  const [pagesBody, queriesBody, pageQueryBody] = await Promise.all([
    googleApiFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 100,
      }),
    }),
    googleApiFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 150,
      }),
    }),
    googleApiFetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["page", "query"],
        rowLimit: 250,
      }),
    }),
  ]);

  const topPages = (pagesBody.rows || []).map(normalizePageRow);
  const topQueries = (queriesBody.rows || []).map(normalizeQueryRow);
  const pageQueries = (pageQueryBody.rows || []).map(normalizePageQueryRow);

  return {
    site: targetSite,
    startDate,
    endDate,
    topPages,
    topQueries,
    pageQueries,
    queryClusters: clusterQueries(topQueries),
    opportunities: buildOpportunityReport(topPages, pageQueries),
  };
}
