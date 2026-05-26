import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const vp of VIEWPORTS) {
  test.describe(`[${vp.name} ${vp.width}x${vp.height}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    // Test 1 — Sin scroll horizontal
    test('no horizontal scroll', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });

    // Test 2 — Hero H1 visible sin scroll en mobile
    test('hero H1 visible above the fold', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const h1Visible = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return false;
        const rect = h1.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      });

      expect(h1Visible).toBe(true);
    });

    // Test 3 — About H2 fits container (>= 95% de ancho)
    test('about section H2 fits container', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const fits = await page.evaluate(() => {
        const section = document.getElementById('about');
        if (!section) return false;
        const h2 = section.querySelector('h2');
        if (!h2) return false;
        const container = h2.closest('[class*="max-w"]') as HTMLElement | null;
        if (!container) {
          // fallback: compare to section width
          return h2.clientWidth <= section.clientWidth;
        }
        return h2.clientWidth <= container.clientWidth;
      });

      expect(fits).toBe(true);
    });

    // Test 4 — ChatWidget panel height <= 80% viewport
    test('chat panel fits vertically (<= 80dvh)', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Open the chat widget
      await page.click('#ff-chat-btn');
      await page.waitForTimeout(300);

      const panelFits = await page.evaluate(() => {
        const panel = document.getElementById('ff-chat-panel');
        if (!panel) return false;
        const rect = panel.getBoundingClientRect();
        return rect.height <= window.innerHeight * 0.80;
      });

      expect(panelFits).toBe(true);
    });

    // Test 5 — Animaciones Anime.js: data-fade-up tiene opacity 1 tras 1500ms
    test('data-fade-up elements have opacity 1 after 1500ms', async ({ page }) => {
      await page.goto('/');
      // Wait enough for IntersectionObserver + Anime.js to run
      await page.waitForTimeout(1500);

      const allVisible = await page.evaluate(() => {
        const elements = Array.from(
          document.querySelectorAll('[data-fade-up]')
        ) as HTMLElement[];

        // Only check elements in the initial viewport
        const inViewport = elements.filter((el) => {
          const rect = el.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });

        if (inViewport.length === 0) return true; // nothing to check

        return inViewport.every((el) => {
          const style = window.getComputedStyle(el);
          return parseFloat(style.opacity) >= 0.99;
        });
      });

      expect(allVisible).toBe(true);
    });
  });
}
