# SKILLS.md — Slash Commands Reference

Skills (slash commands) are agentic workflows available in Claude Code for this repository. Invoke them by typing the command name at the Claude Code prompt. Skill definitions live in `.claude/commands/`.

---

## `/analyze-site`

**File:** `.claude/commands/analyze-site.md`

Crawls the live site and produces a fully-populated `site.config.json`.

**Usage:**
```
/analyze-site
/analyze-site https://staging.etracktech.com
```

**What it does:**
1. Navigates to the site URL (from `site.config.json` or the provided argument)
2. Extracts nav links, headings, meta description, CTA text, and form presence
3. Dismisses cookie banners before inspection
4. Checks for contact forms at `/contact`, `/contact-us`, etc.
5. Assesses HTTPS, viewport meta tag, and horizontal overflow
6. Outputs an updated `site.config.json` block and an issues checklist

**When to use:**
- First-time setup of a new site repo
- After a site redesign that may have changed nav structure or forms
- To verify that `expectedNavItems` in `site.config.json` is current

---

## `/generate-full-suite`

**File:** `.claude/commands/generate-full-suite.md`

Analyzes the website and generates a complete POM + test suite tailored to the site's actual content.

**Usage:**
```
/generate-full-suite
```

**What it does:**
1. Reads `site.config.json`
2. Fetches the live site to discover pages, sections, and interactive elements
3. Generates or updates page object classes in `src/pages/`
4. Writes test files for all discovered features across all test categories
5. Runs `npx tsc --noEmit` to verify compilation

**When to use:**
- Initial test suite generation for a new site
- After a major redesign when most existing tests are stale

**Output:** Updated `src/pages/` classes and `tests/` spec files

---

## `/run-smoke`

**File:** `.claude/commands/run-smoke.md`

Runs the `@smoke` test suite and reports results.

**Usage:**
```
/run-smoke
```

**What it does:**
1. Executes `npm run test:smoke` (Playwright `--grep @smoke`)
2. Reports pass/fail counts per test
3. Lists any failures with error messages
4. Flags connection or HTTPS issues

**When to use:**
- Quick sanity check that the site is reachable and functional
- Before opening a PR
- After deploying a site change

**Expected duration:** ~1–2 minutes

---

## `/update-baseline`

**File:** `.claude/commands/update-baseline.md`

Refreshes the visual regression screenshot baselines.

**Usage:**
```
/update-baseline
```

**What it does:**
1. Runs `npm run baseline` (Playwright `--update-snapshots` on `@visual` tests)
2. Replaces existing screenshots in `__snapshots__/`
3. Reports which snapshots were updated

**When to use:**
- After an intentional visual design change (rebrand, layout update)
- When `@visual` tests fail due to expected changes, not regressions

**Warning:** Always review the updated screenshots before committing them. Accidentally updating baselines can mask real visual regressions.

---

## `/generate-report`

**File:** `.claude/commands/generate-report.md`

Parses the last test run's results and displays a structured summary.

**Usage:**
```
/generate-report
```

**What it does:**
1. Reads `test-results/results.json`
2. Displays a table of pass/fail/flaky counts per tag
3. Lists all failed tests with error messages
4. Suggests next steps (fix broken links, investigate flaky tests, update baselines)

**When to use:**
- After any test run to get a human-readable summary
- When CI fails and you need to triage which tests are broken

**Prerequisite:** Run `npm test` (or any test command) first to generate `test-results/results.json`.

---

## Adding a New Skill

1. Create `.claude/commands/<skill-name>.md`
2. Start the file with a `# /<skill-name>` heading
3. Document: Usage, What it does (numbered steps), When to use, Output/Prerequisites
4. Add the skill to this SKILLS.md file and to the table in `CLAUDE.md`
