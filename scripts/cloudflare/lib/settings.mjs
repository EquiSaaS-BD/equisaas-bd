export const SAFE_BASELINE_SETTINGS = [
  {
    id: "ssl",
    desired: "strict",
    reason: "Keeps Cloudflare to origin encryption in strict mode.",
  },
  {
    id: "always_use_https",
    desired: "on",
    reason: "Forces all visitors onto HTTPS.",
  },
  {
    id: "automatic_https_rewrites",
    desired: "on",
    reason: "Reduces mixed-content problems on public pages.",
  },
  {
    id: "brotli",
    desired: "on",
    reason: "Improves compression efficiency.",
  },
  {
    id: "early_hints",
    desired: "on",
    reason: "Improves perceived loading for supporting browsers.",
  },
  {
    id: "http3",
    desired: "on",
    reason: "Enables modern transport support.",
  },
  {
    id: "ipv6",
    desired: "on",
    reason: "Keeps IPv6 delivery enabled.",
  },
  {
    id: "tls_1_3",
    desired: "on",
    reason: "Keeps TLS 1.3 enabled.",
  },
  {
    id: "min_tls_version",
    desired: "1.2",
    reason: "Disables outdated TLS 1.0/1.1 for visitors.",
  },
  {
    id: "replace_insecure_js",
    desired: "on",
    reason: "Helps repair insecure script references when possible.",
  },
  {
    id: "rocket_loader",
    desired: "off",
    reason: "Avoids JavaScript execution surprises on app pages.",
  },
];

export function pickImportantSettings(settings) {
  const wanted = new Set([
    "ssl",
    "always_use_https",
    "automatic_https_rewrites",
    "brotli",
    "browser_cache_ttl",
    "cache_level",
    "early_hints",
    "http3",
    "ipv6",
    "min_tls_version",
    "replace_insecure_js",
    "rocket_loader",
    "security_level",
    "tls_1_3",
  ]);

  return settings.filter((setting) => wanted.has(setting.id));
}
