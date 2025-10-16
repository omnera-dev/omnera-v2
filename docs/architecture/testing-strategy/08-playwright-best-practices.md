# Testing Strategy - E2E-First TDD with Test-After Unit Tests

> **Note**: This is part 8 of the split documentation. See navigation links below.

## Playwright Best Practices

These best practices come directly from [Playwright's official documentation](https://playwright.dev/docs/best-practices) and should be followed in all E2E tests.

### Testing Philosophy

#### Test User-Visible Behavior

Focus on what end users see and interact with, not implementation details.
**✅ GOOD - Test user-visible behavior:**

```typescript
import { test, expect } from '@playwright/test'
test('user can submit contact form', async ({ page }) => {
  await page.goto('/contact')
  // Test what users see: labels, buttons, text
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByLabel('Message').fill('Hello!')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expect(page.getByText('Thank you for your message')).toBeVisible()
})
```

**❌ BAD - Test implementation details:**

```typescript
// Don't rely on CSS classes, function names, or internal structure
test('user can submit contact form', async ({ page }) => {
  await page.locator('.form-input-email').fill('user@example.com') // CSS class
  await page.locator('button.btn-submit-primary').click() // Internal structure
  await expect(page.locator('div.success-message-container')).toBeVisible()
})
```

#### Test Isolation

Each test must run independently with its own local storage, session storage, data, and cookies. Never depend on test execution order.
**✅ GOOD - Isolated tests with beforeEach:**

```typescript
test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Each test gets fresh authentication state
    await page.goto('/login')
    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page).toHaveURL('/dashboard')
  })
  test('can view profile', async ({ page }) => {
    await page.getByRole('link', { name: 'Profile' }).click()
    await expect(page.getByRole('heading', { name: 'User Profile' })).toBeVisible()
  })
  test('can view settings', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  })
})
```

**❌ BAD - Tests depend on execution order:**

```typescript
let authToken: string // Shared state
test('user logs in', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  authToken = await page.evaluate(() => localStorage.getItem('token')) // Shared state
})
test('user views profile', async ({ page }) => {
  // Assumes previous test ran and set authToken
  await page.evaluate((token) => localStorage.setItem('token', token), authToken)
  await page.goto('/profile')
})
```

#### Avoid Testing Third-Party Dependencies

Don't test external sites or APIs you don't control. Use Playwright's Network API to mock responses.
**✅ GOOD - Mock external APIs:**

```typescript
test('displays weather data', async ({ page }) => {
  // Mock external weather API
  await page.route('**/api.weather.com/current', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        temperature: 72,
        condition: 'sunny',
        humidity: 45,
      }),
    })
  })
  await page.goto('/weather')
  await expect(page.getByText('72°F')).toBeVisible()
  await expect(page.getByText('Sunny')).toBeVisible()
})
```

**❌ BAD - Depend on live external APIs:**

```typescript
test('displays weather data', async ({ page }) => {
  // Don't rely on external API being available/stable
  await page.goto('/weather')
  // Test may fail if API is down, returns different data, or rate limits
  await expect(page.getByText(/\d+°F/)).toBeVisible()
})
```

### Locator Best Practices

#### Use Role-Based Locators (Recommended)

Prioritize user-facing attributes and ARIA roles over CSS selectors or XPath.
**Locator Priority (Best to Worst):**

1. **Role-based** - `page.getByRole('button', { name: 'Submit' })`
2. **Label** - `page.getByLabel('Email address')`
3. **Placeholder** - `page.getByPlaceholder('Enter email')`
4. **Text** - `page.getByText('Welcome')`
5. **Test ID** - `page.getByTestId('submit-button')`
6. **CSS/XPath** - `page.locator('.submit-btn')` (last resort)
   **✅ GOOD - Role-based locators:**

```typescript
test('user can add product to cart', async ({ page }) => {
  await page.goto('/products')
  // Use semantic roles and accessible names
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('link', { name: 'View cart' }).click()
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible()
  await expect(page.getByRole('listitem')).toHaveCount(1)
})
```

**❌ BAD - CSS class selectors:**

```typescript
test('user can add product to cart', async ({ page }) => {
  await page.goto('/products')
  // Fragile - breaks when CSS classes change
  await page.locator('.btn-primary.add-to-cart-button').click()
  await page.locator('a.nav-link-cart').click()
  await expect(page.locator('h1.cart-heading')).toBeVisible()
  await expect(page.locator('.cart-item')).toHaveCount(1)
})
```

#### Chain and Filter Locators

Narrow searches to specific page sections for more resilient tests.
**✅ GOOD - Chain and filter:**

```typescript
test('user can select product variant', async ({ page }) => {
  await page.goto('/products')
  // Chain locators to find button within specific product card
  const productCard = page.getByRole('article').filter({ hasText: 'Blue T-Shirt' })
  await productCard.getByRole('combobox', { name: 'Size' }).selectOption('Large')
  await productCard.getByRole('button', { name: 'Add to cart' }).click()
  await expect(page.getByText('Added to cart')).toBeVisible()
})
```

**❌ BAD - Global selectors without context:**

```typescript
test('user can select product variant', async ({ page }) => {
  await page.goto('/products')
  // Ambiguous - which "Size" dropdown if there are multiple products?
  await page.getByRole('combobox', { name: 'Size' }).selectOption('Large')
  await page.getByRole('button', { name: 'Add to cart' }).click()
})
```

#### Use Codegen to Generate Locators

Use Playwright's codegen tool to generate resilient locators automatically.

````bash

### Assertions and Auto-Waiting

#### Use Web-First Assertions
Playwright's web-first assertions automatically wait until the expected condition is met (with retries).
**✅ GOOD - Web-first assertions (auto-wait):**
```typescript
test('user sees success message after form submission', async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByRole('button', { name: 'Submit' }).click()
  // Waits up to 5 seconds for element to become visible
  await expect(page.getByText('Message sent successfully')).toBeVisible()
  // Waits for URL to match pattern
  await expect(page).toHaveURL(/.*success/)
  // Waits for element to contain specific text
  await expect(page.getByRole('heading')).toHaveText('Thank You')
})
````

**❌ BAD - Manual checks without auto-wait:**

```typescript
test('user sees success message after form submission', async ({ page }) => {
  await page.goto('/contact')
  await page.getByLabel('Email').fill('user@example.com')
  await page.getByRole('button', { name: 'Submit' }).click()
  // Returns immediately - doesn't wait for element to appear
  const isVisible = await page.getByText('Message sent successfully').isVisible()
  expect(isVisible).toBe(true) // May fail if element appears after a delay
})
```

**Common Web-First Assertions:**

```typescript
// Visibility
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()
// Text content
await expect(locator).toHaveText('Expected text')
await expect(locator).toContainText('Partial text')
// Attributes
await expect(locator).toHaveAttribute('href', '/dashboard')
await expect(locator).toHaveClass(/active/)
// State
await expect(locator).toBeEnabled()
await expect(locator).toBeDisabled()
await expect(locator).toBeChecked()
// Count
await expect(locator).toHaveCount(5)
// URL
await expect(page).toHaveURL(/.*dashboard/)
await expect(page).toHaveTitle('Dashboard')
```

#### Avoid Manual Waits

Never use arbitrary timeouts. Trust Playwright's auto-waiting.
**✅ GOOD - Use auto-waiting:**

```typescript
test('data loads after API call', async ({ page }) => {
  await page.goto('/dashboard')
  // Playwright waits for button to be clickable
  await page.getByRole('button', { name: 'Load Data' }).click()
  // Waits for data to appear (retries until timeout)
  await expect(page.getByRole('table')).toBeVisible()
  await expect(page.getByRole('row')).toHaveCount(10)
})
```

**❌ BAD - Manual timeouts:**

```typescript
test('data loads after API call', async ({ page }) => {
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Load Data' }).click()
  // Fragile - might not be enough time, or wastes time if faster
  await page.waitForTimeout(3000)
  await expect(page.getByRole('table')).toBeVisible()
})
```

**When explicit waits ARE needed:**

```typescript
// Wait for specific load state
await page.waitForLoadState('networkidle')
// Wait for specific selector
await page.waitForSelector('.data-loaded')
// Wait for URL
await page.waitForURL('**/dashboard')
// Wait for response
const response = await page.waitForResponse('**/api/data')
```

#### Use Soft Assertions for Multiple Checks

Soft assertions don't terminate test execution immediately, allowing you to see all failures.
**✅ GOOD - Soft assertions for comprehensive validation:**

```typescript
test('product card displays all information', async ({ page }) => {
  await page.goto('/products/123')
  // All assertions run even if some fail
  await expect.soft(page.getByRole('heading', { name: 'Product Name' })).toBeVisible()
  await expect.soft(page.getByText('$99.99')).toBeVisible()
  await expect.soft(page.getByRole('img', { name: 'Product image' })).toBeVisible()
  await expect.soft(page.getByText('In stock')).toBeVisible()
  await expect.soft(page.getByRole('button', { name: 'Add to cart' })).toBeEnabled()
  // Test fails if ANY soft assertion failed
})
```

**❌ BAD - Regular assertions stop at first failure:**

```typescript
test('product card displays all information', async ({ page }) => {
  await page.goto('/products/123')
  // Stops at first failure - won't see other issues
  await expect(page.getByRole('heading', { name: 'Product Name' })).toBeVisible()
  await expect(page.getByText('$99.99')).toBeVisible() // If this fails, rest don't run
  await expect(page.getByRole('img', { name: 'Product image' })).toBeVisible()
  await expect(page.getByText('In stock')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Add to cart' })).toBeEnabled()
})
```

### Anti-Patterns to Avoid

#### ❌ Don't Use `page.waitForTimeout()`

```typescript
// BAD - Arbitrary wait
await page.waitForTimeout(5000)
// GOOD - Wait for specific condition
await expect(page.getByText('Loaded')).toBeVisible()
```

#### ❌ Don't Use Implementation Details in Selectors

```typescript
// BAD - CSS classes, IDs, internal structure
await page.locator('#submit-btn-2023-v2').click()
await page.locator('.components__Button__submit').click()
// GOOD - User-facing attributes
await page.getByRole('button', { name: 'Submit' }).click()
```

#### ❌ Don't Chain `.isVisible()` or `.isEnabled()` with `expect()`

```typescript
// BAD - No auto-waiting
expect(await page.getByText('Welcome').isVisible()).toBe(true)
// GOOD - Auto-waiting
await expect(page.getByText('Welcome')).toBeVisible()
```

#### ❌ Don't Test External Services

```typescript
// BAD - Testing GitHub's login (out of your control)
test('can log in to GitHub', async ({ page }) => {
  await page.goto('https://github.com/login')
  // ...
})
// GOOD - Test YOUR app's GitHub integration
test('can connect GitHub account', async ({ page }) => {
  await page.route('**/api/github/**', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ user: 'testuser' }) })
  })
  await page.goto('/settings/integrations')
  await page.getByRole('button', { name: 'Connect GitHub' }).click()
  await expect(page.getByText('GitHub account connected')).toBeVisible()
})
```

---

## Navigation

[← Part 7](./07-testing-principles.md) | [Part 9 →](./09-test-execution-strategies.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-testing-approach.md) | [Part 4](./04-managing-red-tests-with-fixme.md) | [Part 5](./05-quick-reference-when-to-write-tests.md) | [Part 6](./06-test-file-naming-convention.md) | [Part 7](./07-testing-principles.md) | **Part 8** | [Part 9](./09-test-execution-strategies.md) | [Part 10](./10-best-practices-summary.md) | [Part 11](./11-anti-patterns-to-avoid.md) | [Part 12](./12-enforcement-and-code-review.md) | [Part 13](./13-references.md)
