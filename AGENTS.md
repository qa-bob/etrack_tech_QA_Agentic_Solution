# AGENTS.md — AI Agent Instructions

This file is read by AI coding assistants (GitHub Copilot Agent, Codex, Cursor, etc.) to understand how to work in this repository. Claude Code users should also read `CLAUDE.md`, which imports this file and adds Claude-specific instructions.

---

## Repository Purpose

This is a **Playwright + TypeScript regression test suite** for [eTrack Tech](http://etracktech.com), an IoT predictive maintenance platform for industrial facilities. The test suite exercises every discoverable feature of the site **without** requiring account creation or form submission.

Site configuration lives in `site.config.json`. All tests read their target URL and flags from that file — never hardcode URLs.

---

## Architecture

This repo uses **Page Object Model (POM)** with **Object-Oriented Programming (OOP)**.

```
src/pages/<name>.page.ts     One class per page or major section
src/fixtures/site.fixture.ts Custom Playwright fixtures exposing page objects
src/utils/                   Shared helpers (link-checker, visual-helper)
src/types/site-config.types.ts  SiteConfig TypeScript interface
tests/<category>/*.spec.ts   Test files importing from the fixture
```

Every page object class:
- Extends `BasePage` from `src/pages/base.page.ts`
- Declares `readonly Locator` properties for each element
- Exposes methods that represent **user actions**, not assertions
- Never contains `expect()` calls — assertions belong in test files

---

## Test File Conventions

```typescript
// Import from the custom fixture, NOT from @playwright/test directly
import { test, expect } from '@fixtures/site.fixture';

// Tag every test
test('description @tag', async ({ homePage }) => {
  // ...
});
```

Valid tags: `@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`, `@custom`

---

## Hard Rules — Never Violate

| Rule | Why |
|------|-----|
| Never submit a form | Avoids spamming real company inboxes |
| Never create accounts or log in | Site under test has no auth (per `site.config.json`) |
| Never hardcode the base URL | URL is read from `site.config.json` via Playwright config |
| Never use `page.waitForTimeout()` | Use Playwright's built-in auto-waiting or `waitForSelector` |
| Never put `expect()` in page objects | Keeps page objects reusable and assertion-free |
| Never use `any` without comment | `tsconfig.json` enforces strict mode |

---

## Path-Scoped Rules (`.claude/rules/`)

Rules in `.claude/rules/` load automatically when Claude Code works with files matching the `paths` YAML frontmatter. They extend the instructions above with file-type-specific guidance.

| File | Applies when editing | Key rules |
|------|---------------------|-----------|
| `rules/testing.md` | `tests/**/*.spec.ts` | Import from `@fixtures/site.fixture`; tag every test; no raw `page.locator()` in spec bodies |
| `rules/page-objects.md` | `src/pages/**/*.ts`, `src/fixtures/**/*.ts` | Extend `BasePage`; `readonly Locator` properties; no `expect()` in page objects; strict return types |

---

## Available Claude Code Agents

These agents live in `.claude/agents/` and are invoked by Claude Code:

### `site-analyzer`
**File:** `.claude/agents/site-analyzer.md`
**Purpose:** Crawls the live site and outputs a fully-populated `site.config.json`.
**When to use:** Onboarding a new site, or after a redesign that may have changed nav structure or forms.

### `test-generator`
**When to use:** After `site.config.json` is fully populated, to generate site-specific test files in `tests/custom/`.
**Output:** TypeScript test files following the POM conventions above.

---

## Available Skills (Slash Commands)

See [SKILLS.md](./SKILLS.md) for full documentation. Quick reference:

| Command | Action |
|---------|--------|
| `/analyze-site` | Crawl site, update `site.config.json` |
| `/generate-full-suite` | Generate POM + full test coverage |
| `/run-smoke` | Execute `@smoke` suite and report |
| `/update-baseline` | Refresh visual regression baselines |
| `/generate-report` | Parse and display test results summary |

---

## TypeScript Path Aliases

Configured in `tsconfig.json`:

| Alias | Resolves to |
|-------|-------------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@site-types/*` | `src/types/*` |

---

## Before Finishing Any Task

1. Run `npx tsc --noEmit` — fix all TypeScript errors
2. Run `npm run lint` — fix all ESLint errors
3. Confirm every new test carries at least one tag
4. Confirm no raw `page.locator()` calls appear in spec files (use page objects)
5. Confirm no form submission occurs in any test

---

## Site-Specific Notes

- **HTTP only:** `http://etracktech.com` — the HTTPS endpoint has an invalid TLS certificate. The smoke test flags this as a quality finding. Do not suppress it.
- **No auth:** `auth.required` is `false` in `site.config.json`. Do not attempt to log in.
- **Contact form:** `hasContactForm` is `true`. The form tests check presence and validation only.
- **IoT B2B context:** Tests should look for product/feature sections, CTAs, and an about/company section typical of a B2B SaaS homepage.
