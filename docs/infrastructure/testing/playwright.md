# Playwright E2E Testing Framework

## Overview

**Version**: 1.56.0
**Purpose**: Modern end-to-end testing framework for testing complete user workflows, UI interactions, and application behavior across real browsers. Playwright complements Bun's unit tests by verifying full application functionality from a user's perspective.

## What Playwright Provides

1. **Cross-Browser Testing** - Tests run on Chromium, Firefox, and WebKit (Safari)
2. **Real Browser Automation** - Interacts with actual browser engines, not simulations
3. **User Workflow Validation** - Verifies complete user journeys and interactions
4. **Visual Testing** - Screenshots, videos, and traces for debugging
5. **API Testing** - Can test HTTP APIs without browser UI
6. **Network Control** - Intercept and mock network requests
7. **Auto-Wait** - Smart waiting for elements to be ready before interactions
8. **Parallel Execution** - Fast test execution across multiple workers

## When to Use E2E Tests (Playwright)

- Testing complete user workflows (login, checkout, form submission)
- Verifying UI interactions (buttons, forms, navigation)
- Testing across multiple browsers
- Validating visual appearance and layout
- Testing API endpoints with real HTTP calls
- Ensuring integrations work correctly
- Testing authentication and authorization flows
- Verifying production-like scenarios

## Running Playwright Tests

```bash
# Run all E2E tests
bun test:e2e
playwright test

# Run all tests (unit + E2E)
bun test:all

# Run specific test file
playwright test tests/example.spec.ts

# Run tests in specific browser
playwright test --project=chromium
playwright test --project=firefox
playwright test --project=webkit

# Run tests in headed mode (visible browser)
playwright test --headed

# Run tests in debug mode
playwright test --debug

# Run tests in UI mode (interactive)
playwright test --ui

# Generate code (record interactions)
playwright codegen http://localhost:3000

# Show test report
playwright show-report

# Run specific test by name
playwright test -g "test name pattern"

# Run tests matching pattern
playwright test tests/auth/

# Parallel execution (default)
playwright test --workers 4

# Run tests in serial
playwright test --workers 1
```

## Configuration: playwright.config.ts

### Active Configuration

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',              // E2E tests directory
  fullyParallel: true,             // Run tests in parallel for speed
  forbidOnly: !!process.env.CI,    // Prevent test.only in CI
  retries: process.env.CI ? 2 : 0, // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Serial in CI, parallel locally
  reporter: 'html',                // HTML test report

  use: {
    trace: 'on-first-retry',       // Capture trace on retry
    // baseURL: 'http://localhost:3000', // Uncomment when server added
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  // webServer: { // Uncomment to auto-start dev server
  //   command: 'bun run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
})
```

### Configuration Breakdown

- **testDir**: `./tests` - All E2E tests must be in the `tests/` directory
- **fullyParallel**: `true` - Tests run concurrently for faster execution
- **forbidOnly**: Prevents accidentally committing `test.only()` in CI
- **retries**: Auto-retry failed tests in CI (flaky test handling)
- **workers**: 1 worker in CI (reliable), multiple locally (fast)
- **reporter**: `'html'` - Generates interactive HTML report at `playwright-report/`
- **trace**: Captures execution trace on test retry for debugging
- **projects**: Tests run on Chromium, Firefox, and WebKit browsers
- **webServer**: (Optional) Auto-start development server before tests

## Test File Structure

### Location and Naming

- **Location**: All E2E tests must be in the `tests/` directory
- **Naming**: `*.spec.ts` (Playwright convention)

### Example Test

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform user workflow', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:3000')

    // Interact with elements
    await page.click('button#login')
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Assertions
    await expect(page.locator('h1')).toHaveText('Dashboard')
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    await page.click('button[type="submit"]') // Submit without filling

    await expect(page.locator('.error')).toBeVisible()
    await expect(page.locator('.error')).toHaveText('Email is required')
  })
})
```

## Playwright Fixtures and APIs

```typescript
// Page fixture (most common)
test('test with page', async ({ page }) => {
  await page.goto('https://example.com')
})

// Browser context (for isolation)
test('test with context', async ({ context }) => {
  const page = await context.newPage()
})

// Browser instance (for low-level control)
test('test with browser', async ({ browser }) => {
  const context = await browser.newContext()
})

// Request fixture (API testing without browser)
test('API test', async ({ request }) => {
  const response = await request.get('https://api.example.com/users')
  expect(response.ok()).toBeTruthy()
})
```

