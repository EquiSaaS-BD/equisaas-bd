# Web App Audit Report

Date: April 13, 2026
Project: EquiSaaS BD

## Scope

- Landing page
- LMS structure and audit tooling
- SEO metadata and social metadata
- Department curriculum discoverability
- Visible Bangla localization quality

## Automated Checks Run

- `npm run audit:seo:full`
- `npm run audit:lms`
- `npm --prefix lms run audit:catalog`
- `npm --prefix lms run audit:resources`
- `npm run build`

## Findings

### Fixed in this pass

1. Landing page still lacked a single premium section that showed the full learning scope of all 9 departments in one place.
2. The old department roadmap surface used raw department JSON without a normalization pass, so Bangla copy risked showing mojibake.
3. Multiple landing sections still had source-level Bangla copy objects without `normalizeLocalizedTree`, which increased the chance of broken rendering on real devices.
4. The live LMS audit script failed with a raw stack trace on Firestore auth problems instead of returning a clear operational message.

### Still expected, not application regressions

1. `audit:resources` still reports browser-only warnings for Canva and OpenLearn because those providers block certain automated fetches.
2. `audit:lms` still needs valid Firebase CLI auth to perform Firestore live checks. The script now reports that situation more clearly.

## Fixes Shipped

1. Added a new premium landing section for the full nine-department learning map:
   - summary cards
   - department search by module and topic
   - full curriculum expansion by department
   - direct LMS and apply actions per department
2. Switched the landing page to the new curriculum atlas component instead of the older roadmap block.
3. Added localization normalization to more landing copy surfaces to reduce visible Bangla corruption risk.
4. Replaced the mission simulator landing component with a cleaner version using normalized Bangla copy and stable `BDT` value formatting.
5. Improved the LMS live audit script so auth failures produce a useful structured message instead of only a noisy stack trace.

## Files Updated In This Audit Pass

- `landing/src/App.jsx`
- `landing/src/components/landing/DepartmentLearningAtlas.jsx`
- `landing/src/components/landing/DepartmentsExplorer.jsx`
- `landing/src/components/landing/HowItWorks.jsx`
- `landing/src/components/landing/MissionEconomicsSimulator.jsx`
- `lms/scripts/audit-v1-live.mjs`

## Recommended Next Safety and Product Pass

1. Add super-admin audit logs and restore bin for destructive actions.
2. Add role-based onboarding checklist on first login.
3. Add a command-style quick search for learners, courses, reviews, and certificates inside LMS.
4. Continue source-level Bangla cleanup in older LMS certificate management surfaces so they no longer rely on runtime repair.
