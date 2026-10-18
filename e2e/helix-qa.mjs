import { chromium } from '@playwright/test';
import fs from 'fs';

const VIEWPORTS = [
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'laptop-1280x800', width: 1280, height: 800 },
  { name: 'tablet-768x1024', width: 768, height: 1024 },
  { name: 'mobile-390x844', width: 390, height: 844 },
  { name: 'narrow-320x700', width: 320, height: 700 },
];

const results = [];
const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => failed.push(r.url() + ' :: ' + (r.failure()?.errorText ?? '?')));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const canvas = page.locator('canvas');
  await canvas.waitFor({ state: 'visible', timeout: 15000 });
  const box = await canvas.boundingBox();

  // Scroll to the helix track and sample progress at several points
  const trackInfo = await page.evaluate(() => {
    const el = document.querySelector('.helix-track');
    return el ? { top: el.offsetTop, height: el.offsetHeight } : null;
  });

  const shots = {};
  if (trackInfo) {
    const travel = trackInfo.height - vp.height;
    for (const [label, frac] of [['entry', 0.02], ['titles', 0.30], ['grid', 0.80], ['end', 0.995]]) {
      await page.evaluate((y) => window.scrollTo(0, y), trackInfo.top + travel * frac);
      await page.waitForTimeout(1400); // allow smoothing to settle
      const path = `test-results/qa-${vp.name}-${label}.png`;
      await page.screenshot({ path });
      shots[label] = path;
    }
    // reverse scroll check: jump back to titles and forward again
    await page.evaluate((y) => window.scrollTo(0, y), trackInfo.top + travel * 0.30);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `test-results/qa-${vp.name}-reverse.png` });
    shots.reverse = `test-results/qa-${vp.name}-reverse.png`;
  }

  // Resize during animation
  await page.evaluate((y) => window.scrollTo(0, y), (trackInfo?.top ?? 0) + (trackInfo?.height ?? 0) * 0.5);
  await page.waitForTimeout(600);
  await page.setViewportSize({ width: Math.max(320, Math.floor(vp.width * 0.8)), height: vp.height });
  await page.waitForTimeout(900);
  const boxAfterResize = await canvas.boundingBox();
  await page.screenshot({ path: `test-results/qa-${vp.name}-resized.png` });

  results.push({ viewport: vp.name, canvasBox: box, boxAfterResize, track: trackInfo, errors, failed, shots });
  await ctx.close();
}
await browser.close();
fs.writeFileSync('e2e/qa-results.json', JSON.stringify(results, null, 2));


