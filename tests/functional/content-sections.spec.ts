/**
 * tests/functional/content-sections.spec.ts
 *
 * Functional tests for eTrack Tech site content sections.
 * Covers: footer, external links, social links, page-level features
 * consistent with a B2B IoT SaaS site (about, services, features areas).
 *
 * Tag: @functional
 */

import { test, expect } from '@fixtures/site.fixture';

test.describe('Content Sections @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('load');
  });

  // ── Footer ─────────────────────────────────────────────────────────────────

  test('footer is present on homepage @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]');
    const count = await footer.count();
    expect(count, 'Page should have a <footer> or role="contentinfo" element').toBeGreaterThan(0);
    await expect(footer.first()).toBeVisible();
  });

  test('footer contains at least one link @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() === 0) {
      test.skip(true, 'No footer found — covered by footer presence test');
      return;
    }

    const footerLinks = footer.locator('a[href]');
    const linkCount = await footerLinks.count();
    expect(linkCount, 'Footer should contain at least one link').toBeGreaterThan(0);
  });

  // ── Images ─────────────────────────────────────────────────────────────────

  test('hero/above-fold images load without error @functional', async ({ page, siteConfig }) => {
    // Collect all image load failures
    const failedImages: string[] = [];
    page.on('response', (response) => {
      if (
        response.request().resourceType() === 'image' &&
        response.status() >= 400
      ) {
        failedImages.push(`${response.url()} (HTTP ${response.status()})`);
      }
    });

    await page.goto(siteConfig.url, { waitUntil: 'load' });

    expect(
      failedImages,
      `These images failed to load:\n${failedImages.join('\n')}`
    ).toHaveLength(0);
  });

  // ── Key content phrases ────────────────────────────────────────────────────

  test('page body has visible paragraph text @functional', async ({ page }) => {
    const paragraphs = page.locator('p');
    const count = await paragraphs.count();

    expect(count, 'Page should have paragraph text').toBeGreaterThan(0);

    // At least one paragraph should have meaningful content
    let hasContent = false;
    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = (await paragraphs.nth(i).textContent())?.trim() ?? '';
      if (text.length > 20) {
        hasContent = true;
        break;
      }
    }

    expect(hasContent, 'At least one paragraph should have substantive text (> 20 chars)').toBeTruthy();
  });

  // ── Navigation anchors / in-page links ─────────────────────────────────────

  test('internal anchor links resolve correctly @functional', async ({ page }) => {
    const anchorLinks = page.locator('a[href^="#"]');
    const count = await anchorLinks.count();

    // Not all sites use anchor links
    test.skip(count === 0, 'No in-page anchor links found');

    // Check that at least the first anchor's target element exists
    const firstHref = await anchorLinks.first().getAttribute('href');
    if (!firstHref || firstHref === '#') {
      test.skip(true, 'First anchor link has no target id');
      return;
    }

    const targetId = firstHref.replace('#', '');
    const target = page.locator(`#${CSS.escape(targetId)}`);

    expect(
      await target.count(),
      `Anchor link "${firstHref}" points to an element that does not exist on the page`
    ).toBeGreaterThan(0);
  });

  // ── Favicon ───────────────────────────────────────────────────────────────

  test('site has a favicon @functional', async ({ page, siteConfig }) => {
    const faviconLink = page.locator(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
    ).first();

    test.skip(await faviconLink.count() === 0, 'No <link rel="icon"> found');

    const href = await faviconLink.getAttribute('href');
    expect(href).toBeTruthy();

    // Verify favicon is reachable
    if (href) {
      const faviconUrl = new URL(href, siteConfig.url).toString();
      const response = await page.request.head(faviconUrl, { timeout: 5_000 }).catch(() => null);
      if (response) {
        expect(
          response.status(),
          `Favicon at ${faviconUrl} returned HTTP ${response.status()}`
        ).toBeLessThan(400);
      }
    }
  });

  // ── Open Graph meta tags ───────────────────────────────────────────────────

  test('page has Open Graph meta tags for social sharing @functional', async ({ page }) => {
    const ogTitleTag = page.locator('meta[property="og:title"]').first();
    const ogTitle = (await ogTitleTag.count()) > 0 ? await ogTitleTag.getAttribute('content') : null;
    const ogDescriptionTag = page.locator('meta[property="og:description"]').first();
    const ogDescription = (await ogDescriptionTag.count()) > 0 ? await ogDescriptionTag.getAttribute('content') : null;

    if (!ogTitle && !ogDescription) {
      console.warn(
        '[functional] No Open Graph meta tags found (og:title, og:description). ' +
          'These improve how the page appears when shared on LinkedIn, Slack, etc.'
      );
    }

    // Not a hard failure — OG tags are best practice, not a requirement
  });

  // ── External links ─────────────────────────────────────────────────────────

  test('external links open in a new tab @functional', async ({ page, siteConfig }) => {
    const siteOrigin = new URL(siteConfig.url).origin;
    const externalLinks = page.locator(`a[href]:not([href^="${siteOrigin}"]):not([href^="#"]):not([href^="/"]):not([href^="javascript"])`);
    const count = await externalLinks.count();

    test.skip(count === 0, 'No external links found');

    const missingTarget: string[] = [];
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = externalLinks.nth(i);
      const target = await link.getAttribute('target');
      const href = await link.getAttribute('href') ?? '';

      if (!href.startsWith('mailto:') && !href.startsWith('tel:') && target !== '_blank') {
        missingTarget.push(href);
      }
    }

    if (missingTarget.length > 0) {
      console.warn(
        `[functional] ${missingTarget.length} external link(s) do not have target="_blank":\n` +
          missingTarget.slice(0, 5).map((h) => `  ${h}`).join('\n')
      );
    }
  });
});
