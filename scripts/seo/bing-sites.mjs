import { requireSeoEnv } from "./lib/context.mjs";

const apiKey = requireSeoEnv("BING_WEBMASTER_API_KEY");

try {
  const endpoint = new URL("https://ssl.bing.com/webmaster/api.svc/json/GetUserSites");
  endpoint.searchParams.set("apikey", apiKey);

  const response = await fetch(endpoint);
  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status} ${JSON.stringify(body)}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        response: body,
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
