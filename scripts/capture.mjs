import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';
const base = process.env.OBSERVATORY_URL ?? 'http://127.0.0.1:4173/golden-gate/';
const browser = await chromium.launch({
  headless: true,
  args: process.platform === 'darwin' ? ['--use-angle=metal', '--enable-gpu'] : [],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage(),
  errors = [],
  missing = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('response', (r) => {
  if (r.status() >= 400) missing.push(r.url());
});
await mkdir('docs/artifacts', { recursive: true });
await page.goto(base + '?diagnostics=1');
await page.waitForFunction(
  () => window.__observatory && !window.__observatory().cameraFlying,
  undefined,
  {
    timeout: 40000,
  },
);
await page.waitForTimeout(1500);
const gpu = await page.locator('canvas').evaluate((c) => {
  const g = c.getContext('webgl2'),
    d = g.getExtension('WEBGL_debug_renderer_info');
  return {
    renderer: g.getParameter(d.UNMASKED_RENDERER_WEBGL),
    vendor: g.getParameter(d.UNMASKED_VENDOR_WEBGL),
  };
});
async function view(name) {
  await page
    .getByRole('button', {
      name: /Hero|Bay Panorama|North Overlook|South Shore|Waterline|Tower Detail|Free Orbit/,
    })
    .first()
    .click();
  await page.getByRole('button', { name: new RegExp(`^0[1-7] ${name}`) }).click();
  await page.waitForFunction(() => !window.__observatory().cameraFlying);
  await page.waitForTimeout(500);
}
async function shot(name) {
  await page.screenshot({ path: `docs/artifacts/${name}.png` });
  console.log('Captured', name);
}
const performance = [];
async function measure(mode) {
  const start = await page.evaluate(() => window.__observatory().metrics.frames);
  await page.waitForFunction((n) => window.__observatory().metrics.frames >= n + 90, start, {
    timeout: 50000,
  });
  const data = await page.evaluate(() => window.__observatory().metrics);
  const samples = data.samples.slice(-90).sort((a, b) => a - b);
  performance.push({
    mode,
    frames: samples.length,
    medianMs: samples[Math.floor(samples.length * 0.5)],
    p95Ms: samples[Math.floor(samples.length * 0.95)],
    mainDrawCalls: data.drawCalls,
    mainTriangles: data.triangles,
  });
  console.log('Measured', mode, performance.at(-1));
}
await shot('hero-golden');
await measure('Hero / Golden Hour / Balanced');
await page.getByRole('button', { name: 'Clear Day', exact: true }).click();
await page.waitForTimeout(2200);
await shot('hero-clear');
await page.getByRole('button', { name: 'Coastal Fog', exact: true }).click();
await page.waitForTimeout(2200);
await shot('hero-fog');
await measure('Hero / Coastal Fog / Balanced');
await page.getByRole('button', { name: 'Clear Day', exact: true }).click();
await page.waitForTimeout(1800);
await view('Bay Panorama');
await shot('panorama');
await measure('Panorama / Clear Day / Balanced');
await view('Waterline');
await shot('waterline');
await measure('Waterline / Clear Day / Balanced');
await view('Tower Detail');
await shot('tower-detail');
await measure('Tower Detail / Clear Day / Balanced');
await view('North Overlook');
await shot('north-overlook');
await view('South Shore');
await shot('south-shore');
await page.getByRole('button', { name: 'Scene settings' }).click();
await page.locator('#render-quality').selectOption('high');
await page.getByRole('button', { name: 'Close panel' }).click();
await view('Waterline');
await measure('Waterline / Clear Day / High');
await page.getByRole('button', { name: 'Scene settings' }).click();
await page.locator('#render-quality').selectOption('balanced');
await page.getByRole('button', { name: 'Close panel' }).click();
await view('Hero');
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(200);
await page.waitForFunction(() => !window.__observatory().cameraFlying);
await page.waitForTimeout(500);
await shot('mobile');
await page.getByRole('button', { name: 'Scene settings' }).click();
await shot('mobile-settings');
await page.getByRole('button', { name: 'Close panel' }).click();
await page.setViewportSize({ width: 1280, height: 500 });
await page.waitForTimeout(200);
await page.waitForFunction(() => !window.__observatory().cameraFlying);
await page.waitForTimeout(500);
await shot('short-window');
await writeFile(
  'docs/artifacts/performance.json',
  JSON.stringify(
    {
      date: new Date().toISOString(),
      viewport: [1440, 1000],
      dpr: 1,
      gpu,
      performance,
      errors,
      missing,
    },
    null,
    2,
  ),
);
await context.close();
const videoContext = await browser.newContext({
    viewport: { width: 1100, height: 740 },
    recordVideo: { dir: 'docs/artifacts/video', size: { width: 1100, height: 740 } },
  }),
  videoPage = await videoContext.newPage();
await videoPage.goto(base + '?diagnostics=1');
await videoPage.waitForFunction(() => window.__observatory && !window.__observatory().cameraFlying);
await videoPage.waitForTimeout(3500);
await videoPage.getByRole('button', { name: /Hero/ }).click();
await videoPage.getByRole('button', { name: /^05 Waterline/ }).click();
await videoPage.waitForTimeout(7500);
await videoPage.getByRole('button', { name: 'Coastal Fog', exact: true }).click();
await videoPage.waitForTimeout(4000);
await videoPage.getByRole('button', { name: 'Pause animation' }).click();
await videoPage.waitForTimeout(1000);
await videoPage.getByRole('button', { name: 'Play animation' }).click();
await videoPage.waitForTimeout(2000);
await videoPage.getByRole('button', { name: /Waterline/ }).click();
await videoPage.getByRole('button', { name: /^06 Tower Detail/ }).click();
await videoPage.waitForTimeout(5500);
const video = videoPage.video();
await videoContext.close();
if (video) await video.saveAs('docs/artifacts/observatory-motion.webm');
console.log(JSON.stringify({ gpu, errors, missing, performance }, null, 2));
await browser.close();