## Common Playwright Patterns

### Selectors

```typescript
// CSS selectors
await page.click('.submit-button')
await page.locator('#username').fill('user')

// Text selectors
await page.click('text=Sign In')
await page.getByText('Welcome').isVisible()

// Role-based selectors (recommended - accessible)
await page.getByRole('button', { name: 'Submit' }).click()
await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com')

// Data-testid (recommended for stability)
await page.getByTestId('submit-button').click()
```

### Waiting and Assertions

```typescript
// Auto-waiting (built-in)
await page.click('button') // Waits for button to be actionable

// Explicit waits
await page.waitForSelector('.loaded')
await page.waitForURL('**/dashboard')
await page.waitForLoadState('networkidle')

// Assertions (auto-retry until timeout)
await expect(page.locator('h1')).toHaveText('Title')
await expect(page).toHaveURL(/dashboard/)
await expect(page.locator('.error')).toBeVisible()
await expect(page.locator('.spinner')).toBeHidden()
```

### Screenshots and Videos

```typescript
// Screenshot
await page.screenshot({ path: 'screenshot.png' })
await page.locator('.element').screenshot({ path: 'element.png' })

// Videos (configured in playwright.config.ts)
use: {
  video: 'on-first-retry', // Record video on failure
}
```

### Network Interception

```typescript
// Mock API responses
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'User' }])
  })
})

// Abort requests (images, CSS)
await page.route('**/*.{png,jpg,jpeg}', route => route.abort())
```

### Test Isolation

```typescript
// Before each test
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000')
  // Set up authentication, state, etc.
})

// After each test
test.afterEach(async ({ page }) => {
  // Clean up data, log out, etc.
})

// Storage state (persist authentication)
await page.context().storageState({ path: 'auth.json' })
```

## Integration with Bun

- Command: `bun test:e2e` (runs `playwright test`)
- Combined: `bun test:all` (runs `bun test && bun test:e2e`)
- Execution: Playwright runs as separate process, uses Bun for TypeScript
- Compatibility: Works seamlessly with Bun's TypeScript support
- No compilation needed: Playwright executes TypeScript tests directly

## Test Execution Flow

```bash
# When running: bun test:all
# 1. Runs unit tests first: bun test (native command)
# 2. If unit tests pass, runs E2E tests: bun test:e2e (playwright test)
# 3. If either fails, entire test suite fails (fail-fast strategy)
```

## Why Unit Tests Run First (Fail-Fast Strategy)

- **Speed**: Unit tests are faster (milliseconds vs seconds)
- **Early Feedback**: Catch obvious bugs before expensive E2E tests
- **Cost-Effective**: No point running slow E2E tests if unit tests fail
- **CI/CD Efficiency**: Fails build quickly if basic logic is broken
- **Resource Savings**: Avoids browser startup if code is fundamentally broken

## Debugging E2E Tests

### Debug Mode (Step Through Test)

```bash
playwright test --debug
```

### UI Mode (Interactive Test Runner)

```bash
playwright test --ui
```

### Trace Viewer (Inspect Test Execution)

```bash
# Traces captured automatically on retry (configured in playwright.config.ts)
playwright show-trace trace.zip
```

### Headed Mode (See Browser)

```bash
playwright test --headed
```

### Slow Motion (See Interactions Clearly)

```typescript
test.use({ launchOptions: { slowMo: 1000 } }) // 1 second delay
```

### Console Logging

```typescript
page.on('console', msg => console.log(msg.text()))
```

## When to Run E2E Tests

1. **Before Committing** (recommended):
   ```bash
   bun test:all  # Runs both unit and E2E tests
   ```

2. **In CI/CD Pipeline** (critical):
   ```bash
   bun test:e2e  # Verify deployable code
   ```

3. **After Feature Development** (recommended):
   ```bash
   bun test:e2e tests/new-feature.spec.ts
   ```

4. **Before Releases** (critical):
   ```bash
   bun test:e2e  # Full E2E validation
   ```

5. **During Development** (optional, for specific tests):
   ```bash
   playwright test --headed --debug tests/auth.spec.ts
   ```

## DO NOT Run E2E Tests as Frequently as Unit Tests

