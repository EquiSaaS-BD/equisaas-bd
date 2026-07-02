import fs from 'fs';

const filePath = 'd:/projects/EquiSaaS BD/landing/src/data/chatbot-knowledge.js';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/Fardin Sazid/g, 'Fatema Akter');
content = content.replace(/fardin sazid/g, 'fatema akter');
content = content.replace(/Fardin/g, 'Fatema');
content = content.replace(/fardin/g, 'fatema');
content = content.replace(/Sazid/g, 'Akter');
content = content.replace(/sazid/g, 'akter');

content = content.replace(/ফারদিন সাজিদ/g, 'ফাতেমা আক্তার');
content = content.replace(/ফারদিন/g, 'ফাতেমা');
content = content.replace(/সাজিদ/g, 'আক্তার');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced successfully');
