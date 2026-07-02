# EquiSaaS BD Domain Transition And Email Strategy

## Public domain baseline

- Primary public website: `https://equisaas-bd.com/`
- Primary LMS entry: `https://equisaas-bd.com/lms`
- Legacy Hosting fallback: `https://equisaas-bd.web.app/`
- Current status on April 6, 2026:
  - apex `equisaas-bd.com` resolves and serves Hosting
  - `www.equisaas-bd.com` is not configured yet

## Codebase transition notes

- Landing SEO metadata, canonical URL, robots, and sitemap now promote `equisaas-bd.com`.
- LMS metadata now uses `equisaas-bd.com` as the canonical base and keeps `/lms` as the canonical path.
- Public presentation surfaces now show `equisaas-bd.com` as the main brand domain.
- `web.app` remains a valid technical fallback host, but it should no longer be the primary public-facing brand URL.

## Public brand transition checklist

- Update the Facebook Page website field to `https://equisaas-bd.com/`.
- Update the YouTube channel link, support channel references, and outreach decks to `https://equisaas-bd.com/`.
- Keep the `web.app` hostname active as a fallback until `www` and all auth checks are fully stable.
- Add `equisaas-bd.com` and `www.equisaas-bd.com` to Firebase Auth authorized domains.
- Add `www.equisaas-bd.com` in Firebase Hosting and redirect it to the apex domain.
- Add the domain property to Google Search Console and submit `https://equisaas-bd.com/sitemap.xml`.

## Email domain strategy

- Keep welcome email delivery on the Resend test sender until the sending subdomain is verified.
- Recommended sending subdomain: `updates.equisaas-bd.com`
- Recommended transactional sender: `EquiSaaS BD <welcome@updates.equisaas-bd.com>`
- Optional reply-to after inbox planning is ready:
  - `community@equisaas-bd.com`
  - or another monitored support inbox

## Functions configuration

The welcome email function now supports these deploy-time params:

- `WELCOME_EMAIL_FROM`
- `WELCOME_EMAIL_REPLY_TO`

Default behavior:

- `WELCOME_EMAIL_FROM` falls back to `EquiSaaS BD <onboarding@resend.dev>`
- `WELCOME_EMAIL_REPLY_TO` stays empty until an inbox is ready

## Resend rollout steps

1. Verify `updates.equisaas-bd.com` inside Resend.
2. Add the SPF and DKIM records in Spaceship DNS exactly as Resend provides them.
3. Set the Functions param for the verified sender before the next Functions deploy.
4. Keep `RESEND_API_KEY` in Firebase Secret Manager only.
5. Deploy the welcome-email function after the verified sender is ready.

## Safe production values

Use these once the subdomain is verified:

```text
WELCOME_EMAIL_FROM=EquiSaaS BD <welcome@updates.equisaas-bd.com>
WELCOME_EMAIL_REPLY_TO=
```

## Verification after rollout

- Register one safe test user from the LMS on the primary domain.
- Confirm the `users/{uid}` document is created.
- Confirm `onUserCreated` logs a queued email without sender warnings.
- Confirm Resend shows the email as accepted from the verified subdomain.
- Re-test:
  - `https://equisaas-bd.com/`
  - `https://equisaas-bd.com/lms`
  - `https://equisaas-bd.com/lms/login`
