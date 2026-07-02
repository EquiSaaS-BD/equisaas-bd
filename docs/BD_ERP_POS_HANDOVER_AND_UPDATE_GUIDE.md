# BD ERP POS Handover And Update Guide

## Public Files Copied Locally

Client installer:

`https://updates.equisaas-bd.com/erp-pos/stable/BdErpPos-win-Setup.exe`

Velopack update feed:

`landing/public/erp-pos/stable/RELEASES`

`landing/public/erp-pos/stable/releases.win.json`

`landing/public/erp-pos/stable/assets.win.json`

Binary packages are served by the Cloudflare Worker from private GitHub release assets, not from Firebase Hosting.

## Do Not Publish

Never put these in the public website or client delivery package:

- `BdErpPos-production-private-key.pem`
- `BdErpPos.LicenseGenerator.exe`
- `license.key`
- client `.sqlite` database files
- customer backup ZIP files
- `vendor-secret` folders

## Client Handover

1. Send the client the Velopack setup URL:
   `https://updates.equisaas-bd.com/erp-pos/stable/BdErpPos-win-Setup.exe`
2. Client installs and opens BD ERP POS.
3. The activation screen shows a Hardware ID.
4. Client sends the Hardware ID to EquiSaaS BD.
5. Vendor opens the internal License Generator locally.
6. Vendor loads the private key from the secure vendor machine.
7. Vendor enters client name, Hardware ID, edition, and expiry date.
8. Vendor sends only the generated License Key to the client.
9. Client pastes the License Key and activates offline.

## How Updates Work

BD ERP POS checks this feed:

`https://updates.equisaas-bd.com/erp-pos/stable`

The app downloads a new Velopack package when available. After download, the app shows `Restart to Update`. When the user clicks it, the update is applied and the app restarts.

For every new version:

1. Create a new software release tag, for example `v1.0.1`.
2. Let GitHub Actions build the Velopack release.
3. Confirm the GitHub release contains `BdErpPos-win-Setup.exe`, `BdErpPos-<version>-full.nupkg`, `BdErpPos-win-Portable.zip`, `RELEASES`, and the JSON manifests.
4. Upload/copy only the new feed metadata files into:
   `landing/public/erp-pos/stable/`
5. Run the website build/deploy.
6. Verify:
   `https://updates.equisaas-bd.com/erp-pos/stable/RELEASES`
   `https://updates.equisaas-bd.com/erp-pos/stable/releases.win.json`

## Why Large Files Are Ignored By Git

The `.exe`, `.nupkg`, and `.zip` files are over 100 MB and must not be published to Firebase Hosting. GitHub release assets hold the binaries; Firebase keeps only the lightweight metadata files.
