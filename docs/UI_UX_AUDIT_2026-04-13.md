# EquiSaaS BD Full UI/UX Audit

Date: 2026-04-13  
Scope: `landing/`, `lms/`, and `functions/` as implemented in the repository

## 1. Codebase Discovery Summary

### Repository structure

- `landing/`: public-facing Vite + React marketing and SEO site.
- `lms/`: internal and public LMS experience built with Next.js App Router and exported under `/lms`.
- `functions/`: Firebase Cloud Functions for certificate verification entry, OG/share images, email workflows, and scheduled summary jobs.
- `docs/`: project documentation and audit notes.

### Framework and architecture

- Landing stack:
  - React 18
  - Vite
  - Tailwind CSS
  - Radix UI primitives
  - Framer Motion
- LMS stack:
  - Next.js 15 App Router with `output: "export"`
  - React 19
  - Tailwind CSS
  - Radix UI / shadcn-style component layer
  - Firebase Auth + Firestore
  - `next-themes`
  - `jspdf`, `html-to-image`, and `qrcode` for certificates

### Styling and theme handling

- Both apps already use CSS variable driven token systems.
- Both apps expose light and dark mode.
- Both apps already lean toward a teal + blue brand system.
- Shared primitives still preserve an older neobrutalist border-and-offset-shadow language which conflicts with newer premium/glass surfaces already present in pages.

### Data and state patterns

- Auth and role state:
  - `lms/components/providers/auth-provider.js`
  - `lms/components/providers/locale-provider.js`
  - `lms/components/providers/theme-provider.js`
- Firestore domain logic:
  - `lms/lib/firestore/lms.js`
- Shared catalog and permission logic:
  - `lms/lib/catalog.js`
  - `lms/lib/workspace-navigation.js`
  - `lms/lib/role-guides.js`

## 2. Actual Route / Page Inventory

### Landing routes and entry pages

Detected via `landing/vite.config.mjs` and public HTML files.

- `/` -> main landing app
- `/founder/` -> founder page
- `/software-training-bangladesh`
- `/sme-software-bangladesh`
- `/orientation-2026`
- `/open-tech-cooperative-bangladesh`
- `/404`

### Landing app sections in `landing/src/App.jsx`

- `Nav`
- `Hero`
- `IntentPaths`
- `FounderMessage`
- `QuickStartPlaybook`
- `DepartmentsExplorer`
- `DepartmentLearningAtlas`
- `HowItWorks`
- `Roadmap`
- `Strategy`
- `SMESolutions`
- `Phase2`
- `Leadership`
- `MissionEconomicsSimulator`
- `FAQ`
- `Footer`

### LMS routes

Public routes:

- `/lms`
- `/lms/login`
- `/lms/register`
- `/lms/certificate-view`

Protected routes under `lms/app/(app)`:

- `/dashboard`
- `/courses`
- `/department`
- `/lesson`
- `/task`
- `/review`
- `/submissions`
- `/points`
- `/announcements`
- `/manual`
- `/manage`

### Certificate/public backend surfaces

From `functions/index.js`:

- `certificateEntryPage`
- `certificateShareImage`
- `resendEmailWebhook`
- `dailyStatsSummarizer`

These confirm the certificate verification and social sharing system is a real implemented product surface.

## 3. Actual Role / Feature / Workflow Inventory

### Role model

From `lms/lib/catalog.js` and route visibility checks:

- `super_admin`
- `director`
- `department_head`
- `mentor`
- `member`

### Department model

Nine implemented departments:

- Frontend Engineering
- Backend Engineering
- DevOps & QA
- UI/UX Design
- Graphic Design
- Business Analysis & Agile
- Product Management
- Digital Marketing
- CRM & Customer Success

Grouped under:

- Engineering
- Design
- Product
- Marketing

### Permission model

- Global-scope roles:
  - `super_admin`
  - `director`
- Management roles:
  - `super_admin`
  - `director`
  - `department_head`
- Review roles:
  - `super_admin`
  - `director`
  - `department_head`
  - `mentor`
