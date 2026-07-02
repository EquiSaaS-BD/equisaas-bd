# Google Search Console Live Checklist

Date: April 6, 2026
Primary domain: https://equisaas-bd.com/

## 1. Verify the right property
- Use a Domain Property for `equisaas-bd.com`
- If it is already verified, confirm the verified owner list is correct

## 2. Confirm robots and sitemaps are live
Open these URLs in a browser:
- https://equisaas-bd.com/robots.txt
- https://equisaas-bd.com/sitemap.xml
- https://equisaas-bd.com/video-sitemap.xml
- https://equisaas-bd.com/llms.txt

## 3. Submit the main sitemaps
In Search Console, submit:
- `https://equisaas-bd.com/sitemap.xml`
- `https://equisaas-bd.com/video-sitemap.xml`

## 4. Request indexing for the most important pages
Use URL Inspection and request indexing for:
- `https://equisaas-bd.com/`
- `https://equisaas-bd.com/founder/`
- `https://equisaas-bd.com/open-tech-cooperative-bangladesh/`
- `https://equisaas-bd.com/software-training-bangladesh/`
- `https://equisaas-bd.com/sme-software-bangladesh/`
- `https://equisaas-bd.com/orientation-2026/`
- `https://equisaas-bd.com/lms`
- `https://equisaas-bd.com/lms/certificate`

## 5. Check the right reports after recrawl
- Pages indexing
- Video indexing
- Page experience
- HTTPS
- Enhancements for structured data if surfaced

## 6. What success looks like
- Google sees `robots.txt`
- both sitemaps are processed
- important URLs are indexed under the apex domain
- the orientation page starts showing up in the video indexing report
- duplicate `web.app` URLs are not chosen as canonical

## 7. If Google still says robots.txt is missing
- Re-open `https://equisaas-bd.com/robots.txt` in a clean browser session
- Re-submit `https://equisaas-bd.com/sitemap.xml`
- Request indexing for the homepage again
- Wait 24 to 72 hours before concluding it is still missing

## 8. Suggested repeat workflow after major SEO changes
```powershell
cd "D:\projects\EquiSaaS BD"
npm run audit:seo:full
npm run build
$env:FUNCTIONS_DISCOVERY_TIMEOUT='30'
npm run firebase:deploy
node scripts/submit-indexnow.mjs
```
