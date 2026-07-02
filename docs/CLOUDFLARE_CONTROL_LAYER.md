# Cloudflare Control Layer

This project now includes a lightweight Cloudflare automation layer for EquiSaaS BD.

It is designed for:
- verifying the Cloudflare token
- checking zone health quickly
- listing DNS records from the CLI
- purging Cloudflare cache after important updates

It does **not** replace Firebase deployment. Firebase Hosting remains the deployment source of truth for the site build.

## 1. Local env setup

Create a local `.env`, `.env.local`, `.env.cloudflare`, or `.env.cloudflare.local` file in the repo root from `.env.example` and set:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ZONE_ID`
- `CLOUDFLARE_ZONE_NAME`

Recommended minimum token scope for the current scripts:
- token verification access
- zone read
- DNS read
- cache purge

If you later add DNS write scripts, expand the token only as needed.

If you prefer to keep Cloudflare secrets separate from the rest of the app, use `.env.cloudflare.local`. It is ignored by Git and loaded automatically by the scripts.

## 2. Available commands

### Verify the token

```bash
npm run cf:token:verify
```

### Check the zone summary

```bash
npm run cf:zone:summary
```

### Audit important zone settings

```bash
npm run cf:settings:audit
```

### Apply the safe baseline to core settings

```bash
npm run cf:settings:apply-safe
```

### List all DNS records

```bash
npm run cf:dns:list
```

### List only one DNS type

```bash
npm run cf:dns:list -- CNAME
```

### Export a DNS snapshot

```bash
npm run cf:dns:export
```

### Purge selected URLs from Cloudflare cache

```bash
npm run cf:cache:purge -- https://equisaas-bd.com/ https://equisaas-bd.com/founder/
```

### Purge everything

```bash
npm run cf:cache:purge -- --everything
```

Use full purge carefully. For day-to-day updates, targeted URL purges are safer.

### Purge the public release set after deploy

```bash
npm run cf:cache:purge:release
```

This purges the homepage, public marketing pages from `sitemap.xml`, key public LMS entry routes, `robots.txt`, `sitemap.xml`, `version.json`, and related public release URLs.

### Build, deploy Hosting, then purge Cloudflare

```bash
npm run release:hosting
```

This is the safest default release command for the current stack.

### Ensure managed WAF is deployed

```bash
npm run cf:waf:ensure
```

## 3. Recommended operating model

- Firebase CLI: deploy site builds
- Cloudflare Dashboard: one-time zone setup, SSL/TLS, WAF, rules
- Cloudflare scripts in this repo: routine inspection and safe cache operations

## 4. Good next upgrades

Future scripts that can be added safely:
- DNS diff/sync export
- redirect rule audit
- SSL/TLS settings audit
- crawler/robots diagnostics
- cache tag strategy if the app later adopts edge tagging
