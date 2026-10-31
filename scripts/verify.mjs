import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.DEMO_BASE_URL || 'http://127.0.0.1:8000/';
const errors = [];
await mkdir('test-results', { recursive: true });
try {
  for (const width of [375, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const path of ['', 'demos/cafe/', 'demos/corporate/', 'demos/portfolio/']) {
      const response = await page.goto(new URL(path, base).href);
      assert.equal(response.status(), 200);
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Horizontal overflow: ${path} at ${width}`);
      const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
      assert.deepEqual(brokenAnchors, []);
      if (path) {
        if (width < 761) {
          const menu = page.locator('[data-menu]');
          await menu.click();
          await assert.equal(await menu.getAttribute('aria-expanded'), 'true');
          await page.keyboard.press('Escape');
          assert.equal(await menu.getAttribute('aria-expanded'), 'false');
          await menu.click();
          await page.locator('nav a').first().click();
          assert.equal(await menu.getAttribute('aria-expanded'), 'false');
          assert.ok(!(await page.locator('nav').evaluate(el => el.classList.contains('open'))));
        }
        await page.locator('.demo-toolbar a').getAttribute('href').then(href => assert.equal(href, '../../'));
      }
      for (const button of await page.locator('[data-project]').all()) {
        const title = await button.getAttribute('data-project');
        await button.click();
        assert.equal(await page.locator('dialog h2').textContent(), title);
        assert.ok(await page.locator('dialog').evaluate(el => el.open));
        await page.keyboard.press('Escape');
        assert.ok(!(await page.locator('dialog').evaluate(el => el.open)));
      }
      if (path.includes('corporate')) {
        await page.locator('#inquiry-name').fill('Demo visitor');
        await page.locator('#inquiry-email').fill('invalid');
        await page.locator('#inquiry-project').fill('A responsive business website.');
        await page.locator('button[type="submit"]').click();
        assert.equal((await page.locator('[data-status]').textContent()).trim(), '');
        await page.locator('#inquiry-email').fill('visitor@example.com');
        let transmitted = false;
        const onRequest = req => { if (req.method() === 'POST') transmitted = true; };
        page.on('request', onRequest);
        await page.locator('button[type="submit"]').click();
        assert.match(await page.locator('[data-status]').textContent(), /No message was sent/);
        assert.equal(transmitted, false);
        page.off('request', onRequest);
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `test-results/${path.split('/')[1] || 'collection'}-${width}.png`, fullPage: true });
      console.log(`PASS ${width}px /${path}`);
    }
    await page.close();
  }
  assert.deepEqual(errors, [], 'No browser errors or missing assets');
  console.log('All 12 responsive page checks passed; navigation, dialogs, form validation, and screenshots verified.');
} finally { await browser.close(); }
