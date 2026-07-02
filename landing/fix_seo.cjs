const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const landingDir = path.resolve(__dirname, '../landing');

const routes = [
  { path: 'index.html', title: 'EquiSaaS BD | Bangladesh SaaS Company & Open Tech Cooperative', desc: 'EquiSaaS BD is Bangladesh\'s first open tech cooperative. Join our 64-district network, get free software training, and earn sweat equity by building B2B SME SaaS.' },
  { path: 'projects', title: 'Projects & Solutions | EquiSaaS BD', desc: 'Explore real, production-ready SaaS products built by EquiSaaS BD’s 64-district tech cooperative. ERP, POS, and LMS platforms built entirely with proof of work.' },
  { path: 'partners', title: 'Our Official Partners | EquiSaaS BD', desc: 'EquiSaaS BD collaborates with industry leaders like Ghashful Learning Center, Motionly Media, and Graduation Gate to build a steady, well-supported open tech ecosystem in Bangladesh.' },
  { path: 'founder', title: 'Founder & CEO | EquiSaaS BD', desc: 'Read the message from Kholipha Ahmmad Al-Amin, Founder and CEO of EquiSaaS BD, on building a 64-district open tech cooperative and eliminating unpaid internships.' },
  { path: 'bd-erp-pos', title: 'BD ERP POS | Best SME Software in Bangladesh', desc: 'Download BD ERP POS, the ultimate Windows-based POS and ERP software for Bangladesh SMEs, retail shops, and pharmacies. Built by EquiSaaS BD.' },
  { path: 'bd-erp-pos/manual', title: 'BD ERP POS User Manual | EquiSaaS BD', desc: 'Read the complete offline installation, activation, and usage manual for BD ERP POS.' },
  { path: 'software-training-bangladesh', title: 'Software Training in Bangladesh | EquiSaaS BD', desc: 'Join EquiSaaS BD for production-grade software training in Bangladesh. Learn Frontend, Backend, UI/UX, and DevOps with our unique sweat equity model.' },
  { path: 'sme-software-bangladesh', title: 'SME Software in Bangladesh | EquiSaaS BD', desc: 'Explore specialized SME software in Bangladesh including HR Payroll, POS, and Pharmacy Inventory systems built by EquiSaaS BD.' },
  { path: 'orientation-2026', title: 'Orientation 2026 | EquiSaaS BD', desc: 'Watch the official EquiSaaS BD grand launching and orientation video covering our mission, roadmap, and sweat equity path.' },
  { path: 'open-tech-cooperative-bangladesh', title: 'Open Tech Cooperative in Bangladesh | EquiSaaS BD', desc: 'Discover Bangladesh’s first open tech cooperative. We are building a decentralized 64-district builder network to stop labor exploitation.' },
  { path: 'privacy-policy', title: 'Privacy Policy | EquiSaaS BD', desc: 'Read the privacy policy of EquiSaaS BD and understand how we protect your data within our ecosystem.' },
  { path: 'license-terms', title: 'License Terms | EquiSaaS BD', desc: 'Read the official software license terms for products distributed by EquiSaaS BD.' },
  { path: 'services', title: '750+ IT & Tech Services | EquiSaaS BD', desc: 'Explore our catalog of 750+ world-class IT, engineering, design, and marketing services built for scale and performance.' },
  { path: 'departments', title: 'Our 9 Specialized Departments | EquiSaaS BD', desc: 'Explore the 9 core technical and management departments at EquiSaaS BD, including Frontend, Backend, UI/UX, and Digital Marketing.' },
  { path: 'proof-of-work', title: 'Proof of Work Validation | EquiSaaS BD', desc: 'Verify official certificates and proof-of-work records of our community contributors.' },
  { path: '404.html', title: 'Page Not Found | EquiSaaS BD', desc: 'The page you are looking for does not exist in the EquiSaaS BD ecosystem.' }
];

async function processHtmlFiles() {
  for (const route of routes) {
    const isRootFile = route.path.endsWith('.html');
    const filePath = isRootFile 
      ? path.join(landingDir, route.path)
      : path.join(landingDir, route.path, 'index.html');
      
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${route.path}, file not found at ${filePath}`);
      continue;
    }

    let html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // 1. Fix Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = route.path === 'index.html' ? `https://equisaas-bd.com/` : (isRootFile ? `https://equisaas-bd.com/${route.path}` : `https://equisaas-bd.com/${route.path}/`);
    if (canonical) {
      canonical.href = canonicalUrl;
    }

    // 2. Fix OG URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.content = canonicalUrl;
    }

    // 3. Fix Title
    let title = document.querySelector('title');
    if (title) title.textContent = route.title;
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = route.title;
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.content = route.title;

    // 4. Fix Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = route.desc;
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = route.desc;
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.content = route.desc;

    // 5. Replace Duplicate seo-fallback
    let mainFallback = document.querySelector('main#seo-fallback');
    if (mainFallback) {
      mainFallback.innerHTML = `
        <section class="seo-hero">
          <h1>${route.title}</h1>
          <p>${route.desc}</p>
          <div class="seo-links">
            <a class="seo-button" href="/">Back to Home</a>
            <a class="seo-button alt" href="/lms/login">Open the LMS</a>
            <a class="seo-button alt" href="https://wa.me/8801570212260">Contact Support</a>
          </div>
        </section>
      `;
    }

    // 6. Fix JSON-LD based on route
    let scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
    scriptTags.forEach(script => {
      let data = JSON.parse(script.innerHTML || "{}");
      if (data["@graph"]) {
        // Find Organization
        let orgIndex = data["@graph"].findIndex(item => item["@type"] === "Organization");
        let personIndex = data["@graph"].findIndex(item => item["@type"] === "Person");
        let videoIndex = data["@graph"].findIndex(item => item["@type"] === "VideoObject");
        let faqIndex = data["@graph"].findIndex(item => item["@type"] === "FAQPage");
        
        // Remove massive organization/person from subpages unless it's the founder or open-tech page
        if (route.path !== 'founder' && route.path !== 'open-tech-cooperative-bangladesh') {
          if (orgIndex !== -1) data["@graph"].splice(orgIndex, 1);
          personIndex = data["@graph"].findIndex(item => item["@type"] === "Person"); // Re-find
          if (personIndex !== -1) data["@graph"].splice(personIndex, 1);
          videoIndex = data["@graph"].findIndex(item => item["@type"] === "VideoObject"); // Re-find
          if (videoIndex !== -1) data["@graph"].splice(videoIndex, 1);
          faqIndex = data["@graph"].findIndex(item => item["@type"] === "FAQPage"); // Re-find
          if (faqIndex !== -1) data["@graph"].splice(faqIndex, 1);
        }

        // Add Breadcrumb
        let breadcrumbIndex = data["@graph"].findIndex(item => item["@type"] === "BreadcrumbList");
        if (breadcrumbIndex !== -1) {
          data["@graph"][breadcrumbIndex].itemListElement = [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://equisaas-bd.com/" },
            { "@type": "ListItem", "position": 2, "name": route.title.split('|')[0].trim(), "item": canonicalUrl }
          ];
        }

        // Add SoftwareApplication to bd-erp-pos
        if (route.path === 'bd-erp-pos') {
          data["@graph"].push({
            "@type": "SoftwareApplication",
            "name": "BD ERP POS",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Windows 10, Windows 11",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "BDT"
            }
          });
        }
      }
      script.innerHTML = JSON.stringify(data, null, 2);
    });

    // Write back to file, JSDOM wraps it in html/body so we extract the outerHTML
    fs.writeFileSync(filePath, dom.serialize(), 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

processHtmlFiles().catch(console.error);
