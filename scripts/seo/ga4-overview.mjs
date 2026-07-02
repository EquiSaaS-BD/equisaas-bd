import { fetchGa4Overview } from "./lib/ga4.mjs";

try {
  const overview = await fetchGa4Overview();

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
