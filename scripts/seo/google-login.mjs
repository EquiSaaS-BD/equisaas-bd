import { runGoogleOAuthLogin } from "./lib/google-auth.mjs";

try {
  const result = await runGoogleOAuthLogin();
  console.log(JSON.stringify(result, null, 2));
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
