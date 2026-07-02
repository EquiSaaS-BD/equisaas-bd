# EquiSaaS BD Platform Architecture, Routes, Roles, and Operations

Last updated: 2026-04-22

This document is a source-level map of the current EquiSaaS BD platform. It is written for future developers and AI coding agents so they can understand the real product structure before making changes.

Core rule for future agents: inspect the code first, preserve existing business logic, and do not invent features that are not in the repository.

## 1. Product Summary

EquiSaaS BD is Bangladesh's first open tech cooperative and community-driven B2B SaaS ecosystem. Its operating philosophy is **Sweat Equity**: young tech talents should not be trapped in unpaid internships; their verified contributions should become a visible ownership journey in the products they help build.

Motto: **Together We Build, Together We Own.**

The platform has two major surfaces:

1. Public discovery and trust website at `https://equisaas-bd.com/`.
2. Cooperative LMS/workspace under `https://equisaas-bd.com/lms`.

The platform supports three ecosystem participants:

1. **Co-builders / Contributors** who choose one department, learn with verified resources, submit proof, and grow toward ownership milestones.
2. **Mentors / Ecosystem Custodians** who review proof, protect quality, guide co-builders, and keep decisions transparent rather than top-down.
3. **SME partners** who follow and eventually validate Bangladesh-first B2B SaaS products such as HR/payroll, POS, and pharmacy inventory.

The LMS should not feel like a boss-employee control panel. It should feel like a cooperative operating system where each co-builder can see:

1. What they are learning.
2. What they contributed.
3. Who verified the work.
4. How the contribution moves them toward sweat equity.
5. Which product/governance decisions they can participate in.

Current implemented workflows include department selection, courses, lessons, tasks, proof submissions, review, points-backed records, certificates, verification, announcements, and stewardship tools.

Planned cooperative-first upgrades should evolve "points" into **Sweat Equity Units**, "leaderboards" into **Ownership Journey / Contribution Signals**, and "management" into **Core Governance & Mentorship**.

## 2. Repository Root Map

Root path: `D:\projects\EquiSaaS BD`

Important folders:

| Path | Purpose |
| --- | --- |
| `landing/` | Public Vite + React + static HTML marketing site. Builds to `landing/dist`. |
| `lms/` | Next.js 15 static-export LMS app. Builds to `lms/out` with `basePath: "/lms"`. |
| `functions/` | Firebase Cloud Functions for certificate OG/entry pages, leaderboard sync, user creation hooks, and email webhook. |
| `scripts/` | Root build, deploy assembly, brand sync, version writing, leaderboards, SEO/IndexNow helpers. |
| `docs/` | Project documentation and generated audit/context files. |
| `dist_deploy/` | Final Firebase Hosting deploy directory assembled from `landing/dist` and `lms/out`. |
| `Brand Assets/` | Source brand assets copied into public asset directories. |
| `.firebase/` | Firebase Hosting local cache. |

Important root files:

| File | Purpose |
| --- | --- |
| `package.json` | Root orchestration scripts for build, audit, deploy, SEO, and leaderboards. |
| `firebase.json` | Firebase Hosting, Functions, Firestore rules/indexes, cache headers, rewrites. |
| `.firebaserc` | Default Firebase project: `equisaas-bd`. |
| `firestore.rules` | Main Firestore security rules. |
| `firestore.indexes.json` | Required Firestore composite indexes. |
| `presentation.html` | Optional static root file copied into `dist_deploy`. |
| `NEXT_AGENT_PROMPT.md` | Existing operational prompt for future agents. |

## 3. Technology Stack

### Root

| Area | Current stack |
| --- | --- |
| Package manager | npm |
| Hosting | Firebase Hosting |
| Database | Cloud Firestore |
| Backend | Firebase Cloud Functions v2, Node 22 |
| Deployment output | `dist_deploy/` |
| Build orchestration | Root npm scripts |

### Landing site

| Area | Current stack |
| --- | --- |
| Framework | Vite + React 18 |
| Styling | Tailwind CSS utilities, SCSS files, global CSS tokens |
| Animations | Framer Motion and lightweight `static-page-shell.js` reveal/mouse utilities |
| UI primitives | Local UI components and Radix where used |
| Build output | `landing/dist` |

Important landing files:

| File | Purpose |
| --- | --- |
| `landing/vite.config.mjs` | Multi-page Vite build input map. |
| `landing/src/main.jsx` | Mounts the React homepage via `AppView`. |
| `landing/src/AppView.jsx` | Main homepage composition. |
| `landing/src/founder/main.jsx` | Mounts the React founder page. |
| `landing/src/pages/FounderPage.jsx` | Founder page React implementation. |
| `landing/public/static-page-shell.js` | Shared static page header, theme toggle, language toggle, mobile menu, reveal, mouse tracking. |
| `landing/src/index.css` | Landing global styles and tokens. |
| `landing/src/styles/tokens.scss` | SCSS token layer. |
| `landing/src/styles/mixins.scss` | SCSS mixins. |
| `landing/src/styles/globals.scss` | Shared SCSS globals. |

### LMS

| Area | Current stack |
| --- | --- |
| Framework | Next.js 15 App Router |
| React | React 19 |
| Output | Static export with `output: "export"` |
| Base path | `/lms` |
| Styling | Tailwind CSS via `tailwind.config.cjs`, PostCSS, `app/globals.css`, shadcn-style UI primitives |
| Auth | Firebase Auth |
| Data | Firestore client SDK |
| Certificate export | `html-to-image`, `jspdf`, `qrcode`, `pdfjs-dist` |
| Notifications | `sonner` |
| Animations | Framer Motion and local reveal/micro-interaction components |

Important LMS files:

| File | Purpose |
| --- | --- |
| `lms/next.config.mjs` | Static export, base path, image config. |
| `lms/tailwind.config.cjs` | Tailwind content/theme config. |
| `lms/postcss.config.cjs` | PostCSS config. |
| `lms/app/layout.js` | Root providers, fonts, metadata, theme/lang bootstrap script. |
| `lms/app/(app)/layout.js` | Protected route shell with anthem and authenticated workspace UI. |
| `lms/components/providers/auth-provider.js` | Firebase Auth, profile subscription, role capability flags. |
| `lms/components/providers/locale-provider.js` | LMS bilingual copy helper and language state. |
| `lms/components/providers/theme-provider.js` | LMS day/night theme state. |
| `lms/lib/catalog.js` | Roles, departments, permission helpers, department metadata. |
| `lms/lib/workspace-navigation.js` | Role-aware workspace navigation config. |
| `lms/lib/firestore/lms.js` | Firestore read/write API for LMS data workflows. |

