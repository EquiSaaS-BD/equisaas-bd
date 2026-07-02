import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "landing", "public");
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Dhaka",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const sitemapEntries = [
  { loc: "https://equisaas-bd.com/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://equisaas-bd.com/founder/", changefreq: "monthly", priority: "0.9" },
  { loc: "https://equisaas-bd.com/bd-erp-pos/", changefreq: "weekly", priority: "0.9" },
  { loc: "https://equisaas-bd.com/open-tech-cooperative-bangladesh/", changefreq: "monthly", priority: "0.9" },
  { loc: "https://equisaas-bd.com/software-training-bangladesh/", changefreq: "monthly", priority: "0.9" },
  { loc: "https://equisaas-bd.com/sme-software-bangladesh/", changefreq: "monthly", priority: "0.9" },
  { loc: "https://equisaas-bd.com/orientation-2026/", changefreq: "monthly", priority: "0.8" },
  { loc: "https://equisaas-bd.com/presentation.html", changefreq: "monthly", priority: "0.7" },
  { loc: "https://equisaas-bd.com/lms/", changefreq: "weekly", priority: "0.8" },
  { loc: "https://equisaas-bd.com/lms/login", changefreq: "weekly", priority: "0.7" },
  { loc: "https://equisaas-bd.com/lms/register", changefreq: "weekly", priority: "0.7" },
  { loc: "https://equisaas-bd.com/lms/certificate", changefreq: "monthly", priority: "0.6" },
  { loc: "https://equisaas-bd.com/lms/certificate-view", changefreq: "monthly", priority: "0.6" },
  { loc: "https://equisaas-bd.com/projects/", changefreq: "weekly", priority: "0.9" },
  { loc: "https://equisaas-bd.com/services/", changefreq: "weekly", priority: "0.9" },
  { loc: "https://equisaas-bd.com/departments/", changefreq: "monthly", priority: "0.8" },
  { loc: "https://equisaas-bd.com/bd-erp-pos/manual/", changefreq: "monthly", priority: "0.8" },
  { loc: "https://equisaas-bd.com/partners/", changefreq: "monthly", priority: "0.8" },
  { loc: "https://equisaas-bd.com/proof-of-work/", changefreq: "weekly", priority: "0.8" },
  { loc: "https://equisaas-bd.com/privacy-policy/", changefreq: "monthly", priority: "0.6" },
  { loc: "https://equisaas-bd.com/license-terms/", changefreq: "monthly", priority: "0.6" },
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const videoSitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://equisaas-bd.com/orientation-2026/</loc>
    <video:video>
      <video:thumbnail_loc>https://i.ytimg.com/vi/PoGoPVgrmUo/hqdefault.jpg</video:thumbnail_loc>
      <video:title>EquiSaaS BD Orientation 2026: Join the Tech Revolution &amp; Build Real SaaS!</video:title>
      <video:description>Official EquiSaaS BD grand launching and orientation video covering the mission behind Bangladesh's first open tech cooperative, the 2-month roadmap, 9 core sub-departments, and the sweat equity path to shared ownership.</video:description>
      <video:player_loc>https://www.youtube.com/embed/PoGoPVgrmUo</video:player_loc>
      <video:duration>2687</video:duration>
      <video:publication_date>2026-03-17T00:00:00+06:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
      <video:tag>EquiSaaS BD</video:tag>
      <video:tag>EquiSaaS</video:tag>
      <video:tag>Orientation 2026</video:tag>
      <video:tag>Bangladesh SaaS</video:tag>
      <video:tag>Tech Cooperative</video:tag>
      <video:tag>Bangladesh's First Open Tech Cooperative</video:tag>
      <video:tag>LMS Bangladesh</video:tag>
    </video:video>
  </url>
</urlset>
`;

const robotsTxt = `# Major search engine bots - explicit allow rules for better SEO
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: Facebot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: meta-externalfetcher
Allow: /

# AI and LLM bots
User-agent: CCBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: OmgiliBot
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: PerplexityBot
Allow: /

# General crawler rules
User-agent: *
Allow: /
Disallow: /lms/admin/
Disallow: /lms/dashboard/
Disallow: /lms/api/
Disallow: /lms/auth/

# Do not block query-string URLs globally. Certificate verification and
# social-share URLs depend on query parameters and must remain crawlable by
# LinkedIn, Facebook, and other preview bots.

Sitemap: https://equisaas-bd.com/sitemap.xml
Sitemap: https://equisaas-bd.com/video-sitemap.xml
`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml);
fs.writeFileSync(path.join(publicDir, "video-sitemap.xml"), videoSitemapXml);
fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt);

console.log(
  JSON.stringify(
    {
      ok: true,
      updated: [
        "landing/public/sitemap.xml",
        "landing/public/video-sitemap.xml",
        "landing/public/robots.txt",
      ],
      lastmod: today,
    },
    null,
    2,
  ),
);
