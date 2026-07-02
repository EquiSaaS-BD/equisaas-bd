# EquiSaaS BD SEO Execution And Action Plan

## What was implemented in code

- Keyword-focused page intent is now reinforced through real ranking surfaces:
  - page titles
  - meta descriptions
  - H1 / visible hero copy
  - internal links
  - structured data
- Official organization/contact/social signals are now present across public landing surfaces and crawlable HTML.
- Home, founder, software training, open tech cooperative, SME software, and orientation pages now carry stronger structured data coverage.
- `robots.txt`, `sitemap.xml`, and `video-sitemap.xml` are now generated through a build step so they stay fresh.
- The homepage description was tightened to stay inside the project audit thresholds.
- The `meta keywords` tag was removed from the homepage because Google Search does not use it for ranking.

## Primary keyword clusters

### Brand cluster

- EquiSaaS
- EquiSaaS BD
- EquiSaaS Bangladesh
- Kholipha Ahmmad Al-Amin
- খলিফা আহম্মেদ আল-আমিন

### Cooperative cluster

- Bangladesh's first open tech cooperative
- open tech cooperative Bangladesh
- community-driven SaaS Bangladesh
- sweat equity Bangladesh

### Training cluster

- software training Bangladesh
- LMS Bangladesh
- proof-based learning Bangladesh
- frontend training Bangladesh
- backend training Bangladesh

### SME software cluster

- SME software Bangladesh
- HR payroll software Bangladesh
- POS software Bangladesh
- pharmacy inventory software Bangladesh

## Target page map

### Home

- `/`
- main targets:
  - EquiSaaS BD
  - Bangladesh's first open tech cooperative
  - bilingual LMS
  - sweat equity
  - Bangladesh SME SaaS

### Founder page

- `/founder/`
- main targets:
  - Kholipha Ahmmad Al-Amin
  - founder of EquiSaaS BD
  - CEO of EquiSaaS BD

### Training page

- `/software-training-bangladesh/`
- main targets:
  - software training Bangladesh
  - LMS Bangladesh
  - practical tech learning in Bangladesh

### Cooperative page

- `/open-tech-cooperative-bangladesh/`
- main targets:
  - Bangladesh's first open tech cooperative
  - open tech cooperative Bangladesh
  - sweat equity cooperative

### SME page

- `/sme-software-bangladesh/`
- main targets:
  - SME software Bangladesh
  - HR payroll software Bangladesh
  - POS software Bangladesh
  - pharmacy inventory software Bangladesh

### Orientation page

- `/orientation-2026/`
- main targets:
  - EquiSaaS BD Orientation 2026
  - open tech cooperative orientation
  - sweat equity roadmap Bangladesh

## Commands

```bash
npm run sync:seo-assets
npm run audit:seo
npm run audit:seo:social
npm run build
npm run release:hosting
npm run submit:indexnow
```

## What to do manually

### 1. Google Search Console

- Go to:
  - `https://search.google.com/search-console`
- Check these areas:
  - `URL Inspection`
  - `Page indexing`
  - `Sitemaps`
  - `Search results`
  - `Enhancements`
  - `Video pages`
- Submit:
  - `https://equisaas-bd.com/sitemap.xml`
  - `https://equisaas-bd.com/video-sitemap.xml`
- Inspect and request indexing for:
  - home page
  - founder page
  - software training page
  - open tech cooperative page
  - SME software page
  - orientation page
- Track weekly:
  - queries
  - clicks
  - impressions
  - average position

### 2. Bing Webmaster Tools

- Go to:
  - `https://www.bing.com/webmasters/about`
- Verify the site if needed.
- Existing verification file in repo:
  - `landing/public/BingSiteAuth.xml`
- Submit:
  - `https://equisaas-bd.com/sitemap.xml`
  - `https://equisaas-bd.com/video-sitemap.xml`
- Check:
  - URL inspection
  - crawl information
  - index coverage
  - search performance

### 3. IndexNow

- Manual docs:
  - `https://www.indexnow.org/faq`
  - `https://www.bing.com/indexnow/getstarted`
- Current repo support already exists:
  - key file in `landing/public/equisaas-bd-20260406-seo.txt`
  - script: `scripts/submit-indexnow.mjs`
- After major public-page updates, run:

```bash
npm run submit:indexnow
```

### 4. Google Business Profile

- Go to:
  - `https://business.google.com/`
- Keep updated:
  - category
  - business description
  - phone
  - website
  - address
  - hours
  - services
  - photos
- Use the `Updates` section regularly with:
  - orientation updates
  - workshop announcements
  - founder/community highlights
  - software roadmap updates

### 5. YouTube Studio

- Go to:
  - `https://studio.youtube.com/`
- Update:
  - channel description
  - profile links
  - featured links
  - playlist structure
  - video descriptions
  - pinned comments
- Every major video should link back to:
  - website
  - registration form
  - WhatsApp support
  - founder page

### 6. LinkedIn Company Page

- Go to:
  - your LinkedIn company page admin view
- Update:
  - tagline
  - about section
  - website
  - industry
  - headquarters
  - custom button/link
- Pin key posts about:
  - the cooperative model
  - orientation
  - founder story
  - learning departments

### 7. Facebook Page and Group

- Update page `About`, CTA button, website link, WhatsApp, and address.
- Keep one pinned post containing:
  - registration form
  - WhatsApp support
  - LMS
  - founder page
  - orientation

### 8. GitHub Organization

- Go to:
  - `https://github.com/orgs/EquiSaaS-BD/`
- Update:
  - organization profile description
  - public README/profile
  - website link
  - social links
- Keep the organization profile aligned with:
  - open tech cooperative
  - Bangladesh-first SaaS
  - Sweat Equity

## Weekly operating rhythm

- Check Search Console query movement.
- Check Bing Webmaster index status.
- Publish at least one Google Business Profile update.
- Publish one LinkedIn or Facebook post that links to a strategic landing page.
- Review top landing pages in analytics and watch CTR on titles/descriptions.

## Monthly operating rhythm

- Refresh hero/support copy if priorities changed.
- Add one new founder or community visual.
- Run SEO audits:

```bash
npm run audit:seo:full
```

- Re-submit changed public pages through IndexNow.

## Important note

Google Search does not use the `meta keywords` tag for web ranking. For EquiSaaS BD, keyword SEO should focus on:

- title tags
- meta descriptions
- visible page copy
- internal links
- structured data
- sitemap quality
- entity consistency across web profiles