### Firebase Functions

| Area | Current stack |
| --- | --- |
| Runtime | Node 22 |
| Functions SDK | `firebase-functions` v7 |
| Admin SDK | `firebase-admin` v13 |
| SVG/PNG rendering | `@resvg/resvg-js` |
| Email/webhook | `resend` |

Main function file: `functions/index.js`

## 4. Build and Deployment Pipeline

Root build command:

```bash
npm run build
```

Root build sequence from `package.json`:

1. `sync:brand-assets` copies brand assets.
2. `build:version` writes `version.json` into landing and LMS public folders.
3. `build:landing` builds the Vite landing site.
4. `build:lms` builds and exports the Next LMS.
5. `build:deploy` assembles `dist_deploy`.

Deploy commands:

```bash
npm run firebase:hosting
npm run firebase:rules
```

Approved direct deploy form used in this workspace:

```bash
firebase deploy --only hosting --project equisaas-bd --non-interactive
firebase deploy --only hosting,firestore:rules --project equisaas-bd --non-interactive
```

Deployment assembly:

| Source | Destination |
| --- | --- |
| `landing/dist/` | `dist_deploy/` |
| `lms/out/` | `dist_deploy/lms/` |
| optional `presentation.html` | `dist_deploy/presentation.html` |

`scripts/assemble-dist-deploy.mjs` also normalizes known mojibake strings in built HTML and removes Google font tags from `404.html` and `presentation.html`.

## 5. Firebase Hosting Configuration

Firebase project: `equisaas-bd`

Hosting public directory: `dist_deploy`

Important hosting behavior from `firebase.json`:

| Route/pattern | Behavior |
| --- | --- |
| `/lms/certificate-image` | Rewrites to Cloud Function `certificateShareImage` in `asia-south1`. |
| `/lms/certificate` | Rewrites to Cloud Function `certificateEntryPage` in `asia-south1`. |
| `/lms/assets/**` | Long immutable cache. |
| `/main-assets/**` | Long immutable cache. |
| `**/*.js`, `**/*.css`, fonts, static images | Long immutable cache. |
| `**/*.html`, `/version.json`, `/lms/version.json` | No-cache so update banner can detect releases. |

Security headers include HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.

## 6. Public Domain Route Inventory

### React-powered public pages

| Public URL | Source/build entry | Purpose |
| --- | --- | --- |
| `/` | `landing/index.html`, `landing/src/main.jsx`, `landing/src/AppView.jsx` | Main premium landing page, public SEO homepage, application entry, departments, founder teaser, FAQ, footer. |
| `/founder/` | `landing/founder/index.html`, `landing/src/founder/main.jsx`, `landing/src/pages/FounderPage.jsx` | Founder profile and message page for Kholipha Ahmmad Al-Amin. |

### Static public SEO pages

These pages are Vite build inputs but are mostly authored as static HTML with `static-page-shell.js` and `mount-footer.jsx`.

| Public URL | Source file | Purpose |
| --- | --- | --- |
| `/software-training-bangladesh/` | `landing/software-training-bangladesh/index.html` | SEO page for Bangladesh software training, departments, LMS context. |
| `/open-tech-cooperative-bangladesh/` | `landing/open-tech-cooperative-bangladesh/index.html` | SEO page for Bangladesh's first open tech cooperative positioning. |
| `/sme-software-bangladesh/` | `landing/sme-software-bangladesh/index.html` | SEO page for SME SaaS roadmap: HR/payroll, POS, pharmacy inventory. |
| `/orientation-2026/` | `landing/orientation-2026/index.html` | Orientation 2026 page, embeds YouTube video `PoGoPVgrmUo`. |
| `/404.html` | `landing/404.html` | Static not-found page. |

### Public static assets and SEO files

| URL/file | Source | Purpose |
| --- | --- | --- |
| `/robots.txt` | `landing/public/robots.txt` | Search/crawler allow rules. |
| `/sitemap.xml` | `landing/public/sitemap.xml` | Main sitemap. |
| `/video-sitemap.xml` | `landing/public/video-sitemap.xml` | Video sitemap for orientation/video structured discovery. |
| `/llms.txt` | `landing/public/llms.txt` | AI/LLM-readable site summary. |
| `/site.webmanifest` | `landing/public/site.webmanifest` | PWA/web app manifest. |
| `/BingSiteAuth.xml` | `landing/public/BingSiteAuth.xml` and root copy | Bing verification. |
| `/presentation.html` | root `presentation.html` copied during deploy | Static presentation page. |
| `/version.json` | generated into `landing/public/version.json` | Landing update detection. |
| `/favicon.*`, `/logo*.svg`, `/og-image*` | `landing/public/` | Brand and social preview assets. |

## 7. LMS Route Inventory

LMS base URL: `https://equisaas-bd.com/lms`

Next config: `basePath: "/lms"`, static export.

### LMS public routes

| URL | Source file | Access | Purpose |
| --- | --- | --- | --- |
| `/lms` | `lms/app/page.js`, `HomePageClient` | Public | LMS marketing/entry page with SEO metadata. |
| `/lms/login` | `lms/app/login/page.js`, `LoginPageClient` | Public, noindex | Login page for Firebase Auth. |
| `/lms/register` | `lms/app/register/page.js`, `RegisterPageClient` | Public, noindex | Account creation page. |
| `/lms/certificate-view?id=...` | `lms/app/certificate-view/page.js`, `CertificatePageClient` | Public viewer, noindex | Interactive certificate verifier/viewer with download, print, share, LinkedIn copy fields. |
| `/lms/certificate?id=...` | Firebase Function `certificateEntryPage` | Public/social crawler | Social/crawler entry page with OG metadata; redirects humans to `/lms/certificate-view?id=...`. |
| `/lms/certificate-image?id=...` | Firebase Function `certificateShareImage` | Public/social crawler | Dynamic certificate OG PNG image. |

### LMS protected route group

Protected layout: `lms/app/(app)/layout.js`

The protected layout renders:

1. `LmsAnthem`.
2. `AuthShell`.
3. Role-aware top navigation/menu.
4. Mobile bottom bar.
5. Auth redirect to `/login` when no user exists.

