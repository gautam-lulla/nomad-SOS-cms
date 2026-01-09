import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'private-events', path: '/private-events' },
  { name: 'menu', path: '/menu' },
  { name: 'programming', path: '/programming' },
  { name: 'contact', path: '/contact' },
  { name: 'faq', path: '/faq' },
  { name: '404', path: '/404-test' },
];

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '768', width: 768, height: 1024 },
  { name: '375', width: 375, height: 812 },
];

async function captureScreenshots() {
  const outputDir = path.join(process.cwd(), 'docs', 'browser-renders');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    for (const pageConfig of PAGES) {
      try {
        await page.goto(`http://localhost:3000${pageConfig.path}`, {
          waitUntil: 'networkidle',
        });

        // Scroll to bottom to load all lazy content
        await page.evaluate(async () => {
          await new Promise<void>((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                resolve();
              }
            }, 50);
          });
        });

        // Wait for images to load
        await page.waitForTimeout(1000);

        const filename = `${pageConfig.name}-${viewport.name}.png`;
        await page.screenshot({
          path: path.join(outputDir, filename),
          fullPage: true,
        });

        console.log(`Captured: ${filename}`);
      } catch (error) {
        console.error(`Error capturing ${pageConfig.name} at ${viewport.name}:`, error);
      }
    }

    await context.close();
  }

  await browser.close();
  console.log('Screenshot capture complete!');
}

captureScreenshots().catch(console.error);
