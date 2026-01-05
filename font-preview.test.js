/**
 * Font Preview Test - Iteration 1
 * Tests 4 font options and captures screenshots for user selection
 */
const { test } = require('@playwright/test');

const FONTS = [
  {
    name: 'Inter',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    description: 'Modern, clean, excellent readability',
  },
  {
    name: 'DM Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap',
    description: 'Geometric, friendly, cannabis-culture friendly',
  },
  {
    name: 'Space Grotesk',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap',
    description: 'Unique, tech-forward, distinctive',
  },
  {
    name: 'Manrope',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700&display=swap',
    description: 'Rounded, approachable, smooth',
  },
];

test.describe('Font Preview for Dabta', () => {
  for (const font of FONTS) {
    test(`Preview: ${font.name}`, async ({ page }) => {
      console.log(`\n📝 Testing font: ${font.name}`);
      console.log(`   Description: ${font.description}`);

      // Navigate to the app
      await page.goto('http://localhost:5173/Tracker/');

      // Inject Google Fonts stylesheet
      await page.addStyleTag({ url: font.googleFontsUrl });

      // Apply font to body
      await page.evaluate((fontName) => {
        document.body.style.fontFamily = `'${fontName}', system-ui, sans-serif`;
      }, font.name);

      // Wait for font to load
      await page.waitForTimeout(1000);

      // Screenshot 1: Quick Entry page
      console.log(`   📸 Capturing Quick Entry...`);
      await page.screenshot({
        path: `font-preview-${font.name.replace(' ', '-')}-quickentry.png`,
        fullPage: true,
      });

      // Navigate to Dashboard (swipe or click)
      // Try clicking through page indicators or swiping
      await page.evaluate(() => {
        const container = document.querySelector('.swipe-page');
        if (container && container.parentElement) {
          container.parentElement.scrollLeft = window.innerWidth;
        }
      });
      await page.waitForTimeout(500);

      // Screenshot 2: Dashboard page
      console.log(`   📸 Capturing Dashboard...`);
      await page.screenshot({
        path: `font-preview-${font.name.replace(' ', '-')}-dashboard.png`,
        fullPage: true,
      });

      console.log(`   ✅ ${font.name} preview complete\n`);
    });
  }
});