- Points finalization roles:
  - `super_admin`
  - `director`
  - `department_head`

### Confirmed product workflows

- Auth:
  - email/password login and registration
  - Google sign-in
  - automatic profile provisioning
- Onboarding:
  - department selection
  - role-aware workspace initialization
- Learning flow:
  - department -> course -> lesson -> linked task -> submission
- Review flow:
  - mentor recommendation
  - approver final decision
  - ledger-backed points outcome
- Records flow:
  - submissions history
  - points ledger
  - weekly department leaderboard
- Management flow:
  - curriculum authoring
  - announcements
  - attendance
  - people and role access
  - certificate issuance and status control
  - certificate template editing
  - governance / destructive actions
  - audit log and restore bin
- Public trust flow:
  - online certificate verification
  - shareable certificate URL
  - dedicated OG image generation

## 4. Existing Design System / Styling Audit

### What already exists

- CSS variables for color tokens in both apps.
- Tailwind semantic color aliases in LMS config.
- Light and dark themes in both apps.
- Reduced-motion handling.
- Skip links and focus-visible styling.
- Premium/glass styling patterns in several page-level components.

### What is inconsistent

- Shared primitives still use:
  - thick black/white borders
  - offset hard shadows
  - heavy uppercase letter spacing
  - aggressive press effects
- Page-level surfaces often use:
  - soft borders
  - blurred cards
  - layered gradients
  - refined rounding
  - softer surface lift

Result: the product feels visually split between:

- older neobrutalist primitives
- newer premium SaaS page compositions

### Key styling files

- LMS:
  - `lms/app/globals.css`
  - `lms/tailwind.config.cjs`
  - `lms/components/ui/*`
- Landing:
  - `landing/src/index.css`
  - `landing/tailwind.config.cjs`
  - `landing/src/components/ui/*`

## 5. Real UI/UX Issues Found In Codebase

### Shared system issues

1. Primitive mismatch
- `button`, `card`, `input`, `badge`, `tabs`, and related controls still look default or legacy.
- This weakens brand ownership and premium perception across both landing and LMS.

2. Surface hierarchy inconsistency
- Many pages already use premium shells, but nested controls still collapse back to generic or flat styling.

3. Bangla source corruption
- Runtime normalization exists, which proves this is a real problem in source content.
- High-visibility surfaces still contain mojibake in source strings, especially in:
  - navigation
  - manual and role guidance
  - certificate verification shell
  - some public shell text

4. Navigation density mismatch
- LMS top navigation is conceptually stronger than a sidebar, but it still needs clearer hierarchy, better mobile grouping, and more consistent quick-action treatment.

5. Landing page scaling gaps
- The landing hero and top navigation already improved structurally, but laptop-range spacing and section cohesion still need a stronger shared surface rhythm.

### Page / component level examples

- `landing/src/components/landing/Nav.jsx`
  - good structure, but buttons still inherit legacy primitive styling in places
  - source-level Bangla text is corrupted in several constants
- `landing/src/components/landing/Hero.jsx`
  - strong structure, but needs better laptop spacing balance and cleaner multilingual source strings
- `lms/components/ui/app-menu-bar.jsx`
  - feature-rich and evidence-backed, but still visually mixed
  - mobile sheet and search finder can feel more premium and layered
- `lms/app/(app)/manual/page.js`
  - excellent role clarity and workflow coverage
  - source Bangla is corrupted in multiple literals
  - cards need stronger hierarchy separation
- `lms/app/(app)/submissions/page.js`
  - functional and useful
  - still contains corrupted Bangla literals in breadcrumb and copy strings
- `lms/components/pages/certificate-page-client.js`
  - certificate sharing workflow is strong
  - Bangla source literals are corrupted in several trust/error/status messages

## 6. New Visual Direction Summary

Target direction:

- premium SaaS
- executive and brand-owned
- layered, softly luminous, slightly dimensional
- teal-blue first
- selective gold only for trust, achievement, or governed emphasis

### Light mode

- softly tinted panels
- raised cards with subtle ambient highlights
- better section separation using tonal surfaces instead of thick black borders
- calmer typography rhythm

