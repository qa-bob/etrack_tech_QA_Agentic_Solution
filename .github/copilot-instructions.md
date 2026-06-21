# GitHub Copilot Custom Instructions

This file configures GitHub Copilot for this repository. These instructions align with the Claude Code `CLAUDE.md` so all AI tools follow the same conventions.

---

## Project Context

This is a **Playwright + TypeScript** regression test suite for [eTrack Tech](http://etracktech.com), an IoT predictive maintenance platform. Tests cover the public-facing website without requiring account creation or form submission.

---

## Architecture: Page Object Model (POM)

- Every page or section has a class in `src/pages/` that extends `BasePage`
- Page classes declare `readonly Locator` properties; methods represent user actions
- Never include `expect()` in page objects — assertions belong in test files only
- Test files import `{ test, expect }` from `@fixtures/site.fixture`, not from `@playwright/test`

---

## When Generating Test Code

1. **Selectors:** Prefer ARIA roles (`getByRole`), `data-testid`, and semantic HTML over CSS class names
2. **Tags:** Every `test()` must include a tag in its title: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, or `@responsive`
3. **Waiting:** Use `waitForLoadState`, `waitForSelector`, or Playwright auto-waiting — never `waitForTimeout()`
4. **URLs:** Never hardcode URLs — always use `siteConfig.url` from the fixture
5. **Forms:** Fill fields and check validation only — never submit

## When Generating Page Object Code

1. Extend `BasePage` from `@pages/base.page`
2. Declare element locators as `readonly Locator` properties in the constructor
3. Methods should return data or perform actions — never assert
4. Use TypeScript strict mode — no implicit `any`
5. Name files `<kebab-name>.page.ts` and classes `<PascalName>Page`

---

## TypeScript Path Aliases

| Alias | Points to |
|-------|-----------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@site-types/*` | `src/types/*` |

---

## Never Do

- Submit forms
- Create accounts or attempt login
- Use `page.waitForTimeout()` > 500ms
- Put `expect()` inside page objects
- Use `page.locator()` directly in spec files
- Use `any` type without an explanatory comment
- Hardcode `http://etracktech.com` in test code
