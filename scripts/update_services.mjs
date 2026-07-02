import fs from 'fs/promises';
import path from 'path';

const catalogPath = path.resolve('landing/src/data/servicesCatalog.json');

// Helper to generate relevant features
function generateFeatures(title, department) {
  const t = title.toLowerCase();
  if (t.includes('react') || t.includes('next.js') || t.includes('vue') || department.includes('Frontend')) {
    return [
      "Responsive & Mobile-First Design",
      "Pixel-perfect UI Implementation",
      "Component-based Architecture",
      "Performance Optimization & SEO basic",
      "Cross-browser Compatibility"
    ];
  }
  if (t.includes('node') || t.includes('backend') || t.includes('api') || department.includes('Backend')) {
    return [
      "Scalable Server Architecture",
      "RESTful / GraphQL API Development",
      "Secure Database Integration",
      "Authentication & Authorization",
      "Optimized Queries & Caching"
    ];
  }
  if (t.includes('video') || t.includes('edit') || t.includes('animation') || t.includes('color grading')) {
    return [
      "High-Quality Output (1080p/4K)",
      "Professional Transitions & Effects",
      "Color Grading & Audio Mixing",
      "Unlimited Revisions (within scope)",
      "Source Files Included"
    ];
  }
  if (t.includes('design') || t.includes('ui/ux') || t.includes('graphic')) {
    return [
      "User-Centric Research & Strategy",
      "Wireframing & Prototyping",
      "High-Fidelity Visual Design",
      "Design System & Style Guide",
      "Figma / Adobe XD Source Files"
    ];
  }
  if (t.includes('marketing') || t.includes('seo') || t.includes('social')) {
    return [
      "Comprehensive Market Research",
      "Target Audience Profiling",
      "Data-Driven Campaign Strategy",
      "Performance Tracking & Analytics",
      "Weekly Progress Reporting"
    ];
  }
  if (t.includes('devops') || t.includes('qa') || t.includes('testing')) {
    return [
      "CI/CD Pipeline Setup",
      "Automated Testing Implementation",
      "Server Configuration & Security",
      "Performance & Load Testing",
      "Monitoring & Alerting Setup"
    ];
  }
  // Default fallback
  return [
    "Dedicated Project Manager",
    "Requirements Analysis",
    "Professional Execution",
    "Quality Assurance",
    "Post-Delivery Support"
  ];
}

// Full Stack Packaged Solutions Generator
function generateFullStackServices(startId) {
  const packages = [
    { title: "Complete E-Commerce Web & App Solution", tags: ["E-Commerce", "Full Stack", "App"] },
    { title: "Enterprise ERP & POS System Integration", tags: ["ERP", "POS", "Full Stack"] },
    { title: "Ride Sharing Platform (App + Admin)", tags: ["Ride Sharing", "App", "Admin"] },
    { title: "Food Delivery Multivendor Ecosystem", tags: ["Food Delivery", "Multivendor", "App"] },
    { title: "B2B SaaS Platform Development", tags: ["SaaS", "B2B", "Platform"] },
    { title: "Real Estate Management Portal", tags: ["Real Estate", "Portal", "Full Stack"] },
    { title: "Hospital Management System", tags: ["Healthcare", "ERP", "Management"] },
    { title: "LMS & EdTech Complete Solution", tags: ["EdTech", "LMS", "Full Stack"] },
    { title: "Fintech Wallet & Payment Gateway", tags: ["Fintech", "Wallet", "Full Stack"] },
    { title: "On-Demand Services Booking App", tags: ["On-Demand", "Booking", "App"] }
  ];

  const levels = ["Basic", "Professional", "Enterprise", "Custom Scale", "Ultimate"];
  const newServices = [];
  let idCounter = startId;

  packages.forEach(pkg => {
    levels.forEach((level, index) => {
      const priceBDT = 100000 + (index * 150000);
      const priceUSD = 1000 + (index * 1500);
      
      newServices.push({
        id: `SRV-${String(idCounter++).padStart(4, '0')}`,
        title: `${level} ${pkg.title}`,
        group: "Engineering",
        subDepartment: "Full Stack & App Dev Solutions",
        priceBDT,
        priceUSD,
        tags: [...pkg.tags, level, "Solution"],
        description: `End-to-end ${level.toLowerCase()} level ${pkg.title.toLowerCase()} service by EquiSaaS BD. Includes design, frontend, backend, and deployment.`,
        seoKeywords: `${pkg.tags.join(', ')}, full stack development, software solution bd`,
        features: [
          "End-to-End Development (Frontend + Backend)",
          "UI/UX Custom Design System",
          "Cloud Infrastructure Setup (AWS/GCP)",
          "1 Year Free Maintenance & Support",
          "Scalable Microservices Architecture"
        ]
      });
    });
  });

  return newServices;
}

async function main() {
  const data = JSON.parse(await fs.readFile(catalogPath, 'utf-8'));
  
  // 1. Process existing services
  for (const srv of data) {
    const t = srv.title.toLowerCase();
    
    // Fix Video Editing
    if (t.includes('video') || t.includes('color grading') || t.includes('subtitling') || t.includes('captioning') || t.includes('reels') || t.includes('tiktok')) {
      srv.subDepartment = "Video Editing & Production";
    }

    // Add features
    if (!srv.features) {
      srv.features = generateFeatures(srv.title, srv.subDepartment);
    }
  }

  // 2. Generate new packaged services
  const nextId = parseInt(data[data.length - 1].id.split('-')[1]) + 1;
  const newServices = generateFullStackServices(nextId);
  
  const finalData = [...data, ...newServices];

  await fs.writeFile(catalogPath, JSON.stringify(finalData, null, 2));
  console.log(`Successfully upgraded services catalog. Total services: ${finalData.length}`);
}

main().catch(console.error);
