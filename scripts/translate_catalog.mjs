import fs from 'fs/promises';
import path from 'path';

const catalogPath = path.resolve('landing/src/data/servicesCatalog.json');

async function translateChunk(text) {
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
  console.log(`Processing ${data.length} services...`);

  const CHUNK_SIZE = 5;
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    const chunk = data.slice(i, i + CHUNK_SIZE);
    
    // Check if we need translation (if first item has titleBn)
    if (chunk[0].titleBn) continue;

    console.log(`Translating ${i} to ${i + CHUNK_SIZE - 1}...`);
    
    // We will build one large string for title, one for description, and one for features
    const titles = chunk.map(s => s.title).join(' |^| ');
    const descs = chunk.map(s => s.description).join(' |^| ');
    
    const translatedTitles = (await translateChunk(titles)).split(' |^| ').map(s => s.trim());
    await sleep(200);
    const translatedDescs = (await translateChunk(descs)).split(' |^| ').map(s => s.trim());
    await sleep(200);

    for (let j = 0; j < chunk.length; j++) {
      const srv = chunk[j];
      srv.titleBn = translatedTitles[j] || srv.title;
      srv.descriptionBn = translatedDescs[j] || srv.description;

      // Price adjustments
      const dept = srv.subDepartment;
      let targetPrice = srv.priceBDT;
      if (dept.includes('Graphic')) targetPrice = Math.max(1000, Math.floor(srv.priceBDT * 0.4));
      else if (dept.includes('Video')) targetPrice = Math.max(2000, Math.floor(srv.priceBDT * 0.5));
      else if (dept.includes('Marketing')) targetPrice = Math.max(5000, Math.floor(srv.priceBDT * 0.5));
      else if (dept.includes('Frontend') || dept.includes('Backend') || dept.includes('Full Stack')) targetPrice = Math.max(10000, Math.floor(srv.priceBDT * 0.6));
      else targetPrice = Math.floor(srv.priceBDT * 0.7);

      srv.priceBDT = targetPrice;
      
      // Features
      srv.featuresBn = srv.features.map(f => f); // We will fallback to English if it's too much API usage, or translate them
    }
    
    // Translate features (which is an array of arrays basically)
    const allFeatures = chunk.flatMap(s => s.features).join(' |^| ');
    const trFeatures = (await translateChunk(allFeatures)).split(' |^| ').map(s => s.trim());
    let fIndex = 0;
    for (let j = 0; j < chunk.length; j++) {
      const srv = chunk[j];
      srv.featuresBn = srv.features.map(() => trFeatures[fIndex++] || "");
    }
    await sleep(300);

    // Save progressively to not lose data
    if (i % 20 === 0) {
      await fs.writeFile(catalogPath, JSON.stringify(data, null, 2));
    }
  }

  await fs.writeFile(catalogPath, JSON.stringify(data, null, 2));
  console.log("Translation and pricing update complete!");
}

main().catch(console.error);
