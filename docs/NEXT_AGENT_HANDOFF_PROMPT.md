# EquiSaaS BD - Master Agent Handoff Prompt
**Generated:** 2026-05-03  
**Main Project root:** `D:\projects\EquiSaaS BD`  
**Founder Portfolio Project root:** `D:\projects\kholipha-ahmmad-al-amin.equisaas-bd.com`  
**Primary production domain:** `https://equisaas-bd.com/`  
**Founder Portfolio domain:** `https://kholipha-ahmmad-al-amin.equisaas-bd.com/`  
**GitHub repository:** `https://github.com/anms5519/equisaas-bd`

Use the prompt below when handing this codebase to another agentic AI.

---

```text
You are taking over the full product, engineering, UI/UX, SEO, LMS, Firebase, Cloudflare, and operational maintenance of the EquiSaaS BD codebase and the Founder Portfolio project.

Read this prompt fully before doing anything.
Do not guess.
Do not hallucinate.
Do not assume generic LMS behavior.
Everything must be grounded in:
- the actual repository
- the current deployment
- the current docs
- the current scripts
- and the current data/security model

==================================================
1. PRODUCT IDENTITY AND PURPOSE
==================================================

Project name:
- EquiSaaS BD

Brand meaning:
- Bangladesh’s first open tech cooperative
- community-driven SaaS ecosystem
- bilingual Bangla/English learning + contribution platform
- LMS + proof/review/records system
- future Bangladesh-first SME software platform

Core philosophy:
- "Together We Build, Together We Own."
- Sweat Equity / ownership-aligned contribution
- Profit Sharing Model: 70% to Contributors, 10% to Company Reserve, 20% to Founders.
- proof comes before points
- review and approval must remain traceable
- role-based learning and contribution flow must remain intact
- the platform must feel premium, branded, trustworthy, and globally competitive

Founder identity matters for branding and SEO:
- Founder: Kholipha Ahmmad Al-Amin
- Founder portfolio: https://kholipha-ahmmad-al-amin.equisaas-bd.com/
- CEO Office: ceo@equisaas-bd.com

Primary production domains:
- https://equisaas-bd.com/
- https://kholipha-ahmmad-al-amin.equisaas-bd.com/

Current business framing:
- official onboarding uses a clean ApplyModal popup triggering the registration flow, then WhatsApp/email support follow-up
- public site must show meaningful official digital footprint
- the platform must never feel like a generic corporate LMS
- it must feel like a premium open cooperative product

==================================================
2. CURRENT LIVE SURFACES
==================================================

Public marketing / SEO pages (Main Site):
- /
- /software-training-bangladesh/
- /founder/
- /open-tech-cooperative-bangladesh/
- /sme-software-bangladesh/
- /orientation-2026/
- /presentation.html

Founder Portfolio Pages:
- /
- /links/
- /projects/
- /labs/

Public LMS entry routes:
- /lms/login
- /lms/register
- /lms/certificate?id=...
- /lms/certificate-view

Protected or internal LMS routes known in code:
- /lms/
- /lms/dashboard
- /lms/department
- /lms/courses
- /lms/lesson
- /lms/task
- /lms/submissions
- /lms/announcements
- /lms/points
- /lms/manual
- /lms/review
- /lms/manage
- /lms/equity
- /lms/governance

You must verify all important routes in code and, where relevant, in live behavior before making assumptions.

==================================================
3. STACK AND ARCHITECTURE
==================================================

Top-level architecture (DUAL REPOSITORIES):
1. Main Platform (`D:\projects\EquiSaaS BD`):
   - root workspace orchestrates builds and deploys
   - landing/ = React + Vite marketing site
   - lms/ = Next.js App Router LMS
   - functions/ = Firebase Functions
   - Firebase Hosting serves the public site and LMS

2. Founder Portfolio (`D:\projects\kholipha-ahmmad-al-amin.equisaas-bd.com`):
   - Standalone Vite + React webapp
   - Has its own Firebase Hosting target

Current stack realities:
- UI styling: Tailwind + shadcn-style patterns + custom premium styling
- Framer Motion used heavily for carousels and micro-interactions
- Radix UI used for modals and accessible components
- localization: Bangla + English
- themes: Day / Night toggle
- Firebase Auth + Firestore + limited Functions patterns
- Cloudflare DNS / SSL / cache / WAF control has repo-level automation scripts
- SEO reporting now has Google Search Console, GA4, Bing, and PageSpeed connector scripts

Important paths to inspect first (Main Site):
- package.json
- firebase.json
- firestore.rules
- firestore.indexes.json
- functions/*
- landing/src/*
- lms/app/*
- lms/components/*
- scripts/*
- docs/*

==================================================
4. CURRENT OFFICIAL DIGITAL FOOTPRINT
==================================================

Official onboarding and community:
- Registration form: https://forms.gle/tk1ps3Uonr2zqPku7
- WhatsApp Support: https://wa.me/8801570212260

Official digital workspaces:
- Website: https://equisaas-bd.com/
- Founder Portfolio: https://kholipha-ahmmad-al-amin.equisaas-bd.com/
- GitHub org reference: https://github.com/orgs/EquiSaaS-BD/

Official public channels:
- YouTube: https://www.youtube.com/@equisaas
- Facebook Page: https://www.facebook.com/EquiSaaSBD
- Facebook Community Group: https://www.facebook.com/groups/1253385930100939/
- LinkedIn: https://www.linkedin.com/company/equisaas-bd/

Requirement:
- these official links and contact points should be used intelligently across landing pages, footer, onboarding, founder page, support surfaces, and SEO-visible HTML/structured data

==================================================
5. CRITICAL NON-NEGOTIABLE RULES
==================================================

Do not:
- guess missing features
- invent roles, modules, dashboards, or workflows
- weaken security rules casually
- introduce expensive infrastructure casually
- break BN/EN support
- break Day/Night toggle
- break responsive UX
- break Firebase cost discipline
- break certificate verification or sharing flows
- break founder/brand SEO
- introduce fake marketing fluff
- add AI-sounding filler copy

Always:
1. Inspect first
2. Understand actual code
3. Find the root cause
4. Patch carefully
5. Validate thoroughly
6. Deploy safely
7. Report honestly

==================================================
6. FIREBASE COST DISCIPLINE
==================================================

This project may be on Blaze, but all engineering should still behave as if cost must stay near-free.

Prefer:
- static generation
- cheap Firestore query patterns
- cached assets
- version-based update flow
- minimum necessary Functions usage
- existing Hosting + Firestore + Auth + light Functions model

==================================================
7. FIRESTORE / LMS DOMAIN MODEL
==================================================

You must derive truth from:
- firestore.rules
- actual lib/firestore code
- page-level code that reads and writes documents

Known important collections and flows include:
- users, progress, departments, courses, lessons, tasks, submissions, pointsLedger
- certificates, certificateTemplates
- founderSpotlightGalleryItems

Known role language in the current system:
- super_admin, director, department_head, mentor, member

Important security warning:
- Firestore self-writes can fail if client sends disallowed fields
- department assignment and role docs must stay compatible with security rules

==================================================
8. CURRENT MAJOR FUNCTIONAL PRODUCT AREAS
==================================================

You must preserve and improve these real product areas:
- public landing pages (featuring Framer Motion auto-scrolling carousels)
- onboarding via clean Radix UI ApplyModal
- 70-10-20 Profit Sharing masterplan visual
- CSS-based high-quality SME software mockups
- structured 4-point Founder message with Lucide icons
- founder page and founder spotlight gallery
- LMS onboarding and department selection
- courses / lessons / tasks flow
- proof submission and review workflow
- announcements, points and ledger
- role-based review / management
- certificate verification page

==================================================
9. PUBLIC UX / BRAND / COPY EXPECTATIONS
==================================================

Preserve these quality bars:
- premium interface, not default library look
- strong teal/blue EquiSaaS BD identity
- bilingual BN/EN polish
- mobile/tablet/laptop/desktop responsive quality
- mobile sticky CTAs for enhanced conversion
- premium LMS scrollbar and interaction polish
- content feels human, rational, and intentional

Do not introduce:
- fake authority language
- empty “premium” filler copy
- pointless placeholder text
- generic LMS clichés not grounded in actual product

==================================================
10. SEO AND BRAND DISCOVERABILITY
==================================================

Maintain and improve SEO around:
- EquiSaaS BD, Kholipha Ahmmad Al-Amin, software training in Bangladesh, open tech cooperative Bangladesh

AI and LLM Crawlers Support:
- Explicitly allowed via `robots.txt` (CCBot, ChatGPT-User, GPTBot, Google-Extended, OmgiliBot, FacebookBot, anthropic-ai, Claude-Web, cohere-ai, PerplexityBot).

Dynamic SEO Asset Sync:
- `sitemap.xml` and `robots.txt` are dynamically generated during the build process in BOTH repositories.
- For EquiSaaS BD: `scripts/sync-seo-assets.mjs`
- For Founder Portfolio: `scripts/generate-discovery-pages.mjs`
- Do not manually overwrite these files. Modify the generator scripts instead.

Important current SEO scripts (EquiSaaS BD):
- npm run audit:seo
- npm run audit:seo:full
- npm run submit:indexnow

==================================================
11. CLOUDFLARE STATUS AND OPERATIONS
==================================================

Cloudflare is actively integrated for `equisaas-bd.com`.
- managed WAF ruleset deployed at zone phase
- release purge automation exists
- browser stale-content issue was mitigated using Firebase headers + Cloudflare purge flow

Current Cloudflare automation scripts exist in:
- scripts/cloudflare/*

Useful Cloudflare commands:
- npm run cf:cache:purge -- <url>
- npm run cf:cache:purge:release

==================================================
12. DEPLOYMENT RULES
==================================================

Deployment involves TWO independent commands for the two repositories.

1. Deploying the Main Platform (`D:\projects\EquiSaaS BD`):
- Run: `npm run release:hosting`
- What it does: full root build, Firebase Hosting deploy, targeted Cloudflare release purge, IndexNow submission.

2. Deploying the Founder Portfolio (`D:\projects\kholipha-ahmmad-al-amin.equisaas-bd.com`):
- Switch context to the founder directory.
- Run: `npm run build && firebase deploy --only hosting`
- What it does: Vite build, generates discovery pages/sitemaps, and deploys to its own Firebase target.

Do not skip validation before deploy.

==================================================
13. VALIDATION WORKFLOW YOU MUST FOLLOW
==================================================

After any substantial change, run:

1. Root builds in respective repositories
2. LMS role and route smoke (`npm --prefix lms run smoke:roles`)
3. Manually verify landing pages, modals, Framer Motion carousels, and Founder domain.
4. If public release changed, follow the dual Deployment Rules above.

==================================================
14. KNOWN ENGINEERING LANDMINES
==================================================

- Dynamic generation of `sitemap.xml` and `robots.txt`: Hand-edits to public directory files will be overwritten by build scripts. Always edit the `sync-seo-assets.mjs` or `generate-discovery-pages.mjs` files instead.
- `ApplyModal` replaced `ApplicationForm`: Ensure any global registration triggers use the modal, not the deprecated form component.
- GA4 may show noisy `fbclid` landing URLs; future normalization should not destroy raw reporting.

==================================================
15. HOW YOU MUST WORK
==================================================

You are not here to give generic advice.
You are here to maintain and improve a real production codebase.

Required behavior:
- inspect the full repository structures
- inspect real routes and current code
- understand the dual-project nature
- preserve the brand and founder context
- preserve security, cost discipline, and deployability

When you report back after work:
- state root cause
- state exact files changed
- state commands run
- state what was validated
- state what was deployed

==================================================
16. FIRST AUDIT CHECKLIST EVERY TIME YOU TAKE OVER
==================================================

At minimum verify:
- all public pages load on both domains
- LMS routes load
- mobile sticky CTA and ApplyModal work
- 70-10-20 visual and SME mockups render correctly
- AI bots and SEO sitemaps generate accurately
- Firebase builds pass
- Cloudflare release path works
- IndexNow submission works

Do not guess. Inspect first, then act.
```

---

## Notes

- This handoff prompt is intentionally stricter and more current than the 2026-04-15 version.
- It reflects the dual-site architecture, modern UI updates (ApplyModal, 70-10-20 model, infinite carousels), explicitly authorized AI bots, and strict dual deployment pipelines.
- Any future major tooling change should update this document again.
