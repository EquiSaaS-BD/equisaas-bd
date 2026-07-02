import { formatDateOffset, requireSeoEnv } from "./context.mjs";
import { googleApiFetch } from "./google-auth.mjs";

function normalizeRows(rows = [], mapper) {
  return rows.map((row) => mapper(row.dimensionValues || [], row.metricValues || []));
}

function stripNoisyParams(urlStr) {
  try {
    const [path, search] = urlStr.split("?");
    if (!search) return urlStr;
    const params = new URLSearchParams(search);
    params.delete("fbclid");
    params.delete("_gl");
    params.delete("gclid");
    const newSearch = params.toString();
    return newSearch ? `${path}?${newSearch}` : path;
  } catch {
    return urlStr;
  }
}

function aggregateRows(items, pathKey) {
  const grouped = new Map();
  for (const item of items) {
    const cleanPath = stripNoisyParams(item[pathKey] || "");
    const key = `${cleanPath}|${item.channelGroup || ""}`;
    if (!grouped.has(key)) {
      grouped.set(key, { ...item, [pathKey]: cleanPath });
    } else {
      const existing = grouped.get(key);
      existing.sessions += item.sessions || 0;
      existing.totalUsers += item.totalUsers || 0;
      if (item.engagedSessions !== undefined) existing.engagedSessions += item.engagedSessions;
      if (item.conversions !== undefined) existing.conversions += item.conversions;
      if (item.pageViews !== undefined) existing.pageViews += item.pageViews;
    }
  }
  return Array.from(grouped.values()).sort((a, b) => {
    if (a.pageViews !== undefined && b.pageViews !== undefined) {
      return b.pageViews - a.pageViews;
    }
    return b.sessions - a.sessions;
  });
}

async function runGa4Report(body) {
  const propertyId = requireSeoEnv("GA4_PROPERTY_ID");
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
  const response = await googleApiFetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return {
    propertyId,
    response,
  };
}

export async function fetchGa4Overview() {
  const propertyId = requireSeoEnv("GA4_PROPERTY_ID");
  const endDate = formatDateOffset(1);
  const startDate = formatDateOffset(30);

  const [organicLanding, rawLanding, rawPages] = await Promise.all([
    runGa4Report({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: "landingPagePlusQueryString" },
        { name: "sessionDefaultChannelGroup" },
      ],
      metrics: [
        { name: "sessions" },
        { name: "engagedSessions" },
        { name: "totalUsers" },
        { name: "conversions" },
      ],
      dimensionFilter: {
        filter: {
          fieldName: "sessionDefaultChannelGroup",
          stringFilter: {
            matchType: "EXACT",
            value: "Organic Search",
          },
        },
      },
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 25,
    }),
    runGa4Report({
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: "landingPagePlusQueryString" },
        { name: "sessionDefaultChannelGroup" },
      ],
      metrics: [
        { name: "sessions" },
        { name: "engagedSessions" },
        { name: "totalUsers" },
        { name: "conversions" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 50,
    }),
    runGa4Report({
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "pagePathPlusQueryString" }],
      metrics: [
        { name: "screenPageViews" },
        { name: "sessions" },
        { name: "totalUsers" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 50,
    }),
  ]);

  return {
    propertyId,
    startDate,
    endDate,
    organicLandingPages: aggregateRows(normalizeRows(organicLanding.response.rows, (dimensions, metrics) => ({
      landingPage: dimensions[0]?.value || "",
      channelGroup: dimensions[1]?.value || "",
      sessions: Number(metrics[0]?.value || 0),
      engagedSessions: Number(metrics[1]?.value || 0),
      totalUsers: Number(metrics[2]?.value || 0),
      conversions: Number(metrics[3]?.value || 0),
    })), "landingPage"),
    rawLandingPages: aggregateRows(normalizeRows(rawLanding.response.rows, (dimensions, metrics) => ({
      landingPage: dimensions[0]?.value || "",
      channelGroup: dimensions[1]?.value || "",
      sessions: Number(metrics[0]?.value || 0),
      engagedSessions: Number(metrics[1]?.value || 0),
      totalUsers: Number(metrics[2]?.value || 0),
      conversions: Number(metrics[3]?.value || 0),
    })), "landingPage"),
    rawPages: aggregateRows(normalizeRows(rawPages.response.rows, (dimensions, metrics) => ({
      pagePath: dimensions[0]?.value || "",
      pageViews: Number(metrics[0]?.value || 0),
      sessions: Number(metrics[1]?.value || 0),
      totalUsers: Number(metrics[2]?.value || 0),
    })), "pagePath"),
  };
}
