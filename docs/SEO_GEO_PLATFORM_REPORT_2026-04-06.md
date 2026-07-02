# EquiSaaS BD SEO and GEO Report

Date: April 6, 2026
Primary domain: https://equisaas-bd.com/
Firebase project: equisaas-bd

## What is already implemented in code

### Core technical SEO
- Canonical public domain is `https://equisaas-bd.com`
- Crawlable homepage metadata and static fallback content
- XML sitemap at `/sitemap.xml`
- Video sitemap at `/video-sitemap.xml`
- `robots.txt` at root
- Clean title tags and meta descriptions for key public pages
- Open Graph metadata across important public pages
- Twitter card metadata across important public pages
- Page-level canonical tags
- Noindex on thin or utility surfaces where appropriate
- `BingSiteAuth.xml` hosted at root
- Site manifest and icons configured

### Search intent pages
- Homepage
- Founder page
- Open tech cooperative page
- Software training page
- SME software page
- Orientation page
- LMS landing page

### Structured data
- `Organization`
- `Person`
- `WebSite`
- `WebPage`
- `AboutPage`
- `BreadcrumbList`
- `FAQPage`
- `VideoObject`

### GEO and AI-answer-engine readiness
- Public robots rules kept open
- Explicit allow rules for:
  - OAI-SearchBot
  - GPTBot
  - ChatGPT-User
  - PerplexityBot
  - Perplexity-User
  - Claude-SearchBot
  - Claude-User
  - ClaudeBot
- `llms.txt` published at root
- Structured data strengthened with founder, organization, and official links
- Video discovery support for orientation content

### Bing and real-time indexing
- Bing verification file already hosted
- IndexNow key file published at root
- IndexNow submit script available locally

### Audits available locally
- `npm run audit:seo`
- `npm run audit:seo:social`
- `npm run audit:seo:full`
- `npm run audit:lms`
- `npm --prefix lms run audit:v1`
- `npm --prefix lms run audit:catalog`
- `npm --prefix lms run audit:resources`

### Supporting rollout docs
- `docs/SEARCH_CONSOLE_SUBMISSION_CHECKLIST_2026-04-06.md`

## Platforms to configure manually

### Google Search Console
1. Verify the domain property for `equisaas-bd.com`
2. Submit:
   - `https://equisaas-bd.com/sitemap.xml`
   - `https://equisaas-bd.com/video-sitemap.xml`
3. Request indexing for:
   - homepage
   - founder page
   - open tech cooperative page
   - software training page
   - SME software page
   - orientation page
   - LMS homepage
4. Check:
   - indexing status
   - canonical report
   - video indexing report
   - page experience

### Bing Webmaster Tools
1. Verify the site
2. Submit:
   - `https://equisaas-bd.com/sitemap.xml`
   - `https://equisaas-bd.com/video-sitemap.xml`
3. Inspect the same important URLs
4. Check Index Coverage, URL Inspection, and IndexNow history

### IndexNow
Use after important page updates.

Command:
```powershell
cd "D:\projects\EquiSaaS BD"
node scripts/submit-indexnow.mjs
```

Optional targeted submission:
```powershell
cd "D:\projects\EquiSaaS BD"
node scripts/submit-indexnow.mjs "https://equisaas-bd.com/" "https://equisaas-bd.com/orientation-2026/"
```

### ChatGPT Search and OpenAI discovery
- Keep `OAI-SearchBot` allowed
- Keep canonical URLs stable
- Keep structured data and citations strong
- Continue publishing factual public pages

### Perplexity discovery
- Keep `PerplexityBot` allowed
- Ensure your WAF or CDN does not accidentally block Perplexity IP ranges if you later add strict firewall rules

### Claude discovery
- Keep `Claude-SearchBot` and `Claude-User` allowed
- If you later want search visibility but not training-style crawling, review `ClaudeBot` rules separately

## Recommended live workflow after any important SEO update
1. Run:
```powershell
cd "D:\projects\EquiSaaS BD"
npm run audit:seo:full
npm run build
$env:FUNCTIONS_DISCOVERY_TIMEOUT='30'
npm run firebase:deploy
node scripts/submit-indexnow.mjs
```
2. Re-submit the changed URLs in Google Search Console
3. Re-submit the changed URLs in Bing Webmaster Tools if needed

## Important caution
- None of this guarantees a number one ranking
- It does maximize crawlability, discoverability, entity clarity, snippet quality, social share quality, and AI-search readiness
- Continue publishing original, factual, high-trust content for the best long-term result
