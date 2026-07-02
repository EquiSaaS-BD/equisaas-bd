const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace('/src/main.jsx', '/src/projects.jsx');
content = content.replace("<title>EquiSaaS BD | Bangladesh's First Open Tech Cooperative</title>", "<title>Projects & Solutions | EquiSaaS BD</title>");
fs.writeFileSync('projects/index.html', content, 'utf8');