| URL | Source file | Primary access | Purpose |
| --- | --- | --- | --- |
| `/lms/dashboard` | `lms/app/(app)/dashboard/page.js` | Signed-in co-builders | Main workspace dashboard. Shows role-aware stats, department picker for unassigned co-builders, announcements, tasks/courses/ledger/certificates, and contribution signals. |
| `/lms/department` | `lms/app/(app)/department/page.js` | Signed-in co-builders | Department overview, department chooser/scope, course/task/co-builder context. |
| `/lms/department/ba-book` | `lms/app/(app)/department/ba-book/page.js` | Signed-in co-builders | BA/agile strategic PDF book viewer using `BookViewer`; source PDF at `/lms/assets/books/ba-handbook.pdf`. |
| `/lms/courses` | `lms/app/(app)/courses/page.js` | Signed-in co-builders with department, or global stewardship roles | Course directory for the active/scoped department. |
| `/lms/lesson` | `lms/app/(app)/lesson/page.js` | Signed-in co-builders with department, or global stewardship roles | Lesson browser/detail flow, external learning resource links, progress support. |
| `/lms/task` | `lms/app/(app)/task/page.js` | Signed-in co-builders with department, or global stewardship roles | Contribution task proof submission and direct/custom task submission. |
| `/lms/submissions` | `lms/app/(app)/submissions/page.js` | Signed-in co-builders | Co-builder's own proof submission history. |
| `/lms/announcements` | `lms/app/(app)/announcements/page.js` | Signed-in co-builders | Global and department-scoped announcements. Stewardship roles can browse wider scope. |
| `/lms/points` | `lms/app/(app)/points/page.js` | Signed-in co-builders | Current implemented ledger page for points, weekly/monthly/overall contribution signals, and custodian global visibility. Future UX should point toward `/lms/equity`. |
| `/lms/equity` | Proposed: `lms/app/(app)/equity/page.js` importing `lms/components/pages/equity-dashboard.js` | Signed-in co-builders | Proposed Sweat Equity Dashboard: converts approved contribution records into ownership milestones, "My Share", and "My Ownership Journey". |
| `/lms/governance` | Proposed: `lms/app/(app)/governance/page.js` importing `lms/components/pages/governance.js` | Eligible co-builders, mentors, custodians | Proposed co-op governance route for roadmap voting, feature prioritization, and upcoming B2B SaaS project decisions. |
| `/lms/manual` | `lms/app/(app)/manual/page.js` | Signed-in co-builders | Role-based cooperative manual from `role-guides-clean.js`. Multiple roles can expose multiple guides; ecosystem custodians can see all. |
| `/lms/review` | `lms/app/(app)/review/page.js` | Mentor and above in UI | Mentorship verification queue. Mentors recommend; department stewards/directors/ecosystem custodians can finalize sweat-equity-backed decisions. Non-review co-builders see access-required state. |
| `/lms/manage` | `lms/app/(app)/manage/page.js`, `ManagementConsole` | Department steward and above in UI | Current implementation name for the Core Governance & Mentorship Panel. Custodian-only tabs include certificates, workshop certificates, templates, restore bin, audit log, and high-trust stewardship controls. |

## 8. LMS Navigation Model

Workspace navigation source:

1. `lms/lib/workspace-navigation.js`
2. `lms/lib/workspace-navigation-clean.js`

The authenticated shell calls `getVisibleWorkspaceNavSections({ canManage, canReview })`.

Visible navigation groups:

| Group | Routes |
| --- | --- |
| Start here | Dashboard, Department, Manual |
| Learning | Courses, Lessons, Tasks |
| Records | Submissions, Points, Announcements |
| Ownership and Governance | Proposed Equity Dashboard, proposed Governance voting route |
| Core Mentorship | Review Queue if `canReview`; Manage/Stewardship tools if `canManage` |

The top LMS navigation is implemented by `lms/components/ui/app-menu-bar.jsx` and used inside `AuthShell`.

The mobile navigation is implemented by `lms/components/layout/mobile-bottom-bar.jsx`.

## 9. LMS Role Model

Role and permission source: `lms/lib/catalog.js`

Supported roles:

| Role ID | Cooperative product label | Scope |
| --- | --- | --- |
| `member` | Co-builder / contributor | Own department and own records |
| `mentor` | Mentor / proof verifier | Own department review scope |
| `department_head` | Department steward | Own department stewardship, review, sweat-equity verification |
| `director` | Ecosystem steward | Global browse/review/stewardship except custodian-only tools |
| `super_admin` | Ecosystem custodian | Global access, certificates, templates, audit, restore, high-trust stewardship controls |

Permission groups:

| Helper | Roles |
| --- | --- |
| `GLOBAL_SCOPE_ROLES` | `super_admin`, `director` |
| `MANAGEMENT_ROLES` | `super_admin`, `director`, `department_head` |
| `REVIEW_ROLES` | `super_admin`, `director`, `department_head`, `mentor` |
| `POINTS_ROLES` | `super_admin`, `director`, `department_head` |

Important capability helpers:

| Helper | Purpose |
| --- | --- |
| `canBrowseAllDepartments(roleOrRoles)` | Allows global department browsing for `super_admin` and `director`. |
| `canManage(roleOrRoles)` | Enables management surfaces for management roles. |
| `canReview(roleOrRoles)` | Enables review queue for review roles. |
| `canAwardPoints(roleOrRoles)` | Existing helper name for final contribution-credit approval by ecosystem custodian, director, or department steward. |
| `resolveScopedDepartmentId(...)` | Resolves effective department scope for role and selected department. |
| `getPrimaryRole(...)` | Computes primary role based on priority. |

Role priority:

1. `super_admin`
2. `director`
3. `department_head`
4. `mentor`
5. `member`

## 10. Role-Based Route and Action Matrix

