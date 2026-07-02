const FEED_PREFIX = "/erp-pos/stable";
const GITHUB_REPOSITORY = "kholipha-ahmmad-al-amin/BdErpPos";
const DEFAULT_TARGET_ORIGIN = "https://equisaas-bd.com";
const USER_AGENT = "EquiSaaS-BD-Private-Updates-Proxy";

const RELEASE_METADATA_FILES = new Set([
  "RELEASES",
  "releases.win.json",
  "assets.win.json",
]);

const RELEASE_BINARY_FILES = new Set([
  "BdErpPos-win-Setup.exe",
  "BdErpPos-win-Portable.zip",
]);

const CONTENT_TYPES = new Map([
  ["RELEASES", "text/plain; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".nupkg", "application/octet-stream"],
  [".zip", "application/zip"],
  [".exe", "application/x-msdownload"],
]);

function normalizeFeedPath(pathname) {
  if (pathname === "/" || pathname === "") {
    return `${FEED_PREFIX}/index.html`;
  }

  if (pathname === FEED_PREFIX || pathname === `${FEED_PREFIX}/`) {
    return `${FEED_PREFIX}/index.html`;
  }

  if (pathname === "/stable" || pathname === "/stable/") {
    return `${FEED_PREFIX}/index.html`;
  }

  if (pathname.startsWith("/stable/")) {
    return `${FEED_PREFIX}${pathname.slice("/stable".length)}`;
  }

  if (pathname.startsWith(`${FEED_PREFIX}/`)) {
    return pathname;
  }

  if (
    pathname === "/RELEASES" ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".nupkg") ||
    pathname.endsWith(".zip") ||
    pathname.endsWith(".exe")
  ) {
    return `${FEED_PREFIX}${pathname}`;
  }

  return null;
}

function getFileName(feedPath) {
  try {
    const fileName = decodeURIComponent(feedPath.split("/").pop() || "");
    if (!fileName || fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
      return null;
    }

    return fileName;
  } catch {
    return null;
  }
}

function getPackageVersion(fileName) {
  const match = fileName.match(/^BdErpPos-(\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?)-(?:full|delta)\.nupkg$/);
  return match?.[1] ?? null;
}

function normalizeReleaseTag(value) {
  if (!value) {
    return null;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.startsWith("v") ? trimmed : `v${trimmed}`;
}

function getRequestedReleaseTag(fileName, env) {
  const packageVersion = getPackageVersion(fileName);
  if (packageVersion) {
    return `v${packageVersion}`;
  }

  return normalizeReleaseTag(env.LATEST_RELEASE_TAG || env.LATEST_RELEASE_VERSION);
}

function isReleaseAssetAllowed(fileName) {
  return RELEASE_METADATA_FILES.has(fileName) ||
    RELEASE_BINARY_FILES.has(fileName) ||
    getPackageVersion(fileName) !== null;
}

function getContentType(fileName, fallback) {
  if (CONTENT_TYPES.has(fileName)) {
    return CONTENT_TYPES.get(fileName);
  }

  for (const [extension, contentType] of CONTENT_TYPES.entries()) {
    if (fileName.endsWith(extension)) {
      return contentType;
    }
  }

  return fallback || "application/octet-stream";
}

function githubHeaders(env, accept = "application/vnd.github+json") {
  return {
    "accept": accept,
    "authorization": `Bearer ${env.GITHUB_TOKEN}`,
    "user-agent": USER_AGENT,
    "x-github-api-version": "2022-11-28",
  };
}

function errorResponse(message, status) {
  return new Response(message, {
    status,
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "no-cache, no-store, must-revalidate",
      "content-type": "text/plain; charset=utf-8",
      "x-equisaas-updates-feed": "bd-erp-pos-stable",
    },
  });
}

async function getRelease(env, requestedTag) {
  const apiPath = requestedTag
    ? `/repos/${GITHUB_REPOSITORY}/releases/tags/${encodeURIComponent(requestedTag)}`
    : `/repos/${GITHUB_REPOSITORY}/releases/latest`;

  const response = await fetch(`https://api.github.com${apiPath}`, {
    headers: githubHeaders(env),
  });

  if (!response.ok) {
    throw new Error(`GitHub release lookup failed with HTTP ${response.status}`);
  }

  return response.json();
}

