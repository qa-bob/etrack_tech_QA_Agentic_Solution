# Contributing Guide

This document describes how to contribute tests, page objects, and infrastructure changes to the eTrack Tech QA Agentic Solution.

---

## Getting Started

```bash
# Clone and install
git clone <repo-url>
cd etrack_tech_QA_Agentic_Solution
npm install
npx playwright install --with-deps chromium

# Verify everything compiles
npm run typecheck
npm run lint
```

---

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| New test feature | `feat/test-<area>` | `feat/test-pricing-section` |
| Bug fix | `fix/<short-description>` | `fix/mobile-nav-toggle` |
| Page object | `feat/page-<name>` | `feat/page-services` |
| Baseline update | `chore/update-baselines` | `chore/update-baselines` |
| CI / tooling | `chore/<description>` | `chore/add-smoke-workflow` |

---

## Adding Tests

### Step 1 — Check or create the page object

If the feature you're testing doesn't have a page object yet:
1. Create `src/pages/<kebab-name>.page.ts` extending `BasePage`
2. Add `readonly Locator` properties for all relevant elements
3. Add action methods (no `expect()` calls)
4. Register it in `src/fixtures/site.fixture.ts`

### Step 2 — Write the spec file

- Put the spec under the correct `tests/<category>/` folder
- Import from `@fixtures/site.fixture`, not from `@playwright/test`
- Tag every `test()` with at least one valid tag
- Keep tests independent — no shared state between tests

### Step 3 — Verify

```bash
npm run typecheck          # Must pass with 0 errors
npm run lint               # Must pass with 0 warnings
npx playwright test path/to/your.spec.ts   # Must pass locally
```

---

## Updating Visual Baselines

Visual regression tests compare screenshots to stored baselines in `__snapshots__/`. After an intentional design change:

```bash
npm run baseline           # Regenerates all @visual baselines
```

Review the updated screenshots carefully before committing. Never update baselines to hide an unintentional regression.

---

## Hard Rules

| Rule | Consequence if violated |
|------|------------------------|
| No form submission in any test | Test will be rejected in review |
| No hardcoded URLs | Test will be rejected in review |
| No `page.waitForTimeout()` > 500ms | Test will be flagged as flaky |
| No `expect()` in page objects | Architecture violation |
| No raw `page.locator()` in spec files | Architecture violation |
| TypeScript `any` without comment | Lint error (CI will fail) |

---

## Pull Request Process

1. Fill out the pull request template completely
2. Ensure the smoke workflow passes (auto-runs on PR)
3. Request a review from a team member
4. Address all review comments before merging
5. Squash-merge into `main`

---

## Questions?

Open an issue or ask in the team Slack channel. Tag the PR with the relevant label (`test`, `page-object`, `ci`, `docs`).