- E2E tests are slow (browser startup, navigation, rendering)
- Resource-intensive (CPU, memory for browser instances)
- Best for validating complete features, not every code change
- Use unit tests for fast feedback, E2E tests for validation

## Browser Support

Playwright tests run on three browser engines:

- **Chromium** - Chrome, Edge, Opera, Brave (most common)
- **Firefox** - Mozilla Firefox
- **WebKit** - Safari, iOS Safari (Apple browsers)

## Mobile Testing (Optional)

```typescript
// Uncomment in playwright.config.ts
{
  name: 'Mobile Chrome',
  use: { ...devices['Pixel 5'] },
},
{
  name: 'Mobile Safari',
  use: { ...devices['iPhone 12'] },
},
```

## CI/CD Integration

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: bun install

- name: Install Playwright browsers
  run: bunx playwright install --with-deps

- name: Run unit tests
  run: bun test

- name: Run E2E tests
  run: bun test:e2e

- name: Upload test report
  if: failure()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Playwright Output Files

Ignored in .gitignore:

- `/test-results/` - Test execution results and artifacts
- `/playwright-report/` - HTML test reports (view with `playwright show-report`)
- `/blob-report/` - Binary reports for distributed testing
- `/playwright/.cache/` - Cached browser binaries
- `/playwright/.auth/` - Authentication state files

## Best Practices

1. **Keep E2E tests focused** - Test user workflows, not implementation details
2. **Use descriptive test names** - Clearly state what user action is being tested
3. **Prefer role-based selectors** - More resilient to UI changes
4. **Avoid testing third-party services** - Mock external APIs
5. **Use test data carefully** - Clean up after tests to avoid state pollution
6. **Run E2E tests less frequently** - Reserve for validation, not rapid iteration
7. **Leverage auto-waiting** - Trust Playwright's built-in waits, avoid manual timeouts
8. **Use screenshots/traces for debugging** - Visual feedback for failed tests
9. **Test critical paths first** - Authentication, checkout, core workflows
10. **Keep tests independent** - Each test should run in isolation

## Common Pitfalls

- **Too many E2E tests** - Slow test suite, long feedback loop
- **Testing implementation details** - Brittle tests that break on refactoring
- **Not using auto-wait** - Flaky tests with manual `setTimeout()`
- **Sharing state between tests** - Tests fail when run in isolation
- **Testing everything in E2E** - Unit tests are better for edge cases

## Troubleshooting

### Browsers Not Installed

```bash
bunx playwright install
bunx playwright install --with-deps  # Install system dependencies
```

### Tests Timing Out

- Increase timeout in `playwright.config.ts`: `timeout: 60000` (60 seconds)
- Use `test.setTimeout(120000)` for specific tests
- Check if application is slow to start

### Flaky Tests

- Use auto-waiting instead of manual timeouts
- Increase retries in CI: `retries: 2`
- Use `test.fail()` to mark known flaky tests
- Investigate with trace viewer: `playwright show-trace`

### Selector Not Found

- Use `page.pause()` to inspect page state
- Try more robust selectors (role-based, test IDs)
- Verify element is visible: `await expect(locator).toBeVisible()`

## Playwright vs Other Tools

| Tool | Purpose | When to Run | Speed |
|------|---------|-------------|-------|
| **Playwright** | E2E testing (full workflows) | Before commits, in CI/CD | Slow (seconds-minutes) |
| **Bun Test** | Unit testing (isolated logic) | Continuously, during dev | Very fast (milliseconds) |
| **TypeScript (tsc)** | Type checking | Before commits, in CI/CD | Medium (seconds) |
| **ESLint** | Code quality | Before commits, in CI/CD | Fast (seconds) |
| **Prettier** | Code formatting | Before commits, on save | Very fast (milliseconds) |

## Example Workflow

```bash
# 1. Write code
# 2. Run unit tests continuously
bun test --watch

# 3. Before committing, run full test suite
bun run lint && bun run format && bun run typecheck && bun test:all

# 4. Commit code
git add . && git commit -m "feat: add feature"

# 5. In CI/CD, all tests run again
# - bun run lint
# - bun run typecheck
# - bun test (unit tests)
# - bun test:e2e (E2E tests)
```

## References

- Playwright documentation: https://playwright.dev/
- Test API reference: https://playwright.dev/docs/api/class-test
- Best practices: https://playwright.dev/docs/best-practices