| Route/action | Co-builder | Mentor | Department Steward | Ecosystem Steward | Ecosystem Custodian |
| --- | --- | --- | --- | --- | --- |
| `/dashboard` | Yes | Yes | Yes | Yes | Yes |
| `/department` | Own department / choose department | Own department | Own department | All departments | All departments |
| `/courses`, `/lesson`, `/task` | Own department published content | Own department | Own department plus management visibility | All departments | All departments |
| `/submissions` | Own submissions | Own submissions | Own submissions | Own submissions | Own submissions |
| `/announcements` | Global + own department | Global + own department | Own/global management scope | Global/all department scope | Global/all department scope |
| `/points` | Own ledger + own department contribution signals | Own ledger + scoped contribution signals | Scoped contribution signals/roster | Global browse | Global browse and all co-builder view |
| `/equity` | Proposed own ownership journey | Proposed own ownership journey plus mentee context | Proposed scoped ownership signals | Proposed ecosystem ownership overview | Proposed full ownership/custodian overview |
| `/governance` | Proposed voting if sweat-equity threshold is met | Proposed voting/facilitation | Proposed department proposals | Proposed ecosystem proposals | Proposed proposal stewardship and integrity tools |
| `/manual` | Co-builder guide | Mentor guide plus co-builder context if roles include both | Department steward guide | Ecosystem steward guide | All/custodian guide |
| `/review` | No, access-required state | Can recommend | Can recommend and finalize scoped contribution credit | Can finalize globally | Can finalize globally |
| `/manage` | No | No | Scoped stewardship | Global stewardship except custodian-only tabs | Full stewardship |
| Certificates management | No | No | No | No | Yes |
| Workshop certificates | No | No | No | No | Yes |
| Certificate templates | No | No | No | No | Yes |
| Restore bin | No | No | No | No | Yes |
| Audit logs | No | No | No | No | Yes |
| Direct contribution-credit adjustment | No | No | Via people panel if permitted by rules/scope | Wider stewardship | Full allowed UI/rules |

Firestore rules are the final authority. UI gating must never be treated as the only security layer.

## 11. Department and Ownership Model

Source for current department IDs: `lms/lib/catalog.js`

There are 9 departments under 4 parent groups. These departments are not "employee teams"; they are cooperative craft lanes where co-builders learn, ship proof, receive mentorship, and build a contribution record.

| Department ID | Title | Parent |
| --- | --- | --- |
| `frontend` | Frontend Engineering | `engineering` |
| `backend` | Backend Engineering | `engineering` |
| `devopsqa` | DevOps & QA | `engineering` |
| `uiux` | UI/UX Design | `design` |
| `design` | Graphic Design | `design` |
| `baagile` | Business Analysis & Agile | `product` |
| `pm` | Product Management | `product` |
| `marketing` | Digital Marketing | `marketing` |
| `crmcs` | CRM & Customer Success | `marketing` |

Firestore rules validate department IDs and parent IDs.

### Rethink points as sweat equity signals

Current implementation uses `pointsLedger` and `users.totalPoints` to record approved contribution value. The next product language must not present this as empty gamification. Approved points should become **Sweat Equity Units**: proof-backed signals that power each co-builder's ownership journey.

User-facing terminology should shift:

| Old / corporate term | Cooperative replacement |
| --- | --- |
| Points | Sweat Equity Units |
| Leaderboard | Contribution Signal / Ownership Progress |
| Rank | Milestone position |
| User score | Co-builder contribution value |
| Admin approval | Mentor/custodian verification |

### Proposed core route: Sweat Equity Dashboard

Proposed URL:

```text
/lms/equity
```

Proposed files:

```text
lms/app/(app)/equity/page.js
lms/components/pages/equity-dashboard.js
lms/lib/firestore/equity.js
```

Purpose:

1. Show **My Share** and **My Ownership Journey** rather than only points.
2. Convert approved `pointsLedger` credits into ownership milestones.
3. Show transparent calculation rules so no co-builder feels the system is arbitrary.
4. Show the difference between learning proof, production contribution, mentorship contribution, and governance participation.
5. Show milestone history: "First verified proof", "First production contribution", "Product contributor", "Core co-builder", "Governance eligible".

Proposed Firestore model:

```text
ownershipMilestones/{milestoneId}
ownershipLedger/{entryId}
users/{uid}.sweatEquityUnits
users/{uid}.ownershipMilestoneId
users/{uid}.governanceEligible
```

Proposed `ownershipLedger/{entryId}` fields:

| Field | Purpose |
| --- | --- |
| `userId` | Co-builder receiving the ownership signal. |
| `sourceLedgerId` | Source `pointsLedger` entry when derived from approved proof. |
| `departmentId` | Department where the contribution happened. |
| `productId` | Optional B2B SaaS product connected to the contribution. |
| `contributionType` | `learning_proof`, `production_code`, `prd`, `design_asset`, `qa_release`, `growth_asset`, `support_operation`, `governance`. |
| `sweatEquityUnits` | Cooperative contribution unit derived from approved work. |
| `ownershipWeight` | Weight used in milestone/ownership calculation. |
| `verificationStatus` | `pending`, `verified`, `reversed`. |
| `verifiedBy` | Mentor or ecosystem custodian who verified it. |
| `createdAt` | Record creation timestamp. |

Important legal/product note:

The UI can show an internal ownership journey and estimated cooperative share signal. Formal equity issuance should still be governed by EquiSaaS BD's legal/cooperative agreement, board policy, and documented governance rules.

### Proposed core route: Cooperative Governance

Proposed URL:

```text
/lms/governance
```

Proposed files:

```text
lms/app/(app)/governance/page.js
lms/components/pages/governance.js
lms/lib/firestore/governance.js
```

Purpose:

1. Move important product decisions away from one-way top-down announcements.
2. Let eligible co-builders vote on product roadmap, feature priority, release focus, and upcoming B2B SaaS projects.
3. Make the decision trail visible: proposal, context, options, voters, result, and final implementation status.
4. Connect governance eligibility to sweat equity thresholds, not arbitrary hierarchy.

Proposed Firestore model:

```text
governanceProposals/{proposalId}
governanceVotes/{voteId}
governanceDecisionLogs/{decisionId}
```

Proposed `governanceProposals/{proposalId}` fields:

| Field | Purpose |
| --- | --- |
| `title` | Proposal title. |
| `summary` | Plain-language decision context. |
| `proposalType` | `roadmap`, `feature_priority`, `product_launch`, `policy`, `budget_signal`. |
| `productId` | Optional B2B SaaS product reference. |
| `createdBy` | Co-builder/mentor/custodian who opened the proposal. |
| `eligibilityRule` | Required sweat equity threshold or role scope. |
| `options` | Vote options. |
| `status` | `draft`, `open`, `closed`, `accepted`, `rejected`, `implemented`. |
| `opensAt` | Vote opening time. |
| `closesAt` | Vote closing time. |
| `createdAt` | Proposal creation timestamp. |

### Proposed cooperative route tree

