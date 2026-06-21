# eTrack Tech — QA Agentic Solution

Automated Playwright + TypeScript regression test suite for [eTrack Tech](http://etracktech.com), an IoT predictive maintenance platform for industrial facilities. Built with a **Page Object Model (POM)** architecture and **Object-Oriented Programming (OOP)** design, structured for agentic execution by Claude Code.

---

## Company

| Field | Detail |
|-------|--------|
| **Company** | eTrack Tech |
| **Website** | http://etracktech.com |
| **Industry** | IoT / Information Technology & Services |
| **Description** | Predictive maintenance platform for industrial facilities |
| **Founded** | 2017, Phoenix AZ |

> **Known issue:** The site serves over HTTP only. The HTTPS endpoint (`https://etracktech.com`) has an invalid TLS certificate (`ERR_TLS_CERT_ALTNAME_INVALID`). The `@smoke` suite flags this as a quality finding. Keep `"url": "http://etracktech.com"` in `site.config.json` until the operator fixes the certificate.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 LTS or later |
| npm | 9 or later |
| Git | Any recent version |
| Claude Code CLI | Latest (`claude --version`) |

---

## Development Environment Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd etrack_tech_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers
npx playwright install --with-deps chromium

# 4. Verify TypeScript compiles cleanly
npm run typecheck

# 5. Run smoke tests to confirm the site is reachable
npm run test:smoke
```

### Environment Variables

Copy `.env.example` to `.env`. The only variable needed for standard runs is optional.

```bash
cp .env.example .env
# SITE_URL=https://staging.etracktech.com   ← overrides site.config.json (useful for staging)
```

---

## Running Tests

```bash
npm test                    # Full suite — all categories, all browsers
npm run test:smoke          # @smoke  — availability and title checks
npm run test:navigation     # @navigation — nav links, routing, mobile menu
npm run test:forms          # @forms  — contact form fields and validation
npm run test:visual         # @visual — screenshot regression
npm run test:responsive     # @responsive — layout at mobile/tablet/desktop
npm run test:headed         # Full suite in headed (visible) browser mode
npm run baseline            # Update visual regression baselines
npm run lint                # ESLint
npm run typecheck           # TypeScript type check (tsc --noEmit)
npm run report              # Open the HTML report in a browser
```

### Target a specific browser

```bash
npx playwright test --project=chromium-desktop
npx playwright test --project=mobile-chrome
npx playwright test --project=tablet
```

---

## Architecture

This suite follows **Page Object Model (POM)** with **Object-Oriented Programming (OOP)** principles.

```
src/
  pages/
    base.page.ts          BasePage — shared locators and navigation helpers
    home.page.ts          HomePage — hero section, CTAs, main headings
    navigation.page.ts    NavigationPage — nav links, mobile menu, link checks
    contact.page.ts       ContactFormPage — form discovery, field validation
    <page>.page.ts        One class per additional page or feature area
  fixtures/
    site.fixture.ts       Custom Playwright fixtures (exposes all page objects)
  utils/
    link-checker.ts       HTTP HEAD request link checking
    visual-helper.ts      Cookie banner dismissal, animation pause helpers
  types/
    site-config.types.ts  SiteConfig TypeScript interface and loadSiteConfig()

tests/
  smoke/                  @smoke      — site is up, title present, no console errors
  navigation/             @navigation — nav links, routing, mobile menu toggles
  forms/                  @forms      — contact form structure and validation
  functional/             @functional — B2B feature areas, content sections, CTAs
  visual/                 @visual     — full-page screenshot baselines
  responsive/             @responsive — layout at 390 / 768 / 1280 px
```

### OOP Rules

- Page classes extend `BasePage` — never call `page.locator()` raw in test bodies
- Locators are `readonly Locator` properties typed on the class constructor
- Methods represent **user actions**; `expect()` calls belong in test files only
- Never submit forms; never create accounts or enter real credentials
- No hardcoded URLs — always read `baseURL` from Playwright config

---

## Test Categories

| Tag | Purpose | Folder |
|-----|---------|--------|
| `@smoke` | Site loads, HTTP 200, no JS errors, title present | `tests/smoke/` |
| `@navigation` | Primary nav visible, links reachable, mobile menu toggles | `tests/navigation/` |
| `@forms` | Contact form present, required fields, validation messages | `tests/forms/` |
| `@functional` | Homepage hero, CTAs, content sections, B2B feature areas | `tests/functional/` |
| `@visual` | Screenshot regression at desktop/tablet/mobile viewports | `tests/visual/` |
| `@responsive` | No horizontal scroll, readable text, alt attrs, viewport meta | `tests/responsive/` |
| `@custom` | Site-specific scenarios generated by `test-generator` agent | `tests/custom/` |

---

## Claude Code Integration

This repo is optimized for agentic execution by [Claude Code](https://code.claude.com). Every Claude Code session reads the instruction files below to understand how to work here.

### Instruction Hierarchy

When a Claude Code session opens, instructions are loaded in this order (each layer adds specificity):

| File | Loaded by | Purpose |
|------|-----------|---------|
| `CLAUDE.md` | Claude Code at session start | Primary instructions — imports `@AGENTS.md`, adds Claude-specific context |
| `AGENTS.md` | All AI tools (Copilot, Cursor, Codex) | Universal coding conventions for this repository |
| `.claude/rules/testing.md` | Claude Code when editing test files | Path-scoped rules for `tests/**/*.spec.ts` |
| `.claude/rules/page-objects.md` | Claude Code when editing page objects | Path-scoped rules for `src/pages/**/*.ts` |
| `.claude/settings.json` | Claude Code on startup | Pre-authorized commands; auto-memory toggle |

### `.claude/` Directory Reference

```
.claude/
  settings.json             Pre-authorized npm/playwright commands, autoMemoryEnabled
  settings.local.json       Machine-local overrides — gitignored, not committed
  commands/
    analyze-site.md         /analyze-site  skill definition
    generate-full-suite.md  /generate-full-suite skill definition
    generate-report.md      /generate-report skill definition
    run-smoke.md            /run-smoke skill definition
    update-baseline.md      /update-baseline skill definition
  agents/
    site-analyzer.md        Subagent: crawls live site → outputs site.config.json
    test-generator.md       Subagent: reads config → generates site-specific tests
  rules/
    testing.md              Path-scoped rules for tests/**/*.spec.ts
    page-objects.md         Path-scoped rules for src/pages/**/*.ts
  hooks/
    pre-test.sh             Shell hook executed before Playwright test runs
```

### Agents (`.claude/agents/`)

Sub-agents are specialized Claude Code instances invoked for specific tasks.

| Agent | File | Role |
|-------|------|------|
| `site-analyzer` | `agents/site-analyzer.md` | Crawls the live website, discovers nav structure and forms, outputs a fully-populated `site.config.json` |
| `test-generator` | `agents/test-generator.md` | Reads `site.config.json` and generates site-specific test files in `tests/custom/` beyond the shared suite |

**When to invoke `site-analyzer`:**
- First-time setup of a new site
- After a redesign that changed nav structure or forms

**When to invoke `test-generator`:**
- After `site.config.json` is fully populated
- When the site has unique functionality not covered by the generic suites

### Skills (Slash Commands)

Skills are defined in `.claude/commands/` and invoked by typing their name at the Claude Code prompt.

| Command | File | What it does |
|---------|------|-------------|
| `/generate-full-suite` | `commands/generate-full-suite.md` | Fetches live site → generates POM classes + full test suite across all categories |
| `/analyze-site` | `commands/analyze-site.md` | Crawls site, updates `site.config.json`, reports quality issues |
| `/run-smoke` | `commands/run-smoke.md` | Executes `@smoke` tests, reports pass/fail, flags connection issues |
| `/update-baseline` | `commands/update-baseline.md` | Runs `--update-snapshots` on `@visual` tests, reports what changed |
| `/generate-report` | `commands/generate-report.md` | Parses `test-results/results.json`, displays a structured summary |

See [`SKILLS.md`](./SKILLS.md) for full documentation of each skill including usage arguments and prerequisites.

### Rules (`.claude/rules/`)

Path-scoped rules load automatically when Claude Code works with files matching the `paths` frontmatter. They add file-type-specific guidance without bloating the main `CLAUDE.md`.

| File | `paths` frontmatter | Key rules enforced |
|------|--------------------|--------------------|
| `rules/testing.md` | `tests/**/*.spec.ts` | Import from `@fixtures/site.fixture`; tag every test; no raw `page.locator()` in spec bodies; never `waitForTimeout()`; never submit forms |
| `rules/page-objects.md` | `src/pages/**/*.ts` | Extend `BasePage`; `readonly Locator` properties; no `expect()` in page objects; strict return types; naming conventions |

### Claude Code Initialization Checklist

Status of this repository against the [Claude Code documentation](https://code.claude.com/docs/en/memory).

| Item | Required by docs | Status | Notes |
|------|-----------------|--------|-------|
| `CLAUDE.md` at project root | Required | ✅ | Imports `@AGENTS.md`; Claude-specific workflow section |
| `AGENTS.md` at project root | Recommended | ✅ | AI-agnostic conventions; read by all AI coding tools |
| `SKILLS.md` at project root | Recommended | ✅ | Reference manual for all slash commands |
| `.claude/settings.json` with `permissions.allow` | Recommended | ✅ | npm/playwright commands pre-authorized |
| `.claude/commands/*.md` (skills) | Optional | ✅ | 5 skills defined and documented |
| `.claude/agents/*.md` (subagents) | Optional | ✅ | `site-analyzer` and `test-generator` |
| `.claude/rules/*.md` (path-scoped rules) | Optional | ✅ | `testing.md` and `page-objects.md` with YAML frontmatter |
| `.claude/hooks/` | Optional | ✅ | `pre-test.sh` hook |
| `.github/copilot-instructions.md` | Optional | ✅ | Mirrors `AGENTS.md` in Copilot-native format |
| CI workflows with Playwright | Recommended | ✅ | `smoke.yml` (PR gate), `playwright.yml` (full suite) |

---

## `AGENTS.md` — What It Contains

[`AGENTS.md`](./AGENTS.md) is the universal AI instruction file for this repository. Every major AI coding tool reads it: GitHub Copilot, Cursor, Codex, and Claude Code (via the `@AGENTS.md` import in `CLAUDE.md`). It documents:

- **Repository purpose** — what this repo is for and what it must never do
- **Architecture** — POM/OOP structure, directory layout, class conventions
- **Test file conventions** — import paths, tagging, fixture usage
- **Hard rules** — never submit forms, never hardcode URLs, never use `waitForTimeout()`
- **Available agents** — brief registry of `.claude/agents/` subagents
- **Available skills** — pointer to `SKILLS.md` and the slash command table
- **TypeScript path aliases** — `@pages`, `@fixtures`, `@utils`, `@site-types`
- **Pre-task checklist** — typecheck, lint, tag verification, form-submission check

---

## `SKILLS.md` — What It Contains

[`SKILLS.md`](./SKILLS.md) is the reference manual for all Claude Code slash commands in this project. For each skill it documents:

- **Usage** — how to invoke it and any optional arguments
- **What it does** — numbered step-by-step walkthrough
- **When to use** — recommended trigger conditions
- **Expected duration / output** — so contributors know what to expect
- **Prerequisites** — anything that must run first (e.g., `npm test` before `/generate-report`)

It also explains how to add a new skill.

---

## `.github` Folder

| Path | Purpose |
|------|---------|
| `.github/CONTRIBUTING.md` | Step-by-step contributor guide: adding tests, creating page objects, branch naming, PR process, hard rules table with consequences |
| `.github/PULL_REQUEST_TEMPLATE.md` | PR checklist: typecheck, lint, tag verification, no form submission, baseline update note, test count |
| `.github/workflows/playwright.yml` | Full regression suite triggered on push to `main` and manual dispatch; uploads HTML report + results JSON as artifacts (30-day retention) |
| `.github/workflows/smoke.yml` | Smoke-only fast gate on every PR; blocks merge if the site is unreachable or a basic test breaks (~2 min) |
| `.github/copilot-instructions.md` | GitHub Copilot custom instructions mirroring `AGENTS.md` conventions in the Copilot-native format; kept in sync with `AGENTS.md` manually |

---

## Site Configuration (`site.config.json`)

```json
{
  "name": "eTrack Tech",
  "url": "http://etracktech.com",
  "hasContactForm": true,
  "skipVisual": false,
  "skipForms": false,
  "viewports": ["desktop", "mobile", "tablet"]
}
```

To run against staging: `SITE_URL=https://staging.etracktech.com npm test`

---

## Contributor Rules

1. **Run `npm run typecheck` and `npm run lint` before opening a PR.** CI enforces both.
2. **Every new test must carry a tag** (`@smoke`, `@navigation`, `@forms`, `@functional`, `@visual`, `@responsive`).
3. **Selectors go in page objects.** No raw `page.locator()` calls in spec files.
4. **Never submit forms.** Test field interaction and validation only — never click the submit button.
5. **Never use `page.waitForTimeout()`** with values over 500 ms. Use `waitForSelector`, `waitForLoadState`, or Playwright auto-waiting.
6. **No `any` type without a justifying comment.** `strict: true` is enforced by `tsconfig.json`.
7. **Update visual baselines** with `npm run baseline` after intentional design changes.
8. **One page object per page or feature area.** Add to `src/pages/` following the `BasePage` pattern.
9. **Do not hardcode the site URL** in any test file — read it from `siteConfig.url` via the fixture.
10. See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guide including branch naming and PR process.

---

## CI Pipeline

| Workflow | Trigger | Approx. Duration | Artifacts |
|----------|---------|-----------------|-----------|
| `smoke.yml` | Every PR (push to any branch) | ~2 min | Test results JSON |
| `playwright.yml` | Push to `main`, manual dispatch | ~8–12 min | HTML report, test results JSON |

Reports are uploaded as GitHub Actions artifacts and retained for 30 days.
