import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.resolve(rootDir, "..", "docs");

function formatStamp(date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${min}`;
}

async function main() {
  const now = new Date();
  const stamp = formatStamp(now);
  const baseUrl = process.env.UXUI_BASE_URL || "http://127.0.0.1:4174";
  const routes = (process.env.UXUI_ROUTES || "/login,/design-system")
    .split(",")
    .map((route) => route.trim())
    .filter(Boolean);

  const outputDir = path.join(docsDir, "uxui-reviews", stamp);
  await mkdir(outputDir, { recursive: true });

  const targets = [
    { name: "desktop", viewport: { width: 1440, height: 1024 } },
    { name: "mobile", viewport: { width: 390, height: 844 } },
  ];

  const browser = await chromium.launch({ headless: true });
  const records = [];

  try {
    for (const target of targets) {
      const context = await browser.newContext({ viewport: target.viewport });
      const page = await context.newPage();

      for (const route of routes) {
        const normalized = route.startsWith("/") ? route : `/${route}`;
        const url = `${baseUrl}${normalized}`;
        const routeName = normalized.slice(1).replace(/\//g, "-") || "root";
        const fileName = `${routeName}-${target.name}.png`;
        const filePath = path.join(outputDir, fileName);

        await page.goto(url, { waitUntil: "networkidle" });
        await page.screenshot({ path: filePath, fullPage: true });

        records.push({
          route: normalized,
          viewport: target.name,
          fileName,
        });

        console.log(`captured ${normalized} (${target.name}) -> ${filePath}`);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  const summaryPath = path.join(outputDir, "review-summary.md");
  const summaryLines = [
    "# UXUI Review Summary",
    "",
    `- Generated at: ${now.toISOString()}`,
    `- Base URL: ${baseUrl}`,
    "",
    "## Captures",
    ...records.map(
      (item) =>
        `- \`${item.route}\` (\`${item.viewport}\`): [${item.fileName}](./${item.fileName})`
    ),
    "",
  ];

  await writeFile(summaryPath, summaryLines.join("\n"), "utf8");
  console.log(`summary written to ${summaryPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
