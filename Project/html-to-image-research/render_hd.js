const puppeteer = require('puppeteer-core'); // FAST
const path = require('path');
const fs = require('fs');

// --- Configuration ---
// Input file path
const INPUT_HTML = path.join(process.cwd(), '..', 'su-ceo-profile', 'su_story.html');
const OUTPUT_IMAGE = path.join(__dirname, 'screenshot_hd_final.png');

// Resolution params (Simulating 4K Retina)
const VIEWPORT_WIDTH = 1920;
const VIEWPORT_HEIGHT = 1080;
const DEVICE_SCALE_FACTOR = 3; 

// Chrome Path (User's system)
const CHROME_PATH = "C:\\Users\\31509\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe";

(async () => {
  console.log('🦉 Clawd HTML-to-Image Agent Starting...');
  console.log(`Target: ${INPUT_HTML}`);
  console.log(`Resolution: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT} @ ${DEVICE_SCALE_FACTOR}x DPI`);
  console.log(`Chrome: ${CHROME_PATH}`);

  // Launch browser
  try {
      const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: "new",
        defaultViewport: null, // Let us control it
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
      
      const page = await browser.newPage();

      // Set Viewport (Retina simulation)
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
        deviceScaleFactor: DEVICE_SCALE_FACTOR,
      });

      // Navigate to local file
      const fileUrl = `file://${INPUT_HTML.replace(/\\/g, '/')}`;
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });

      // Wait a bit
      await new Promise(r => setTimeout(r, 2000));

      // Screenshot Full Page
      await page.screenshot({
        path: OUTPUT_IMAGE,
        fullPage: true,
        omitBackground: false
      });

      console.log(`✅ Snapshot saved to: ${OUTPUT_IMAGE}`);
      
      await browser.close();
  } catch (err) {
      console.error("❌ FAILED:", err);
      process.exit(1);
  }
})();
