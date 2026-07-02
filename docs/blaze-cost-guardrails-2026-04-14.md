# Blaze Cost Guardrails

Date: 2026-04-14

## Goal

Keep EquiSaaS BD on the Blaze plan only for the features that truly require it, while minimizing the chance of real card charges.

## Current Blaze-dependent surfaces

- `certificateEntryPage`
  Used for crawler-friendly certificate share metadata on `/lms/certificate`.
- `certificateShareImage`
  Used for certificate-specific OG image generation on `/lms/certificate-image`.
- `onUserCreated`
  Sends welcome email and creates admin notifications when a new LMS user document is created.
- `onPointsLedgerCreated`
  Syncs department leaderboard records from approved points.
- `onPointsLedgerDeleted`
  Cleans leaderboard totals when ledger entries are removed.
- `resendEmailWebhook`
  Handles inbound and delivery webhook events for email tracing.

## Cost-risk notes

- Blaze does not hard-cap cost.
- Firebase Hosting, Firestore, and Cloud Functions still benefit from no-cost quotas on Blaze.
- The biggest avoidable risk is unnecessary function invocation volume, not the existence of Blaze itself.
- Certificate share routes are the most visible HTTP function surface because social crawlers can hit them repeatedly.

## Guardrails already in place

- No scheduled summarizer function remains in production.
- Certificate share functions now use longer public cache headers to reduce repeated crawler hits.
- Certificate share HTTP functions are capped with low `maxInstances` to avoid unnecessary scale-out on crawler bursts.
- Static landing and LMS surfaces are still served from Hosting rather than moved into extra server infrastructure.
- Shared language and theme state now stays client-side in local storage only.

## Operational checklist

- Keep Google Cloud budget alerts enabled.
- Keep anomaly detection checked in Cloud Billing.
- Avoid enabling new scheduled jobs unless they are absolutely necessary.
- Avoid BigQuery export, paid AI features, or extra server runtimes unless there is a measured need.
- Reuse current certificate share functions instead of adding new HTTP image endpoints.
- Prefer static Hosting pages for public SEO content whenever possible.

## Honest limit

It is possible to stay at zero charge on Blaze if total usage stays inside free quotas, but it cannot be guaranteed forever by code alone. Monitoring and billing alerts are still required.
