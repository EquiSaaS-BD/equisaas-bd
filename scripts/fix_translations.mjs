import fs from 'fs/promises';
import path from 'path';

const catalogPath = path.resolve('landing/src/data/servicesCatalog.json');

async function translateText(text) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();
    return json[0].map(item => item[0]).join('');
  } catch (err) {
    console.error("Translation error", err.message);
    return text;
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const data = JSON.parse(await fs.readFile(catalogPath, 'utf-8'));
  
  const badItems = data.filter(s => !s.titleBn || s.titleBn === s.title || s.titleBn.includes('|') || s.featuresBn.some(f => f.includes('|')));
  console.log(`Found ${badItems.length} badly translated services. Fixing individually...`);

  let count = 0;
  for (const srv of data) {
    const isBad = !srv.titleBn || srv.titleBn === srv.title || srv.titleBn.includes('|') || srv.featuresBn.some(f => f.includes('|'));
    
    if (isBad) {
      console.log(`Fixing: ${srv.id} - ${srv.title}`);
      srv.titleBn = await translateText(srv.title);
      await sleep(150);
      srv.descriptionBn = await translateText(srv.description);
      await sleep(150);
      
      const fixedFeatures = [];
      for (const feature of srv.features) {
        fixedFeatures.push(await translateText(feature));
        await sleep(100);
      }
      srv.featuresBn = fixedFeatures;
      
      count++;
      if (count % 10 === 0) {
        console.log(`Fixed ${count}/${badItems.length}...`);
        await fs.writeFile(catalogPath, JSON.stringify(data, null, 2));
      }
    }
  }

  await fs.writeFile(catalogPath, JSON.stringify(data, null, 2));
  console.log("Translation fix complete!");
}

main().catch(console.error);
