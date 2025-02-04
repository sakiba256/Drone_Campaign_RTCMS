const { chromium } = require('playwright');

(async () => {
  // Launch Chrome in UI mode (headless: false)
  const browser = await chromium.launch({ headless: false });  // headless: false opens Chrome UI
  const page = await browser.newPage();
  
  // Navigate to a URL
  await page.goto('https://example.com');
  
  // Log the page title to the console
  console.log(await page.title());
  
  // Wait for a few seconds before closing the browser (optional)
  await page.waitForTimeout(5000);  // Wait for 5 seconds
  
  // Close the browser
  await browser.close();
})();