```text
lms/
  app/
    (app)/
      equity/
        page.js                 # imports EquityDashboard
      governance/
        page.js                 # imports GovernancePage
  components/
    pages/
      equity-dashboard.js       # My Share / My Ownership Journey
      governance.js             # Co-op roadmap and product voting
  lib/
    firestore/
      equity.js                 # ownershipMilestones + ownershipLedger helpers
      governance.js             # proposals, votes, decision logs
```

## 12. LMS Workflow Inventory

### Auth and profile

Files:

1. `lms/components/providers/auth-provider.js`
2. `lms/lib/firestore/lms.js`
3. `firestore.rules`

Flow:

1. Firebase Auth state is monitored with `onAuthStateChanged`.
2. `ensureUserProfile(nextUser)` creates or confirms `users/{uid}`.
3. `AuthProvider` subscribes to `users/{uid}` via Firestore `onSnapshot`.
4. Role, roles array, department, total points, and capability flags are computed client-side.
5. Firestore rules validate all sensitive writes.

### Department selection

Files:

1. `lms/app/(app)/dashboard/page.js`
2. `lms/app/(app)/department/page.js`
3. `lms/lib/firestore/lms.js`

Flow:

1. Unassigned members see a department chooser.
2. `saveDepartmentSelection(user, departmentId)` updates the user profile with `departmentId` and `parentDepartmentId`.
3. Firestore rules only allow valid department/parent combinations.
4. Department member counters are updated through controlled logic.

### Courses, lessons, and tasks

Files:

1. `lms/app/(app)/courses/page.js`
2. `lms/app/(app)/lesson/page.js`
3. `lms/app/(app)/task/page.js`
4. `lms/lib/firestore/lms.js`

Collections:

1. `courses`
2. `lessons`
3. `tasks`
4. `users/{uid}/progress/{courseId}`

Flow:

1. Courses and lessons are filtered by department and published status for members.
2. Global roles can browse broader scope.
3. Each lesson can point to external learning resources.
4. Each open task accepts proof submission through the task page.
5. Direct/custom tasks are supported by `DirectTaskPanel`.

### Proof submissions and review

Files:

1. `lms/app/(app)/task/page.js`
2. `lms/app/(app)/submissions/page.js`
3. `lms/app/(app)/review/page.js`
4. `lms/lib/firestore/lms.js`

Collections:

1. `submissions`
2. `pointsLedger`

Flow:

1. Members submit proof URLs and reviewer notes.
2. Submission status starts as `pending`.
3. Mentors can save recommendations.
4. Department heads, directors, and super admins can approve, request revision, or reject.
5. Approved decisions create `pointsLedger` credit entries and update user point counters.
6. Points ledger triggers update weekly, monthly, and overall leaderboards.

### Contribution ledger, ownership signals, and leaderboards

Files:

1. `lms/app/(app)/points/page.js`
2. `lms/components/leaderboards/weekly-department-leaderboard.jsx`
3. `functions/index.js`
4. `lms/scripts/sync-leaderboards-v2.mjs`

Collections:

1. `pointsLedger`
2. `departmentLeaderboards/{weekKey}/departments/{departmentId}/participants/{participantId}`
3. `departmentMonthlyLeaderboards/{monthKey}/departments/{departmentId}/participants/{participantId}`
4. `departmentOverallLeaderboards/{boardKey}/departments/{departmentId}/participants/{participantId}`

Flow:

1. Current user total points are stored on the user profile as `users.totalPoints`.
2. Ledger entries keep traceable approval history.
3. Cloud Function `onPointsLedgerCreated` syncs weekly/monthly/overall leaderboard documents.
4. `onPointsLedgerDeleted` cleans up leaderboard documents if ledger entries are deleted.
5. Points page can show the current ledger, department top performers, and ecosystem custodian global views.
6. Future Equity Dashboard should translate these records into Sweat Equity Units and ownership milestones.

### Announcements

Files:

1. `lms/app/(app)/announcements/page.js`
2. `lms/components/pages/management-console.js`
3. `lms/lib/firestore/lms.js`

Collection: `announcements`

Flow:

1. Announcements can be global or department-scoped.
2. Members see global and own department announcements.
3. Management roles can create/update/delete according to scope.

### Core Governance & Mentorship Panel

Files:

1. `lms/app/(app)/manage/page.js`
2. `lms/components/pages/management-console.js`
3. `lms/components/pages/people-management-panel.js`

Current implementation component: `ManagementConsole`

Future product label: **Core Governance & Mentorship Panel**

Tabs in the current implementation:

| Tab | Access | Purpose |
| --- | --- | --- |
| `curriculum` | Management roles | Create courses, lessons, tasks. |
| `announcements` | Management roles | Create department/global announcements by allowed scope. |
| `attendance` | Management roles | Record attendance and credit. |
| `people` | Stewardship roles | Update access, roles, department, contribution credit, remove member from active roster. |
| `certificates` | Ecosystem custodian | Manage official certificates. |
| `workshop-certificates` | Ecosystem custodian | Create/manage workshop certificates. |
| `templates` | Ecosystem custodian | Certificate template builder. |
| `restore` | Ecosystem custodian | Restore archived records. |
| `audit` | Ecosystem custodian | Stewardship audit logs. |
| `admin` | Ecosystem custodian | High-trust stewardship controls. |

### Certificate system

Files:

1. `lms/app/certificate-view/page.js`
2. `lms/components/pages/certificate-page-client.js`
3. `lms/components/certificates/certificate-document.jsx`
4. `lms/components/certificates/certificate-management-panel.jsx`
5. `lms/components/certificates/workshop-certificate-panel.jsx`
6. `lms/components/certificates/certificate-template-builder.jsx`
7. `functions/index.js`

Collections:

1. `certificates`
2. `certificateTemplates`

Routes:

1. `/lms/certificate-view?id=...` is the human viewer.
2. `/lms/certificate?id=...` is the share/OG entry function.
3. `/lms/certificate-image?id=...` is the dynamic OG image function.

Features:

1. Verify certificate by ID/link.
2. Download PNG.
3. Download PDF.
4. Open print-ready PDF.
5. Copy exact certificate link.
6. Share to LinkedIn, Facebook, WhatsApp, email, native share sheet.
7. Copy LinkedIn-ready fields.
8. Super-admin certificate creation/editing.
9. Super-admin workshop certificate panel.
10. Super-admin certificate template builder.