### Dark mode

- cinematic navy base rather than pure black
- teal and blue ambient glows
- stronger contrast through surface layering, not stark borders
- brighter, more intentional highlight treatment for actions and metrics

## 7. Theme Token Proposal

### Core brand tokens

- Teal anchor: `#0f766e`
- Blue anchor: `#3b82f6`
- Premium gold accent for achievement/trust states only

### System layers

- Background
- Raised surface
- Floating glass surface
- Strong action surface
- Muted informational surface
- Achievement surface

### Shared rules

- Larger radii for major surfaces
- softer borders with opacity rather than hard black lines
- layered shadows:
  - soft ambient
  - lift
  - glow
- tighter typography hierarchy:
  - display
  - heading
  - body
  - UI label
  - caption

## 8. Component Redesign Map Tied To Actual Files

### Shared primitives

- `lms/components/ui/button.jsx`
- `landing/src/components/ui/button.jsx`
  - Replace legacy border/shadow language with premium layered button system.

- `lms/components/ui/card.jsx`
- `landing/src/components/ui/card.jsx`
  - Standardize card depth, border softness, and background layering.

- `lms/components/ui/input.jsx`
- `landing/src/components/ui/input.jsx`
  - Improve field clarity, placeholder hierarchy, focus state, and dark-mode contrast.

- `lms/components/ui/badge.jsx`
  - Replace harsh bordered label style with semantic capsule system.

- `lms/components/ui/tabs.jsx`
  - Move from heavy uppercase tab styling to premium segmented control styling.

- `lms/components/ui/table.jsx`
  - Improve row spacing, headers, surface integration, and hover readability.

- `lms/components/ui/menubar.jsx`
  - Match dropdown and popover surfaces to the upgraded shell system.

### Shell and navigation components

- `landing/src/components/landing/Nav.jsx`
  - improve brand shell polish
  - source Bangla cleanup
  - smoother mobile/desktop control styling

- `landing/src/components/landing/Hero.jsx`
  - rebalance laptop spacing
  - improve CTA harmony
  - keep brand premium without visual clutter

- `lms/components/layout/public-shell.js`
  - strengthen public LMS frame, footer trust panels, and top utility bar

- `lms/components/layout/auth-shell.js`
  - unify workspace frame and loading/redirect states with new design system

- `lms/components/ui/app-menu-bar.jsx`
  - preserve feature behavior
  - improve search strip, action row, profile shell, and mobile menu sheet

- `lms/components/layout/mobile-bottom-bar.js`
  - refine dock visibility, active state, and integration with top menu

## 9. Page-By-Page Redesign Priorities

### Highest impact

1. Landing root experience
- User impact: highest
- Visual impact: highest
- Files:
  - `landing/src/App.jsx`
  - `landing/src/components/landing/Nav.jsx`
  - `landing/src/components/landing/Hero.jsx`
  - shared landing UI primitives

2. LMS workspace shell and top navigation
- User impact: highest
- Visual impact: highest
- Files:
  - `lms/components/layout/auth-shell.js`
  - `lms/components/ui/app-menu-bar.jsx`
  - `lms/components/layout/mobile-bottom-bar.js`
  - shared LMS primitives

3. Manual, submissions, and certificate verification
- User impact: high
- Visual impact: high
- Files:
  - `lms/app/(app)/manual/page.js`
  - `lms/app/(app)/submissions/page.js`
  - `lms/components/pages/certificate-page-client.js`
  - `lms/components/layout/public-shell.js`

### Supporting priorities

4. Route-level consistency across dashboard, department, courses, points, and management.
5. Source-level Bangla cleanup for high-visibility live surfaces.
6. Shared token and surface unification between landing and LMS.

## 10. Implementation Direction

Implementation should:

- preserve existing logic, routes, data flow, and role protections
- centralize styling upgrades in shared primitives and shell components
- clean real high-visibility Bangla source text instead of relying only on runtime normalization
- keep certificate, leaderboard, review, and management workflows intact
- improve premium perception across both public and logged-in experiences without inventing new product modules
