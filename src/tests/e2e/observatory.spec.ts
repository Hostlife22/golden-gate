import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function open(page: Page) {
  await page.goto('?diagnostics=1');
  await expect(page.locator('canvas')).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean(window.__observatory))).toBe(true);
  await expect.poll(() => page.evaluate(() => window.__observatory?.().cameraFlying)).toBe(false);
}

async function view(page: Page, name: string) {
  await page
    .getByRole('button', {
      name: /Hero|Bay Panorama|North Overlook|South Shore|Waterline|Tower Detail|Free Orbit/,
    })
    .first()
    .click();
  await page.getByRole('button', { name: new RegExp(`^0[1-7] ${name}`) }).click();
}

test('production scene, all camera presets, pause, orbit, hotkeys, settings and weather interruptions', async ({
  page,
}) => {
  const errors: string[] = [],
    missing: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('response', (r) => {
    if (r.status() >= 400) missing.push(r.url());
  });
  await open(page);
  for (const name of [
    'Bay Panorama',
    'North Overlook',
    'South Shore',
    'Waterline',
    'Tower Detail',
  ]) {
    await view(page, name);
    await expect.poll(() => page.evaluate(() => window.__observatory?.().cameraFlying)).toBe(false);
    const camera = await page.evaluate(() => window.__observatory?.().camera);
    expect(camera?.every(Number.isFinite)).toBe(true);
    expect(camera?.[1]).toBeGreaterThan(0.8);
  }
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await expect.poll(() => page.evaluate(() => window.__observatory?.().paused)).toBe(true);
  const before = await page.evaluate(() => window.__observatory?.());
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => window.__observatory?.());
  expect(after?.time).toBe(before?.time);
  expect(after?.activityTime).toBe(before?.activityTime);
  const canvas = page.locator('canvas');
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error('No scene');
  const x = bounds.x + bounds.width * 0.55,
    y = bounds.y + bounds.height * 0.5;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 95, y + 15, { steps: 4 });
  await page.mouse.up();
  await expect
    .poll(() => page.evaluate(() => window.__observatory?.().camera))
    .not.toEqual(before?.camera);
  await page.getByRole('button', { name: 'Clear Day', exact: true }).click();
  await page.getByRole('button', { name: 'Coastal Fog', exact: true }).click();
  await page.getByRole('button', { name: 'Golden Hour', exact: true }).click();
  await page.getByRole('button', { name: 'Coastal Fog', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => window.__observatory?.().weather.lowFog))
    .toBeGreaterThan(0.8);
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('#fog-density').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#fog-density')).toHaveValue('0.25');
  await page.locator('#motion-intensity').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#motion-intensity')).toHaveValue('0.1');
  await page.getByRole('button', { name: 'Close panel' }).click();
  await canvas.focus();
  await page.keyboard.press('Space');
  await expect.poll(() => page.evaluate(() => window.__observatory?.().paused)).toBe(false);
  await page.keyboard.press('r');
  await expect.poll(() => page.evaluate(() => window.__observatory?.().cameraFlying)).toBe(true);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 35, y, { steps: 2 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.__observatory?.().cameraFlying)).toBe(false);
  await canvas.focus();
  await page.keyboard.press('h');
  await expect(page.getByRole('button', { name: 'Show controls' })).toBeVisible();
  await page.keyboard.press('h');
  await expect(page.getByRole('button', { name: 'Scene settings' })).toBeVisible();
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
});

test('mobile panels and short desktop keep controls in the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  for (const label of ['Pause animation', 'Scene settings', 'Reset view']) {
    const b = await page.getByRole('button', { name: label }).boundingBox();
    expect(b?.x).toBeGreaterThanOrEqual(0);
    expect((b?.y ?? 0) + (b?.height ?? 0)).toBeLessThanOrEqual(844);
    expect(b?.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: 'Scene settings' }).click();
  await expect(page.locator('#render-quality')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.setViewportSize({ width: 1280, height: 500 });
  await expect(page.getByRole('button', { name: 'Pause animation' })).toBeInViewport();
  await expect(page.getByRole('button', { name: 'Reset view' })).toBeInViewport();
});

test('reduced motion begins paused and camera still works', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
  await view(page, 'Tower Detail');
  await expect.poll(() => page.evaluate(() => window.__observatory?.().cameraFlying)).toBe(false);
  expect(await page.evaluate(() => window.__observatory?.().time)).toBe(0);
});

test('WebGL fallback explains recovery without missing resources', async ({ page }) => {
  await page.goto('?forceFallback=1');
  await expect(page.getByText('This 3D view requires WebGL 2.', { exact: false })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('hidden-tab visibility event freezes the shared clock and resumes without a jump', async ({
  page,
}) => {
  await open(page);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const time = await page.evaluate(() => window.__observatory?.().time);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__observatory?.().time)).toBe(time);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect
    .poll(() => page.evaluate(() => window.__observatory?.().time))
    .toBeGreaterThan(time ?? 0);
});

test('lost WebGL context offers recovery', async ({ page }) => {
  await open(page);
  await page.locator('canvas').evaluate((c) => {
    if (c instanceof HTMLCanvasElement)
      c.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('extracted dialogs trap and restore focus and retain render quality across reopening', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await open(page);
  const settings = page.getByRole('button', { name: 'Scene settings' });
  const close = page.getByRole('button', { name: 'Close panel' });
  await settings.click();
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByLabel('Render quality')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.getByLabel('Render quality').selectOption('high');
  await page.keyboard.press('Escape');
  await expect(settings).toBeFocused();
  await settings.click();
  await expect(page.getByLabel('Render quality')).toHaveValue('high');
  await page.locator('.panel-backdrop').click({ position: { x: 8, y: 8 } });
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(settings).toBeFocused();

  const about = page.getByRole('button', { name: 'About this place' });
  await about.click();
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'Source & study' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(about).toBeFocused();
  expect(errors).toEqual([]);
});