Important certificate fields validated by Firestore rules:

1. `certificateNumber`
2. `verificationCode`
3. `verificationUrl`
4. `status`
5. `certificateTitle`
6. `subjectTitle`
7. `achievementSummary`
8. `recipientName`
9. `departmentId`
10. `departmentTitle`
11. `parentDepartmentId`
12. `courseId`
13. `courseTitle`
14. `completionDateKey`
15. `issueDateKey`
16. `issuedAt`
17. `signerName`
18. `signerTitle`
19. `issuerOrganization`
20. `revokedAt`
21. `createdAt`
22. `updatedAt`

### Role manual

Files:

1. `lms/app/(app)/manual/page.js`
2. `lms/lib/role-guides.js`
3. `lms/lib/role-guides-clean.js`

Manuals exist for:

1. `member`
2. `mentor`
3. `department_head`
4. `director`
5. `super_admin`

The manual page should show role-specific guidance based on the current user's roles. Super admin should be able to see all manuals.

### LMS update and cache controls

Files:

1. `scripts/write-build-version.mjs`
2. `lms/components/layout/update-available-banner.js`
3. `lms/components/layout/site-cache-refresh.js`

Flow:

1. Build writes `version.json` to both landing and LMS public folders.
2. LMS checks `/lms/version.json` every 60 seconds.
3. If a new version is found, the update banner appears.
4. "Update now" clears service worker registrations and Cache Storage, stores the new version, and reloads with a cache-busting query.
5. Manual "Clear site cache" does the same cache clear/reload behavior.

### LMS anthem

File: `lms/components/layout/lms-anthem.jsx`

Behavior:

1. Uses localStorage key `equisaas_brand_anthem_played_v1`.
2. Uses sessionStorage key `equisaas_brand_anthem_attempted_session_v1`.
3. Should play only once for a user/browser after first successful play.
4. User can disable with `equisaas_ui_sound_enabled=false`.

## 13. Firestore Data Model and Security Summary

Rules file: `firestore.rules`

### Collections

| Collection/path | Purpose | High-level access |
| --- | --- | --- |
| `users/{userId}` | Co-builder profile, role, roles, department, contribution credit | Self read/write limited fields; stewardship updates by scope; delete only ecosystem custodian. |
| `users/{userId}/progress/{courseId}` | Lesson/course progress | Self write; readable by self and scoped mentors/stewards. |
| `departments/{departmentId}` | Department metadata/counts | Signed-in read; curriculum stewards update; delete by ecosystem custodian/director. |
| `courses/{courseId}` | Department courses | Published same-department read for members; broader for reviewers/managers; manage by scope. |
| `lessons/{lessonId}` | Department lessons | Same pattern as courses. |
| `tasks/{taskId}` | Department tasks | Open/closed same-department read for members; manage by scope. |
| `submissions/{submissionId}` | Proof submissions | Owner or scoped reviewer read; owner can create/update pending/revision; reviewers/approvers update by role. |
| `pointsLedger/{entryId}` | Approved points ledger | Self or scoped reviewer read; create by points approver only; no update/delete. |
| `attendance/{attendanceId}` | Attendance/credit records | Self or scoped reviewer read; create/update by points approver; no delete. |
| `departmentLeaderboards/...` | Weekly contribution signals | Read by same department or global roles; write only backend/stewardship scripts/functions. |
| `departmentMonthlyLeaderboards/...` | Monthly contribution signals | Same as weekly. |
| `departmentOverallLeaderboards/...` | Overall contribution signals | Same as weekly. |
| `announcements/{announcementId}` | Global/department announcements | Scope-aware read; create/update/delete by management scope. |
| `certificates/{certificateId}` | Public/verifiable certificate records | Active/revoked public read; ecosystem custodian create/update/delete. |
| `configs/{configId}` | App/system config | Signed-in read; ecosystem custodian writes. |
| `certificateTemplates/{templateId}` | Certificate templates | Ecosystem custodian only. |
| `adminAuditLogs/{logId}` | Stewardship audit records | Ecosystem custodian read/create; immutable after creation. |
| `restoreBin/{entryId}` | Soft-deleted/archived records | Ecosystem custodian read/create/update; no delete. |
| Catch-all | Everything else | Denied. |

### Security helpers in rules

Important functions:

1. `signedIn()`
2. `viewerExists()`
3. `viewer()`
4. `viewerRole()`
5. `viewerDepartmentId()`
6. `isSelf(uid)`
7. `isSuperAdmin()`
8. `isDirector()`
9. `isDepartmentHead()`
10. `isMentor()`
11. `isManagement()`
12. `canManageCurriculumFor(departmentId)`
13. `canReviewScoped(data)`
14. `canAwardPointsFor(departmentId)`
15. `canReadDepartmentLeaderboard(departmentId)`
16. `canReadUser(target)`

## 14. Firestore Index Inventory

Indexes file: `firestore.indexes.json`

Important indexed queries:

1. `announcements`: `scopeKey + isPublished + createdAt desc`
2. `courses`: `departmentId + status + order`
3. `lessons`: `courseId + status + order`
4. `lessons`: `departmentId + courseId + status + order`
5. `tasks`: `departmentId + status + deadlineAt`
6. `submissions`: `userId + submittedAt desc`
7. `submissions`: `departmentId + submittedAt desc`
8. `submissions`: `userId + status + submittedAt desc`
9. `submissions`: `departmentId + status + submittedAt desc`
10. `pointsLedger`: `userId + createdAt desc`
11. `users`: `departmentId + displayName`
12. `certificates`: `departmentId + issuedAt desc`

## 15. Firebase Functions and Authentic Credentials Inventory

Source for current functions: `functions/index.js`

Existing Firebase Functions:

| Export | Trigger/type | Purpose |
| --- | --- | --- |
| `onUserCreated` | Firestore `users/{userId}` create | Logs a new co-builder profile, creates ecosystem notification, sends welcome email when configured. |
| `onPointsLedgerCreated` | Firestore `pointsLedger/{entryId}` create | Syncs weekly/monthly/overall contribution signals. Future version should also derive Sweat Equity Units. |
| `onPointsLedgerDeleted` | Firestore `pointsLedger/{entryId}` delete | Cleans contribution signal records after ledger deletion. |
| `certificateEntryPage` | HTTPS request | Builds crawler-friendly OG entry page for `/lms/certificate?id=...`; redirects human visitors to certificate viewer. |
| `certificateShareImage` | HTTPS request | Generates certificate-specific PNG OG image for social previews. |
| `resendEmailWebhook` | HTTPS request | Handles Resend webhook events and stores them in Firestore. |

