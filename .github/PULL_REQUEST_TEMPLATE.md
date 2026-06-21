## Description

<!-- What does this PR add or change? -->

## Test Coverage

<!-- Check all that apply. At least one must be checked. -->

- [ ] New `@smoke` tests
- [ ] New `@navigation` tests
- [ ] New `@forms` tests
- [ ] New `@functional` tests
- [ ] New `@visual` tests
- [ ] New `@responsive` tests
- [ ] Updated existing tests
- [ ] Added/updated page object(s)
- [ ] No test changes (docs, CI, tooling only)

## Checklist

- [ ] `npm run typecheck` passes (0 errors)
- [ ] `npm run lint` passes (0 warnings)
- [ ] All new tests carry at least one valid `@tag`
- [ ] No raw `page.locator()` calls in spec files — selectors are in page objects
- [ ] No `page.waitForTimeout()` calls over 500ms
- [ ] No form submission in any test
- [ ] No hardcoded URLs (using `baseURL` / `siteConfig.url`)
- [ ] Visual baselines updated if `@visual` tests changed (`npm run baseline`)

## Related Issues

<!-- Closes #issue-number -->