async function fetchReleaseAsset(request, env, fileName) {
  if (!env.GITHUB_TOKEN) {
    return errorResponse("Update proxy is not configured. Cloudflare secret GITHUB_TOKEN is missing.", 503);
  }

  if (!isReleaseAssetAllowed(fileName)) {
    return errorResponse("Requested update asset is not allowed.", 404);
  }

  let release;
  try {
    release = await getRelease(env, getRequestedReleaseTag(fileName, env));
  } catch (error) {
    return errorResponse(`Update release is not available: ${error.message}`, 502);
  }

  const asset = release.assets?.find((candidate) => candidate.name === fileName);
  if (!asset) {
    return errorResponse("Requested update asset was not found in the approved release.", 404);
  }

  const upstreamHeaders = new Headers(githubHeaders(env, "application/octet-stream"));
  const range = request.headers.get("range");
  if (range) {
    upstreamHeaders.set("range", range);
  }

  const upstream = await fetch(asset.url, {
    method: request.method === "HEAD" ? "HEAD" : "GET",
    headers: upstreamHeaders,
    redirect: "follow",
  });

  const headers = new Headers();
  for (const headerName of [
    "accept-ranges",
    "content-disposition",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
  ]) {
    const value = upstream.headers.get(headerName);
    if (value) {
      headers.set(headerName, value);
    }
  }

  headers.set("access-control-allow-origin", "*");
  headers.set("content-type", getContentType(fileName, upstream.headers.get("content-type")));
  headers.set("x-equisaas-updates-feed", "bd-erp-pos-stable");

  if (RELEASE_METADATA_FILES.has(fileName)) {
    headers.set("cache-control", "no-cache, no-store, must-revalidate");
  } else {
    headers.set("cache-control", "public, max-age=300");
  }

  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

function renderFeedIndex() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>EquiSaaS BD ERP POS Updates</title>
</head>
<body>
  <main>
    <h1>BD ERP POS stable update feed</h1>
    <ul>
      <li><a href="/erp-pos/stable/RELEASES">RELEASES</a></li>
      <li><a href="/erp-pos/stable/releases.win.json">releases.win.json</a></li>
      <li><a href="/erp-pos/stable/assets.win.json">assets.win.json</a></li>
    </ul>
  </main>
</body>
</html>`;
}

function feedResponse(body, status = 200, contentType = "text/html; charset=utf-8") {
  return new Response(body, {
    status,
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "no-cache, no-store, must-revalidate",
      "content-type": contentType,
      "x-equisaas-updates-feed": "bd-erp-pos-stable",
    },
  });
}

async function fetchOriginFile(request, env, feedPath, fileName, incomingSearch) {
  const targetOrigin = env.TARGET_ORIGIN || DEFAULT_TARGET_ORIGIN;
  const targetUrl = new URL(`${feedPath}${incomingSearch}`, targetOrigin);

  const upstream = await fetch(targetUrl, {
    method: request.method === "HEAD" ? "HEAD" : "GET",
    headers: {
      "user-agent": request.headers.get("user-agent") || USER_AGENT,
    },
    redirect: "follow",
  });

  const headers = new Headers(upstream.headers);
  headers.set("access-control-allow-origin", "*");
  headers.set("content-type", getContentType(fileName, headers.get("content-type")));
  headers.set("cache-control", "no-cache, no-store, must-revalidate");
  headers.set("x-equisaas-updates-feed", "bd-erp-pos-stable");

  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET, HEAD, OPTIONS",
          "access-control-allow-headers": "range, user-agent",
          "access-control-max-age": "86400",
        },
      });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return errorResponse("Method not allowed.", 405);
    }

    const incomingUrl = new URL(request.url);
    const feedPath = normalizeFeedPath(incomingUrl.pathname);
    if (!feedPath) {
      return errorResponse("BD ERP POS update feed path not found.", 404);
    }

    const fileName = getFileName(feedPath);
    if (!fileName) {
      return errorResponse("Invalid update feed path.", 400);
    }

    if (fileName === "index.html") {
      return feedResponse(request.method === "HEAD" ? null : renderFeedIndex());
    }

    if (RELEASE_METADATA_FILES.has(fileName)) {
      return fetchOriginFile(request, env, feedPath, fileName, incomingUrl.search);
    }

    return fetchReleaseAsset(request, env, fileName);
  },
};