Function URL constants:

1. `MAIN_SITE_URL = "https://equisaas-bd.com/"`
2. `LMS_URL = "https://equisaas-bd.com/lms"`
3. `LMS_CERTIFICATE_URL = "https://equisaas-bd.com/lms/certificate"`
4. `LMS_CERTIFICATE_VIEWER_URL = "https://equisaas-bd.com/lms/certificate-view"`
5. `LMS_CERTIFICATE_IMAGE_URL = "https://equisaas-bd.com/lms/certificate-image"`

### Authentic credentials: production contribution badge/certificate

Course completion certificates alone are weak in the local market if they only prove someone watched lessons or completed a workshop. EquiSaaS BD should add a stronger credential type: **Production Contribution Badge / Certificate**.

This credential should explicitly verify real product contribution:

```text
This co-builder successfully pushed code, product requirements, design assets, QA evidence, growth assets, or operational work into a live or release-track B2B SaaS product under EquiSaaS BD.
```

Recommended public label:

```text
Production Contribution Credential
```

Recommended route behavior:

1. Keep `/lms/certificate-view?id=...` as the human verifier.
2. Keep `/lms/certificate?id=...` as the crawler/social entry page.
3. Keep `/lms/certificate-image?id=...` as the OG image generator.
4. Extend the certificate UI to visually distinguish `course_completion`, `workshop_participation`, and `production_contribution`.

Proposed certificate schema extension:

```text
certificates/{certificateId}
```

| Field | Purpose |
| --- | --- |
| `credentialType` | `course_completion`, `workshop_participation`, or `production_contribution`. |
| `productionProductId` | Optional ID for the B2B SaaS product where the contribution landed. |
| `productName` | Human-readable product name, such as HR/payroll, POS, pharmacy inventory, LMS, or internal platform. |
| `contributionType` | `code`, `prd`, `uiux`, `qa`, `devops`, `growth`, `customer_success`, `operations`, `governance`. |
| `contributionSummary` | Plain-language summary of what the co-builder shipped. |
| `evidenceUrls` | Public or internal proof links. |
| `pullRequestUrls` | Merged PR links when applicable. |
| `prdUrls` | Product requirement or analysis links when applicable. |
| `designUrls` | Figma/design evidence when applicable. |
| `releaseUrl` | Live feature, release note, staging link, or product changelog. |
| `verifiedBy` | Mentor/ecosystem custodian who verified the production contribution. |
| `approvedBy` | Final custodian if separate from reviewer. |
| `verificationStatement` | Official statement shown on the certificate. |
| `sweatEquityUnitsAwarded` | Units connected to this production contribution. |

Recommended verification statement:

```text
This Production Contribution Credential verifies that the named co-builder contributed reviewed work to an EquiSaaS BD B2B SaaS product or release-track system. The credential is valid only when the public verification URL resolves to the same official record.
```

Future implementation notes:

1. `firestore.rules` must extend `certificateKeysAllowed()` before these fields can be written from the LMS.
2. `certificate-document.jsx` should render a production-focused layout when `credentialType === "production_contribution"`.
3. `certificateShareImage` should generate a distinct OG preview for production credentials.
4. `ownershipLedger` should optionally link back to the certificate through `certificateId`.

## 16. Important Scripts

### Root scripts

| Script | Purpose |
| --- | --- |
| `npm run sync:brand-assets` | Sync brand assets into app public directories. |
| `npm run build:version` | Write fresh `version.json` to landing and LMS. |
| `npm run build:landing` | Build landing Vite app. |
| `npm run build:lms` | Build/export Next LMS. |
| `npm run build:deploy` | Assemble `dist_deploy`. |
| `npm run build` | Full production build pipeline. |
| `npm run firebase:hosting` | Deploy Firebase Hosting. |
| `npm run firebase:rules` | Deploy Firestore rules. |
| `npm run audit:lms` | Run LMS audit script. |
| `npm run audit:seo` | Run SEO checks. |
| `npm run audit:seo:social` | Run social SEO checks. |
| `npm run audit:seo:full` | Run full SEO audit. |
| `npm run sync:leaderboards` | Sync leaderboard records. |
| `npm run submit:indexnow` | Submit URLs to IndexNow. |

### LMS scripts

Important `lms/scripts/` files:

| Script | Purpose |
| --- | --- |
| `activate-v1.mjs` | Activation/setup helper. |
| `audit-v1-live.mjs` | Live LMS audit helper. |
| `audit-curriculum.mjs` | Curriculum audit. |
| `audit-resource-catalog.mjs` | Resource catalog audit. |
| `audit-resource-links.mjs` | Resource link audit. |
| `cleanup-test-artifacts.mjs` | Cleanup helper. |
| `import-content.mjs` | Content import. |
| `import-roadmaps.mjs` | Roadmap import. |
| `migrate-v1-users.mjs` | User migration. |
| `restore-legacy-resources.mjs` | Legacy resource restore. |
| `seed-coop.mjs` | Cooperative seed data. |
| `seed-v1-content.mjs` | Initial LMS content seed. |
| `set-admin-claim.mjs` | Admin/custom claim helper. |
| `smoke-test-role-flows.mjs` | Smoke tests for role flows. |
| `sync-department-counts.mjs` | Department count sync. |
| `sync-leaderboards-v2.mjs` | Current leaderboard sync. |
| `test-course-write.mjs` | Course write test helper. |
| `test-roadmap-write.mjs` | Roadmap write test helper. |

## 17. Design System and Interaction Notes

### Landing

Landing follows a "Kinetic Premium" direction:

1. Brand colors: teal `#0f766e` and blue `#3b82f6`.
2. Glassmorphic panels, premium shadows, tonal gradients.
3. `data-reveal` attributes for scroll reveal.
4. Mouse tracking CSS vars `--mouse-x` and `--mouse-y`.
5. Public static pages use `static-page-shell.js` for shared header, mobile menu, theme, language, and reveal behavior.

### LMS

LMS uses a faster, more functional version of the same direction:

1. `app/globals.css` and Tailwind tokens.
2. Shadcn-style UI primitives in `lms/components/ui`.
3. `GlobalInteractivity` for reveal and mouse effects.
4. `AppMenuBar` for responsive workspace navigation.
5. `WorkspacePageHeader`, `WorkspaceBreadcrumbs`, `WorkspaceNextAction` for consistent page structure.
6. `UpdateAvailableBanner` and `SiteCacheRefresh` for cached version handling.

