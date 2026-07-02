import { callCloudflare, ensureConfig, printJson } from "./lib/context.mjs";

const { accountId, apiToken } = ensureConfig(["CLOUDFLARE_API_TOKEN"]);
const isAccountOwnedToken = apiToken.startsWith("cfat_");

if (isAccountOwnedToken && !accountId) {
  console.error(
    JSON.stringify(
      {
        ok: false,
        message: "Account-owned token detected, but CLOUDFLARE_ACCOUNT_ID is missing.",
        hint:
          "Add CLOUDFLARE_ACCOUNT_ID to .env.cloudflare.local, then run npm run cf:token:verify again.",
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

const data = await callCloudflare(
  isAccountOwnedToken && accountId
    ? `/accounts/${accountId}/tokens/verify`
    : "/user/tokens/verify",
  {
    method: "GET",
  },
);

printJson({
  ok: true,
  status: data.result?.status || "unknown",
  tokenId: data.result?.id || null,
  notBefore: data.result?.not_before || null,
  expiresOn: data.result?.expires_on || null,
  tokenType: isAccountOwnedToken ? "account" : "user",
});
