const fs = require('fs');

let content = fs.readFileSync('lms/components/certificates/workshop-certificate-panel.js', 'utf8');

// 1. Rename Component and Constants
content = content.replace(/WorkshopCertificatePanel/g, 'GlcCertificatePanel');
content = content.replace(/Workshop/g, 'GLC');
content = content.replace(/workshop/g, 'glc');
content = content.replace(/isGlcCertificate/g, 'isGLCCertificate');
content = content.replace(/GlcId/g, 'GLCId');
content = content.replace(/GlcTitle/g, 'GLCTitle');
content = content.replace(/GlcDateKey/g, 'GLCDateKey');
content = content.replace(/buildGlcCourseId/g, 'buildGLCCourseId');

// 2. Remove template fetching
content = content.replace(/const \[templates, setTemplates\] = useState\(\[\]\);/, '');
content = content.replace(/useEffect\(\(\) => \{\n    if \(\!enabled\) return;\n    fetchCertificateTemplates\(\)\n      .then\(setTemplates\)\n      .catch\(\(\) => setTemplates\(\[\]\)\);\n  \}, \[enabled\]\);/, '');

// 3. Fix the buildDefaultForm payload
content = content.replace(/certificateKind: "glc",/, 'certificateKind: "GLC",');
content = content.replace(/certificateTitle: "GLC Certificate of Completion",/, 'certificateTitle: "Certificate of Completion",\n    subjectTitle: "Professional Communication & Spoken English Certification",\n    achievementSummary: "This certificate validates that the recipient has actively participated in live interactive speaking drills, mastered core structural grammar formulas, and demonstrated competency in real-time professional communication, public speaking confidence, and active workplace interaction.",');
content = content.replace(/subjectTitle: "",/, '');
content = content.replace(/achievementSummary: "For successfully completing the online glc and meeting the EquiSaaS BD participation and learning requirements.",/, '');
content = content.replace(/signerName: DEFAULT_SIGNER_NAME,/, 'signerName: "Mehedi Hasan",');
content = content.replace(/signerTitle: DEFAULT_SIGNER_TITLE,/, 'signerTitle: "Lead Instructor & Founder",');
content = content.replace(/themeStyle: "classic",/, 'themeStyle: "glc-spoken-english",');

// 4. Fix the edit payload
content = content.replace(/certificateKind: "glc",/, 'certificateKind: "GLC",');
content = content.replace(/certificateTitle: certificate\.certificateTitle \|\| "GLC Certificate of Completion",/, 'certificateTitle: certificate.certificateTitle || "Certificate of Completion",');
content = content.replace(/signerName: certificate\.signerName \|\| DEFAULT_SIGNER_NAME,/, 'signerName: certificate.signerName || "Mehedi Hasan",');
content = content.replace(/signerTitle: certificate\.signerTitle \|\| DEFAULT_SIGNER_TITLE,/, 'signerTitle: certificate.signerTitle || "Lead Instructor & Founder",');
content = content.replace(/themeStyle: certificate\.themeStyle \|\| "classic",/, 'themeStyle: certificate.themeStyle || "glc-spoken-english",');

// 5. Force save payload
content = content.replace(/certificateKind: "glc",/, 'certificateKind: "GLC",');
content = content.replace(/courseTitle: "Online GLC",/, 'courseTitle: "GLC Intensive Live Sessions",\n            themeStyle: "glc-spoken-english",');

// 6. Remove the template selector UI
content = content.replace(/<div className="space-y-2">\s*<Label htmlFor="glc-template">[\s\S]*?<\/Select>\s*<\/div>\s*<div className="space-y-2">\s*<Label htmlFor="glc-recipient-lookup">/m, '<div className="space-y-2">\n                  <Label htmlFor="glc-recipient-lookup">');
content = content.replace(/<div className="grid gap-4 md:grid-cols-2">/m, '<div className="grid gap-4 md:grid-cols-1">');
content = content.replace(/const handleTemplateChange = \(value\) => \{[\s\S]*?\}\s*const handleGLCTitleChange/m, 'const handleGLCTitleChange');

fs.writeFileSync('lms/components/certificates/glc-certificate-panel.js', content);
console.log("Successfully generated glc-certificate-panel.js");
