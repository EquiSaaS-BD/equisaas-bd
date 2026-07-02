import fs from 'fs';
import path from 'path';

const PAGES = [
  {
    path: 'landing/index.html',
    keywords: 'Best Software Agency in Bangladesh, Top IT Company in BD, Open Tech Cooperative, Sweat Equity Platform, React JS Developers Bangladesh, Mobile App Development BD, DevOps Services Bangladesh, UI UX Design Agency BD',
  },
  {
    path: 'landing/projects/index.html',
    keywords: 'Software Projects Portfolio, Best SaaS Solutions Bangladesh, Enterprise Software Bangladesh, React App Portfolio, Web Development Agency Portfolio, Custom ERP Solutions BD',
  },
  {
    path: 'landing/partners/index.html',
    keywords: 'B2B Tech Partners Bangladesh, Software Reseller Program BD, IT Business Partnership, Affiliate Marketing Tech BD, Best Software Agency Partnership',
  },
  {
    path: 'landing/founder/index.html',
    keywords: 'Founder of EquiSaaS BD, Kholipha Ahmmad Al-Amin, Top Tech Entrepreneur Bangladesh, Software Engineer Founder, Open Tech Cooperative Founder, IT Leader BD',
  },
  {
    path: 'landing/bd-erp-pos/index.html',
    keywords: 'Best ERP Software in Bangladesh, Cloud POS System BD, Inventory Management Software Bangladesh, Super Shop POS System, Accounting Software BD, Web Based POS',
  },
  {
    path: 'landing/sme-software-bangladesh/index.html',
    keywords: 'SME Software Solutions BD, Business Automation Software Bangladesh, Retail Software BD, Small Business IT Solutions, Cheap POS Software BD, Cloud Accounting Bangladesh',
  },
  {
    path: 'landing/software-training-bangladesh/index.html',
    keywords: 'Best Software Training Institute BD, React JS Course Bangladesh, Node.js Training BD, Learn Web Development Dhaka, Full Stack Web Development Course BD, Tech Bootcamp Bangladesh',
  },
  {
    path: 'landing/open-tech-cooperative-bangladesh/index.html',
    keywords: 'Tech Cooperative Model, Profit Sharing IT Company Bangladesh, Sweat Equity Software Company, Alternative to Unpaid Internship, Software Engineer Community BD',
  },
  {
    path: 'landing/orientation-2026/index.html',
    keywords: 'EquiSaaS BD Orientation 2026, IT Seminar Bangladesh, Tech Career Guidance BD, Open Tech Cooperative Seminar',
  }
];

const injectSEO = () => {
  for (const page of PAGES) {
    const fullPath = path.resolve(process.cwd(), page.path);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }

    let content = fs.readFileSync(fullPath, 'utf8');

    // 1. Inject keywords if missing or update if exists
    const keywordMeta = `<meta name="keywords" content="${page.keywords}" />`;
    
    if (content.includes('<meta name="keywords"')) {
      content = content.replace(/<meta name="keywords".*?>/i, keywordMeta);
    } else {
      // Insert after description
      content = content.replace(/(<meta\s+name="description".*?>)/i, `$1\n    ${keywordMeta}`);
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Injected SEO into ${page.path}`);
  }
};

injectSEO();
