import fs from 'fs';
import path from 'path';

// Define the curated catalog based on BD Market standards
const curatedServices = [
  // ----------------------------------------------------
  // FRONTEND DEPARTMENT
  // ----------------------------------------------------
  {
    title: "Basic Landing Page & Portfolio",
    group: "Engineering",
    subDepartment: "Frontend Department",
    priceBDT: 25000,
    priceUSD: 250,
    tags: ["React", "HTML/CSS", "Next.js", "WordPress"],
    description: "Professional, fast, and responsive landing page or portfolio website tailored for local and global SMEs.",
    seoKeywords: "Landing page design bd, portfolio website, cheap website design dhaka, react landing page",
    features: [
      "Responsive Mobile-First Design",
      "Basic On-Page SEO",
      "Fast Loading Speed (90+ score)",
      "Contact Form Integration"
    ]
  },
  {
    title: "Pro Corporate Website Development",
    group: "Engineering",
    subDepartment: "Frontend Department",
    priceBDT: 50000,
    priceUSD: 500,
    tags: ["Next.js", "React", "Corporate", "B2B"],
    description: "Multi-page corporate website with premium UI/UX, animations, and high performance for established brands.",
    seoKeywords: "Corporate website bd, business website development, nextjs agency dhaka",
    features: [
      "Custom UI/UX Design",
      "CMS Integration (Sanity/Strapi)",
      "Advanced SEO Optimization",
      "Smooth Framer Motion Animations",
      "Analytics Integration"
    ]
  },
  {
    title: "E-Commerce Frontend Development",
    group: "Engineering",
    subDepartment: "Frontend Department",
    priceBDT: 80000,
    priceUSD: 800,
    tags: ["Next.js", "E-commerce", "React", "TailwindCSS"],
    description: "High-conversion headless e-commerce frontend integrated with Shopify, WooCommerce, or custom backends.",
    seoKeywords: "Ecommerce website bd, headless ecommerce dhaka, online store developer",
    features: [
      "Lightning Fast Page Loads",
      "Shopping Cart & Checkout UI",
      "Product Filtering & Search",
      "Payment Gateway Integration Ready"
    ]
  },
  {
    title: "SaaS Web App UI/UX & Frontend",
    group: "Engineering",
    subDepartment: "Frontend Department",
    priceBDT: 100000,
    priceUSD: 1000,
    tags: ["SaaS", "Dashboard", "React", "Admin Panel"],
    description: "Complex, data-heavy admin dashboards and SaaS platforms with interactive charts, tables, and state management.",
    seoKeywords: "SaaS developer bd, admin dashboard design, complex web app dhaka",
    features: [
      "Complex State Management (Redux/Zustand)",
      "Interactive Data Visualization",
      "Role-based Access Control UI",
      "Real-time Data Updates"
    ]
  },

  // ----------------------------------------------------
  // BACKEND DEPARTMENT
  // ----------------------------------------------------
  {
    title: "Custom REST/GraphQL API Development",
    group: "Engineering",
    subDepartment: "Backend Department",
    priceBDT: 60000,
    priceUSD: 600,
    tags: ["Node.js", "Express", "Python", "GraphQL"],
    description: "Secure, scalable backend architectures to power your mobile and web applications.",
    seoKeywords: "API developer bd, backend development dhaka, nodejs developer",
    features: [
      "Secure Authentication & Authorization",
      "Optimized Database Queries",
      "Comprehensive API Documentation",
      "Third-party Service Integrations"
    ]
  },
  {
    title: "Enterprise Custom ERP / POS System",
    group: "Engineering",
    subDepartment: "Backend Department",
    priceBDT: 250000,
    priceUSD: 2500,
    tags: ["ERP", "POS", "Enterprise", "Node.js", "PostgreSQL"],
    description: "Fully customized Enterprise Resource Planning (ERP) or Point of Sale (POS) software for large scale operations.",
    seoKeywords: "ERP software bd, custom POS system dhaka, enterprise software development",
    features: [
      "Custom Module Architecture",
      "Inventory & Supply Chain Management",
      "Advanced Financial Reporting",
      "Cloud-native Scalable Architecture",
      "Multi-tenant Support"
    ]
  },
  {
    title: "Database Migration & Optimization",
    group: "Engineering",
    subDepartment: "Backend Department",
    priceBDT: 40000,
    priceUSD: 400,
    tags: ["PostgreSQL", "MongoDB", "MySQL", "Migration"],
    description: "Safely migrate your data between platforms or optimize your existing databases for speed and cost.",
    seoKeywords: "Database optimization bd, cloud migration services, SQL optimization",
    features: [
      "Zero Downtime Migration",
      "Index Optimization",
      "Data Integrity Verification",
      "Query Performance Tuning"
    ]
  },

  // ----------------------------------------------------
  // MOBILE APP DEPARTMENT (Assuming part of Frontend or separate)
  // ----------------------------------------------------
  {
    title: "Cross-Platform Mobile App (React Native)",
    group: "Engineering",
    subDepartment: "Frontend Department",
    priceBDT: 150000,
    priceUSD: 1500,
    tags: ["React Native", "Mobile App", "iOS", "Android"],
    description: "High-performance iOS and Android mobile applications using React Native.",
    seoKeywords: "Mobile app developer bd, react native agency dhaka, app development bangladesh",
    features: [
      "Cross-Platform Codebase",
      "Native Feel & Performance",
      "Push Notifications",
      "App Store & Play Store Submission"
    ]
  },

  // ----------------------------------------------------
  // DEVOPS & QA DEPARTMENT
  // ----------------------------------------------------
  {
    title: "Cloud Infrastructure Setup (AWS/GCP)",
    group: "Engineering",
    subDepartment: "DevOps & QA Department",
    priceBDT: 50000,
    priceUSD: 500,
    tags: ["AWS", "GCP", "Cloud", "Docker", "CI/CD"],
    description: "Professional cloud infrastructure setup ensuring security, high availability, and auto-scaling.",
    seoKeywords: "Cloud architect bd, AWS setup dhaka, DevOps services bangladesh",
    features: [
      "Docker Containerization",
      "CI/CD Pipeline Automation",
      "Load Balancing & Auto-scaling",
      "Automated Backups"
    ]
  },
  {
    title: "Comprehensive Security & Penetration Testing",
    group: "Engineering",
    subDepartment: "DevOps & QA Department",
    priceBDT: 80000,
    priceUSD: 800,
    tags: ["Security", "Pen Testing", "Audit"],
    description: "Rigorous security audits and penetration testing to protect your web apps from vulnerabilities.",
    seoKeywords: "Cyber security bd, penetration testing dhaka, web security audit",
    features: [
      "OWASP Top 10 Vulnerability Scan",
      "Detailed Audit Report",
      "Remediation Strategy",
      "Compliance Checks"
    ]
  },

  // ----------------------------------------------------
  // UI/UX DESIGN DEPARTMENT
  // ----------------------------------------------------
  {
    title: "Web/App Wireframing & Prototyping",
    group: "Design",
    subDepartment: "UI/UX Design",
    priceBDT: 25000,
    priceUSD: 250,
    tags: ["Figma", "Wireframe", "UX Research"],
    description: "Research-backed low and high-fidelity wireframes to visualize your software before development.",
    seoKeywords: "UX design bd, wireframing services dhaka, figma expert",
    features: [
      "User Journey Mapping",
      "Interactive Prototypes",
      "Competitor UX Analysis"
    ]
  },
  {
    title: "Premium Full App/Web UI Design",
    group: "Design",
    subDepartment: "UI/UX Design",
    priceBDT: 60000,
    priceUSD: 600,
    tags: ["UI Design", "Figma", "Design System"],
    description: "Pixel-perfect, modern, and accessible user interfaces designed for maximum user engagement.",
    seoKeywords: "UI design agency bd, app design dhaka, web design bangladesh",
    features: [
      "Comprehensive Design System",
      "Developer-ready Handoff",
      "Micro-interaction Concepts",
      "Accessibility (a11y) Standards"
    ]
  },

  // ----------------------------------------------------
  // GRAPHIC DESIGN DEPARTMENT
  // ----------------------------------------------------
  {
    title: "Complete Brand Identity Kit",
    group: "Design",
    subDepartment: "Graphic Design",
    priceBDT: 30000,
    priceUSD: 300,
    tags: ["Branding", "Logo", "Identity", "Illustrator"],
    description: "A comprehensive branding package including logos, color palettes, typography, and marketing assets.",
    seoKeywords: "Logo design bd, brand identity agency dhaka, graphic design services",
    features: [
      "Custom Logo Design (Multiple Concepts)",
      "Brand Guidelines Document",
      "Social Media Kit",
      "Stationery Design"
    ]
  },
  {
    title: "Marketing Materials & Banners",
    group: "Design",
    subDepartment: "Graphic Design",
    priceBDT: 15000,
    priceUSD: 150,
    tags: ["Social Media", "Banners", "Print"],
    description: "High-quality graphical assets for your digital campaigns and print media.",
    seoKeywords: "Banner design bd, social media post design dhaka",
    features: [
      "Ad Creatives for Facebook/Google",
      "Flyers and Brochures",
      "High-Resolution Print Files"
    ]
  },

  // ----------------------------------------------------
  // VIDEO EDITING DEPARTMENT
  // ----------------------------------------------------
  {
    title: "Promotional SaaS Explainer Video",
    group: "Media",
    subDepartment: "Video Editing",
    priceBDT: 40000,
    priceUSD: 400,
    tags: ["Animation", "Explainer", "After Effects"],
    description: "Engaging 60-90 second animated explainer videos to showcase your product's value proposition.",
    seoKeywords: "Explainer video bd, animation agency dhaka, saas video",
    features: [
      "Scriptwriting Assistance",
      "Professional Voiceover",
      "Custom 2D/3D Animations",
      "Background Music & SFX"
    ]
  },
  {
    title: "Corporate Documentary & Testimonials",
    group: "Media",
    subDepartment: "Video Editing",
    priceBDT: 50000,
    priceUSD: 500,
    tags: ["Video Editing", "Corporate", "Premiere Pro"],
    description: "Professional editing for corporate events, interviews, and client testimonials.",
    seoKeywords: "Corporate video editing bd, testimonial video dhaka",
    features: [
      "Color Grading",
      "Motion Graphics Titles",
      "Audio Cleanup",
      "Multi-cam Syncing"
    ]
  },

  // ----------------------------------------------------
  // DIGITAL MARKETING DEPARTMENT
  // ----------------------------------------------------
  {
    title: "Monthly Full-Stack SEO Retainer",
    group: "Marketing",
    subDepartment: "Digital Marketing",
    priceBDT: 35000,
    priceUSD: 350,
    tags: ["SEO", "Google Ranking", "Content"],
    description: "Comprehensive monthly Search Engine Optimization to boost your organic traffic and Google ranking.",
    seoKeywords: "SEO expert bd, SEO agency dhaka, google ranking bangladesh",
    features: [
      "Technical SEO Audits",
      "Keyword Research & Strategy",
      "On-page & Off-page Optimization",
      "Monthly Performance Reporting"
    ]
  },
  {
    title: "Social Media Management & Paid Ads (Meta/Google)",
    group: "Marketing",
    subDepartment: "Digital Marketing",
    priceBDT: 40000,
    priceUSD: 400,
    tags: ["SMM", "Meta Ads", "Google Ads", "PPC"],
    description: "End-to-end management of your social media profiles and high-ROI ad campaigns.",
    seoKeywords: "Digital marketing agency bd, facebook ads dhaka, PPC management",
    features: [
      "Content Calendar Creation",
      "Targeted Ad Campaigns",
      "A/B Testing Creatives",
      "Lead Generation & ROI Tracking"
    ]
  },

  // ----------------------------------------------------
  // PRODUCT ANALYSIS & MANAGEMENT
  // ----------------------------------------------------
  {
    title: "MVP Strategy & Product Roadmap",
    group: "Management",
    subDepartment: "Product Analysis & Management",
    priceBDT: 30000,
    priceUSD: 300,
    tags: ["Product Strategy", "MVP", "Consulting"],
    description: "Expert consulting to define your Minimum Viable Product, target audience, and go-to-market strategy.",
    seoKeywords: "Product manager bd, saas consultant dhaka, mvp strategy",
    features: [
      "Market & Competitor Research",
      "Feature Prioritization Matrix",
      "Phased Development Roadmap",
      "Monetization Strategy"
    ]
  },

  // ----------------------------------------------------
  // CUSTOMER SUPPORT & DOCS
  // ----------------------------------------------------
  {
    title: "Technical Documentation & API Specs",
    group: "Management",
    subDepartment: "Customer Support & Technical Documentation",
    priceBDT: 20000,
    priceUSD: 200,
    tags: ["Technical Writing", "Docs", "Swagger"],
    description: "Clear, comprehensive, and developer-friendly documentation for your APIs and software products.",
    seoKeywords: "Technical writer bd, api documentation dhaka",
    features: [
      "Swagger/OpenAPI Setup",
      "User Manuals & Guides",
      "Knowledge Base Creation",
      "Video Tutorials (Optional Add-on)"
    ]
  }
];

// Add unique IDs
curatedServices.forEach((service, index) => {
  service.id = `SRV-${String(index + 1).padStart(4, '0')}`;
});

const targetPath = path.resolve('D:/projects/EquiSaaS BD/landing/src/data/servicesCatalog.json');

try {
  fs.writeFileSync(targetPath, JSON.stringify(curatedServices, null, 2));
  console.log(`Successfully generated ${curatedServices.length} curated services at ${targetPath}`);
} catch (err) {
  console.error("Error writing catalog:", err);
}
