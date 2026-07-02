import { V1_RESOURCE_CATALOG } from "../lib/resource-catalog.js";

const KNOWN_BROWSER_ONLY_PATTERNS = [
  /OpenLearn/i,
  /Canva Design School/i,
  /Coursera/i,
  /Test Automation University/i,
  /Salesforce Trailhead/i,
  /Muktopaath/i,
];

const resources = V1_RESOURCE_CATALOG.flatMap((department) =>
  department.lessons.map((lesson) => ({
    departmentId: department.departmentId,
    lessonId: lesson.id,
    title: lesson.title,
    providerName: lesson.providerName,
    originalUrl: lesson.externalUrl,
    preferredUrl: lesson.preferredUrl || lesson.externalUrl,
  })),
);

const fetchTitle = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return "";

  const text = await response.text();
  const match = text.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim().replace(/\s+/g, " ") : "";
};

const auditResource = async (resource) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(resource.preferredUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        "accept-language": "en-US,en;q=0.9,bn;q=0.8",
      },
    });

    const title = await fetchTitle(response);
    const browserOnly = KNOWN_BROWSER_ONLY_PATTERNS.some((pattern) => pattern.test(resource.providerName));

    return {
      ...resource,
      status: response.status,
      ok: response.ok || browserOnly,
      browserOnly,
      finalUrl: response.url,
      title,
    };
  } catch (error) {
    const browserOnly = KNOWN_BROWSER_ONLY_PATTERNS.some((pattern) => pattern.test(resource.providerName));
    return {
      ...resource,
      status: "ERR",
      ok: browserOnly,
      browserOnly,
      finalUrl: "",
      title: "",
      error: String(error?.message || error),
    };
  } finally {
    clearTimeout(timeout);
  }
};

const results = [];
for (const resource of resources) {
  results.push(await auditResource(resource));
}

const hardFailures = results.filter((item) => !item.ok && !item.browserOnly);
const browserOnlyWarnings = results.filter((item) => item.browserOnly && item.status !== 200);
const redirected = results.filter((item) => item.finalUrl && item.finalUrl !== item.preferredUrl);

const report = {
  totals: {
    resources: results.length,
    hardFailures: hardFailures.length,
    browserOnlyWarnings: browserOnlyWarnings.length,
    redirected: redirected.length,
  },
  hardFailures,
  browserOnlyWarnings,
  redirected,
};

console.log(JSON.stringify(report, null, 2));

if (hardFailures.length) {
  process.exit(1);
}
