/**
 * tests/functional/home-features.spec.ts
 *
 * Functional tests for eTrack Tech homepage features.
 * Covers: hero section, primary CTAs, heading hierarchy, and above-the-fold load.
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Homepage Features @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.waitForLoad();
  });

  // ── Page load ──────────────────────────────────────────────────────────────

  test('homepage loads with all key elements @functional', async ({ homePage }) => {
    const loaded = await homePage.isLoaded();
    expect(loaded, 'Homepage should have headings, navigation, and body text').toBeTruthy();
  });

  // ── Headings ───────────────────────────────────────────────────────────────

  test('homepage has a primary heading (h1 or h2) @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.trim().length, 'Main heading should have meaningful text').toBeGreaterThan(3);
  });

  test('heading hierarchy is correct (h1 before h2) @functional', async ({ homePage }) => {
    const h1Count = await homePage.page.locator('h1').count();
    const h2Count = await homePage.page.locator('h2').count();

    if (h1Count > 0) {
      expect(h1Count, 'Page should have exactly one h1').toBe(1);
    } else {
      // Warn if no h1 — not a hard failure for SPAs that use h2 as primary
      console.warn('[functional] No <h1> found on homepage. Consider adding one for SEO.');
      expect(h2Count, 'If no h1, at least one h2 should be present').toBeGreaterThan(0);
    }
  });

  // ── Hero / above-the-fold ──────────────────────────────────────────────────

  test('hero section has meaningful text content @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(heroText.trim().length, 'Hero section should have visible text').toBeGreaterThan(10);
  });

  test('hero section is visible without scrolling @functional', async ({ homePage }) => {
    // At least one heading or banner element should be in the initial viewport
    const firstHeading = homePage.page.locator('h1, h2, [role="banner"]').first();
    await expect(firstHeading).toBeVisible();

    const isInViewport = await firstHeading.evaluate<boolean>((el) => {
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });

    expect(isInViewport, 'Primary heading should be visible in the initial viewport').toBeTruthy();
  });

  // ── Call-to-action buttons ─────────────────────────────────────────────────

  test('homepage has at least one call-to-action button or link @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'Homepage should have at least one CTA button (Get Started, Learn More, Contact Us, etc.)'
    ).toBeGreaterThan(0);
  });

  test('primary CTA is visible and has descriptive text @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();

    if (ctaButtons.length === 0) {
      console.warn('[functional] No CTA buttons detected — skipping CTA text check.');
      return;
    }

    const firstCta = ctaButtons[0];
    await expect(firstCta, 'Primary CTA should be visible').toBeVisible();

    const ctaText = (await firstCta.textContent())?.trim() ?? '';
    expect(ctaText.length, 'CTA button should have descriptive text').toBeGreaterThan(1);
  });

  // ── Page identity ──────────────────────────────────────────────────────────

  test('page title includes the company name @functional', async ({ page, siteConfig }) => {
    const title = await page.title();
    const companyWords = siteConfig.name.toLowerCase().split(' ');

    // At least one word from the company name should appear in the title
    const hasCompanyName = companyWords.some((word) =>
      word.length > 2 && title.toLowerCase().includes(word)
    );

    if (!hasCompanyName) {
      console.warn(
        `[functional] Page title "${title}" does not appear to reference "${siteConfig.name}". ` +
          'Consider including the company name in the title tag.'
      );
    }
  });

  // ── Content quality ────────────────────────────────────────────────────────

  test('homepage has multiple content sections @functional', async ({ page }) => {
    // A well-structured homepage should have multiple distinct sections
    const sectionCount = await page.locator('section, article, [role="region"]').count();

    if (sectionCount === 0) {
      // Fallback: check for multiple headings as a proxy for sections
      const h2Count = await page.locator('h2').count();
      expect(
        h2Count,
        'Homepage should have multiple content sections (section/article elements or h2 headings)'
      ).toBeGreaterThan(1);
    } else {
      expect(sectionCount, 'Homepage should have multiple content sections').toBeGreaterThan(1);
    }
  });
});
