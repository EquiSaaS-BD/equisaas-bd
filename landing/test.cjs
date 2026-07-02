const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  console.log('Navigating to http://localhost:5173/');
  await page.goto('http://localhost:5173/');
  
  console.log('Waiting for #leadership...');
  await page.waitForSelector('#leadership');
  
  console.log('Clicking Table View button...');
  // Find the table view button. It has an aria-label 'Table View' or 'টেবিল ভিউ'.
  // Let's find button with grid/table icons. The Table View button has aria-label of copy.tableView.
  const buttons = await page.$$('button');
  let tableBtn = null;
  for (const btn of buttons) {
    const html = await page.evaluate(el => el.innerHTML, btn);
    if (html.includes('lucide-table')) {
      tableBtn = btn;
      break;
    }
  }
  
  if (tableBtn) {
    console.log('Found table button, clicking...');
    await tableBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    console.log('Clicked. Waiting...');
  } else {
    console.log('Table button not found!');
  }
  
  await browser.close();
})();
