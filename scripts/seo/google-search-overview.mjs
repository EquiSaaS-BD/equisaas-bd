import { fetchSearchConsoleOverview } from "./lib/search-console.mjs";

try {
  const overview = await fetchSearchConsoleOverview();

  console.log(
    JSON.stringify(
      {
        ok: true,
        ...overview,
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
