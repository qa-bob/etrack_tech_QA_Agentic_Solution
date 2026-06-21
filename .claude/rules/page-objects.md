---
paths:
  - "src/pages/**/*.ts"
  - "src/fixtures/**/*.ts"
---

# Page Object Rules

These rules apply whenever you are reading or writing files in `src/pages/` or `src/fixtures/`.

## Class Structure

Every page class must extend `BasePage`:

```typescript
import { BasePage } from '@pages/base.page';

export class FooPage extends BasePage {
  // readonly Locator properties first
  readonly heroSection: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.heroSection = page.locator('[data-testid="hero"], section:first-of-type, header');
  }

  // Methods represent user actions
  async clickPrimaryCtA(): Promise<void> {
    await this.heroSection.getByRole('link', { name: /get started|learn more/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

## Locator Rules

- Locators are `readonly Locator` **properties** — not methods and not local variables
- Prefer ARIA roles (`getByRole`) and semantic attributes (`data-testid`) over CSS class names
- Use `.first()` when a selector may match multiple elements — never assume uniqueness
- Chained locators are allowed: `this.nav.locator('a[href]')`

## No Assertions in Page Objects

Page objects are action libraries. They must never contain `expect()`:

```typescript
// Wrong — assertion inside page object
async isLoaded(): Promise<void> {
  await expect(this.page.locator('h1')).toBeVisible();
}

// Correct — return a value the test can assert on
async isLoaded(): Promise<boolean> {
  return (await this.page.locator('h1').count()) > 0;
}
```

## Return Types

Methods that return element data must be typed. Never use `any`:

```typescript
// Correct
async getNavLinks(): Promise<NavLinkInfo[]> { ... }
async getMainHeading(): Promise<string> { ... }
async isVisible(): Promise<boolean> { ... }
async getCTAButtons(): Promise<Locator[]> { ... }
```

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Page class | `PascalCase` + `Page` suffix | `ServicesPage` |
| File name | `kebab-case.page.ts` | `services.page.ts` |
| Locator props | `camelCase` noun | `heroSection`, `navMenu` |
| Action methods | `camelCase` verb phrase | `clickPrimaryCta()`, `openMobileMenu()` |
| Query methods | `get` or `is`/`has` prefix | `getNavLinks()`, `hasEmailField()` |

## Adding a New Page Object

1. Create `src/pages/<kebab-name>.page.ts`
2. Export the class as a named export
3. Import and register it in `src/fixtures/site.fixture.ts`
4. Use `@pages/<name>.page` path alias in all imports
