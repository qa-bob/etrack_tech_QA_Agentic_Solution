---
paths:
  - "tests/**/*.spec.ts"
  - "tests/**/*.test.ts"
---

# Test Writing Rules

These rules apply whenever you are reading or writing files in the `tests/` directory.

## Imports

Always import from the custom fixture, not directly from `@playwright/test`:

```typescript
// Correct
import { test, expect } from '@fixtures/site.fixture';

// Wrong
import { test, expect } from '@playwright/test';
```

## Tagging

Every test must carry at least one tag in its title string. Tags are how the npm scripts filter test suites:

| Tag | npm script |
|-----|-----------|
| `@smoke` | `npm run test:smoke` |
| `@navigation` | `npm run test:navigation` |
| `@forms` | `npm run test:forms` |
| `@visual` | `npm run test:visual` |
| `@responsive` | `npm run test:responsive` |
| `@functional` | (run via `npm test`) |
| `@custom` | (run via `npm test`) |

```typescript
// Correct — tag is in the test title
test('homepage loads successfully @smoke', async ({ homePage }) => { ... });

// Wrong — no tag
test('homepage loads', async ({ homePage }) => { ... });
```

## Selectors

Never use raw `page.locator()` in test bodies. Always go through a page object:

```typescript
// Correct
test('hero heading is visible @functional', async ({ homePage }) => {
  const heading = await homePage.getMainHeading();
  expect(heading).toBeTruthy();
});

// Wrong — selector leaks into the test
test('hero heading is visible @functional', async ({ page }) => {
  await expect(page.locator('h1')).toBeVisible();
});
```

## Waiting

Never use `page.waitForTimeout()` with values over 500ms. Use Playwright auto-waiting:

```typescript
// Correct
await page.waitForLoadState('networkidle');
await expect(locator).toBeVisible();

// Wrong
await page.waitForTimeout(3000);
```

## Forms

Never submit forms in any test — this avoids spamming real company inboxes:

```typescript
// Correct — interact but don't submit
await contactPage.fillForm({ email: 'test@example.com', name: 'Test' });
expect(await contactPage.hasSubmitButton()).toBeTruthy();

// Wrong — never do this
await form.locator('button[type="submit"]').click();
await page.waitForNavigation();
```

## Test Independence

Each test must be fully independent — `beforeEach` navigation is the only shared state allowed. Never write tests that depend on the execution order of other tests.