## 18. SEO and Public Indexing Notes

Important SEO targets:

1. EquiSaaS BD
2. EquiSaaS
3. Bangladesh's first open tech cooperative
4. Open tech cooperative Bangladesh
5. Software training Bangladesh
6. LMS Bangladesh
7. Bangladesh SaaS
8. Bangladesh software company
9. SME software Bangladesh
10. HR payroll software Bangladesh
11. POS software Bangladesh
12. Pharmacy inventory software Bangladesh
13. Kholipha Ahmmad Al-Amin
14. kholifaahmadalamin

Important SEO assets:

1. `landing/index.html`
2. `landing/public/sitemap.xml`
3. `landing/public/video-sitemap.xml`
4. `landing/public/robots.txt`
5. `landing/public/llms.txt`
6. `landing/public/og-image*.png/svg`
7. `landing/software-training-bangladesh/index.html`
8. `landing/open-tech-cooperative-bangladesh/index.html`
9. `landing/sme-software-bangladesh/index.html`
10. `landing/orientation-2026/index.html`
11. `landing/founder/index.html`

Certificate social sharing depends on:

1. `firebase.json` rewrites.
2. `functions/index.js` certificate entry/image functions.
3. `robots.txt` allowing social crawlers.
4. Valid certificate records in Firestore.

## 19. Cost and Firebase Free-Tier Awareness

The platform currently uses Firebase Hosting, Firestore, Firebase Auth, and Cloud Functions.

Cost-sensitive areas:

1. Cloud Functions invocations for certificate pages/images and Firestore triggers.
2. Firestore reads from dashboards, management, leaderboards, and certificate verification.
3. Cloud Storage if new uploaded assets are added.
4. Email/webhook integrations if configured.

Future agents should:

1. Avoid polling Firestore aggressively.
2. Prefer static assets and static hosting when possible.
3. Keep functions `maxInstances` low for public social-image endpoints unless traffic demands otherwise.
4. Avoid adding always-on schedulers unless explicitly needed.
5. Run local build and inspect generated output before deploying.

## 20. Operational Checklist for Future Agents

Before changing code:

1. Read this document.
2. Inspect the exact files related to the requested feature.
3. Check `firestore.rules` before changing any role-sensitive workflow.
4. Check `lms/lib/catalog.js` before changing roles/departments.
5. Check `lms/lib/firestore/lms.js` before changing Firestore data shape.
6. Check `firebase.json` before changing public routes, cache, or certificate sharing.

Before deploy:

1. Run `npm run build`.
2. If rules changed, run/deploy rules intentionally.
3. If functions changed, deploy functions intentionally and monitor cost impact.
4. Verify `dist_deploy/` contains both public site and `/lms`.
5. For LMS cache-sensitive fixes, confirm `version.json` changed.
6. For social sharing fixes, inspect `/lms/certificate?id=...` and `/lms/certificate-image?id=...`.

Suggested validation commands:

```bash
npm run build
npm --prefix lms run build
npm --prefix lms run smoke:roles
npm run audit:seo
npm run audit:seo:social
```

If smoke tests fail with `PERMISSION_DENIED`, verify the authenticated test account, custom claims, Firestore profile role, and deployed rules are aligned.

## 21. High-Risk Areas

Be careful when editing:

1. `firestore.rules`: can break login, department selection, courses, review, certificates, or custodian access.
2. `lms/lib/firestore/lms.js`: central data API; changes can break multiple screens.
3. `lms/lib/catalog.js`: role/department definitions power UI and rules assumptions.
4. `functions/index.js`: certificate social previews, OG pages, leaderboard sync, and email webhooks.
5. `firebase.json`: cache headers and rewrites decide whether LMS updates and certificate sharing work.
6. `scripts/assemble-dist-deploy.mjs`: deploy output composition; a bad change can deploy missing pages.
7. `landing/public/static-page-shell.js`: shared header/theme/lang for static SEO pages.
8. `lms/components/pages/management-console.js`: current implementation file for many stewardship workflows in one component.
9. `lms/components/pages/certificate-page-client.js`: certificate viewer/download/share tools.

## 22. Cooperative Platform Mental Model

Think of the system as a cooperative ecosystem, not a corporate hierarchy.

The platform should avoid boss-employee language wherever possible. The product experience should make every participant feel like a co-builder inside a transparent ownership journey.

Preferred terminology:

| Avoid | Use instead |
| --- | --- |
| Users | Co-builders, contributors, members |
| Learners | Co-builders in training |
| Employees | Contributors / co-builders |
| Admin | Ecosystem Custodian |
| Management Console | Core Governance & Mentorship Panel |
| Control layer | Stewardship layer / Governance layer |
| Points | Sweat Equity Units |
| Leaderboard | Contribution Signal / Ownership Progress |
| Boss approval | Mentor verification / custodian verification |
| Assigned work | Contribution opportunity |

Think of the system as four cooperative layers:

1. **Public Discovery & Invitation Layer**: landing, SEO pages, founder page, orientation, SME/training pages. This layer explains the mission, invites co-builders, and builds public trust.
2. **Co-builder Workspace Layer**: LMS dashboard, department, courses, lessons, contribution tasks, submissions, announcements, manual. This layer helps each co-builder focus on one craft lane and submit visible proof.
3. **Ownership Journey Layer**: proposed Equity Dashboard, contribution ledger, production credentials, ownership milestones, and "My Share" visibility. This layer converts verified work into transparent sweat equity progress.
4. **Core Governance & Mentorship Layer**: review queue, proposed governance voting, certificate verification, templates, audit log, restore bin, and stewardship tools. This layer protects quality and trust without turning the ecosystem into top-down command/control.

The public website should explain why EquiSaaS BD exists and invite people into a fairer build-and-own ecosystem.

The LMS should keep co-builders focused on one department, one clear learning path, visible proof submission, mentor verification, production contribution, and ownership progress.

The stewardship layer should keep authority scoped, auditable, reversible where possible, and protected by Firestore rules. Custodians should not feel like bosses; they should feel like trusted maintainers of the cooperative operating system.

The next product direction should make two ideas impossible to miss:

1. **Proof creates trust.**
2. **Verified contribution creates ownership.**
