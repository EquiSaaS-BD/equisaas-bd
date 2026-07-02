# BD ERP POS Website And Update Feed Prompt

Use this prompt in the EquiSaaS BD website codebase when you want Codex to build the public product page and verify the update feed.

```text
You are working in the EquiSaaS BD website codebase at:
D:\projects\EquiSaaS BD

Goal: Add a professional public product page and delivery/update documentation for “BD ERP POS”.

Important source artifacts already copied locally:
- Public Velopack setup:
  https://updates.equisaas-bd.com/erp-pos/stable/BdErpPos-win-Setup.exe
- Velopack update feed:
  landing/public/erp-pos/stable/RELEASES
  landing/public/erp-pos/stable/releases.win.json
  landing/public/erp-pos/stable/assets.win.json
  Binary packages are served by the Cloudflare Worker from private GitHub release assets.

Security rules:
- Never commit or publish BdErpPos-production-private-key.pem.
- Never publish BdErpPos.LicenseGenerator.exe.
- Never publish client databases, license.key files, backups, .sqlite files, or vendor-secret folders.
- Large .exe/.nupkg/.zip payloads are intentionally ignored by Git and Firebase Hosting. They must be uploaded as GitHub release assets.

Website task:
1. Inspect the current landing app, Vite setup, route/static-page pattern, SEO metadata, sitemap, robots, and existing design language.
2. Create a professional BD ERP POS product page, ideally at /bd-erp-pos or /software/bd-erp-pos.
3. Add a homepage/service section or card linking to the page.
4. Add English + Bangla-friendly marketing copy.
5. Include CTA buttons:
   - Request Demo
   - Contact EquiSaaS BD
   - Download Windows Setup
6. The download CTA should point to:
   https://updates.equisaas-bd.com/erp-pos/stable/BdErpPos-win-Setup.exe
7. Explain license activation:
   - Client installs the software.
   - Software shows Hardware ID.
   - Client sends Hardware ID to EquiSaaS BD.
   - EquiSaaS BD generates a hardware-locked License Key.
   - Client pastes the key and activates offline.
8. Add SEO title, meta description, OpenGraph tags, and sitemap entry.
9. Add FAQ for offline mode, license, update, backup, thermal printer, A4 invoice, and customer baki ledger.

Update feed task:
1. Verify Firebase static hosting will serve this exact URL:
   https://updates.equisaas-bd.com/erp-pos/stable
2. Verify these direct files after deploy:
   https://updates.equisaas-bd.com/erp-pos/stable/RELEASES
   https://updates.equisaas-bd.com/erp-pos/stable/releases.win.json
   https://updates.equisaas-bd.com/erp-pos/stable/assets.win.json
   https://updates.equisaas-bd.com/erp-pos/stable/BdErpPos-<current-version>-full.nupkg
3. Ensure JSON/feed files are not redirected to index.html.
4. Keep feed files no-cache and package files long-cache.
5. Confirm firebase.json headers cover /erp-pos/stable and /downloads/bd-erp-pos.

Build and verification:
- Run npm run build.
- Confirm dist_deploy contains:
  dist_deploy/erp-pos/stable/RELEASES
  dist_deploy/erp-pos/stable/releases.win.json
  dist_deploy/erp-pos/stable/assets.win.json
- If deploying, run firebase deploy --only hosting.
- After deploy, test with:
  curl https://updates.equisaas-bd.com/erp-pos/stable/RELEASES
  curl https://updates.equisaas-bd.com/erp-pos/stable/releases.win.json

Report changed files, build result, deployment result, and final public URLs.
```
