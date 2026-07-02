import { googleApiFetch, getSavedGoogleTokenStatus } from "./lib/google-auth.mjs";

try {
  const status = getSavedGoogleTokenStatus();
  if (!status.exists) {
    throw new Error("Google token missing. Run `npm run seo:google:login` first.");
  }

  const body = await googleApiFetch("https://www.googleapis.com/webmasters/v3/sites");
  console.log(
    JSON.stringify(
      {
        ok: true,
        count: Array.isArray(body.siteEntry) ? body.siteEntry.length : 0,
        sites: (body.siteEntry || []).map((site) => ({
          siteUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
        })),
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
