import { chromium } from "playwright";
import * as path from "path";

const pages = [
  { name: "homepage", path: "/" },
  { name: "about", path: "/about" },
  { name: "private-events", path: "/private-events" },
  { name: "menu", path: "/menu" },
  { name: "programming", path: "/programming" },
  { name: "contact", path: "/contact" },
  { name: "faq", path: "/faq" },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

async function takeScreenshots() {
  const browser = await chromium.launch();
  const baseUrl = "http://localhost:3000";
  const screenshotDir = path.join(__dirname, "screenshots");

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();

    for (const pageConfig of pages) {
      try {
        await page.goto(`${baseUrl}${pageConfig.path}`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });

        // Wait for fonts and images to load
        await page.waitForTimeout(2000);

        // Full page screenshot
        await page.screenshot({
          path: path.join(
            screenshotDir,
            `${pageConfig.name}-${viewport.name}.png`
          ),
          fullPage: true,
        });

        console.log(
          `✓ ${pageConfig.name} (${viewport.name}) screenshot captured`
        );
      } catch (error) {
        console.error(
          `✗ Failed to capture ${pageConfig.name} (${viewport.name}):`,
          error
        );
      }
    }

    await context.close();
  }

  await browser.close();
  console.log("\n✓ All screenshots completed!");
}

takeScreenshots().catch(console.error);
