# eGovPH QA Bug List

### BUG-1: Vitest Unit Test Environment Missing `localStorage`
**Severity:** Critical
**Area:** Unit Testing
**Test case:** Unit tests for `mock/db.ts`
**Steps to reproduce:**
1. Run `npm run test` (Vitest).
**Expected:** `db.ts` tests run successfully by mocking or utilizing jsdom's localStorage.
**Actual:** Fails with `ReferenceError: localStorage is not defined`.
**Suspected location:** `vitest.config.ts` environment configuration.

### BUG-2: E2E Playwright Timeout on Splash Screen
**Severity:** Blocker
**Area:** Auth & Onboarding (Tier 1)
**Test case:** AUTH-01
**Steps to reproduce:**
1. Run `npx playwright test`.
**Expected:** Test successfully locates the splash screen text and proceeds to the Welcome screen.
**Actual:** Timeout waiting for text locator (`Your Government. One App.`). The DOM may not be fully initialized or the animation delays are exceeding Playwright's default timeouts.
**Suspected location:** `tests/e2e/auth.spec.ts` locators or `SplashScreen.tsx` animation timings.

### BUG-3: E2E Playwright Timeout on Navigation
**Severity:** Blocker
**Area:** Tier 1 flows
**Test case:** General navigation across all E2E specs
**Steps to reproduce:**
1. Run `npx playwright test`.
**Expected:** Tests navigate between screens seamlessly.
**Actual:** Playwright fails to find specific text locators (e.g., "eGovPH Super App" or "Log In") due to animations or inaccurate locators in the test files mismatching the actual UI text rendered.
**Suspected location:** `tests/e2e/*.spec.ts`

### BUG-4: ESLint Unused Variables & Imports
**Severity:** Minor
**Area:** Cross-cutting
**Test case:** Static analysis
**Steps to reproduce:**
1. Run `npx oxlint` or ESLint.
**Expected:** Zero warnings.
**Actual:** Several unused imports (e.g., `ExternalLink`, `Eye`, `CheckCircle`) and an impure function call (`Math.random()` in `Input.tsx` during render).
**Suspected location:** `Input.tsx`, `DisclaimerModal.tsx`, `IDQRShareScreen.tsx`, etc.
