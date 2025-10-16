import { test, expect } from '../fixtures'

/**
 * E2E Tests for App Version Badge Display
 *
 * These tests specify the behavior of displaying the app version in a badge
 * on the DefaultHomePage. They are written in the RED phase of TDD and will
 * fail initially because the implementation doesn't exist yet.
 *
 * Specification:
 * - When an app has a `version` property, display it in a badge below the app name
 * - Badge should be visible and accessible via data-testid="app-version-badge"
 * - Badge should contain the exact version text
 * - When app has no version, badge should NOT be rendered
 * - Support all SemVer formats (simple, pre-release, build metadata)
 *
 * Why these tests will fail:
 * - DefaultHomePage currently only renders app name (line 35 in DefaultHomePage.tsx)
 * - No Badge component import or usage exists
 * - No conditional rendering logic for optional version property
 * - No data-testid="app-version-badge" attribute exists
 *
 * Implementation checklist (for GREEN phase agent):
 * 1. Import Badge component from '@/presentation/components/ui/badge'
 * 2. Add conditional rendering: {app.version && <Badge>...</Badge>}
 * 3. Add data-testid="app-version-badge" to Badge element
 * 4. Display app.version text inside Badge
 * 5. Position badge below app name with appropriate spacing
 */

test.describe('AppSchema - Version Badge Display', () => {
  /**
   * Test Case 1: App with simple version number
   *
   * GIVEN: An app with name and simple SemVer version (1.0.0)
   * WHEN: User navigates to the home page
   * THEN: Version badge should be visible below app name with correct version text
   *
   * Why this will fail:
   * - No badge element exists in DefaultHomePage
   * - locator('[data-testid="app-version-badge"]') will not find any element
   */
  // @spec - Validates version badge display
  test.fixme(
    'should display version badge when app has version',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name and version
      await startServerWithSchema({
        name: 'test-app',
        version: '1.0.0',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The version badge should be visible
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeVisible()

      // AND: The badge should contain the version text
      await expect(badge).toHaveText('1.0.0')
    }
  )

  /**
   * Test Case 2: App without version (optional property)
   *
   * GIVEN: An app with only name (no version property)
   * WHEN: User navigates to the home page
   * THEN: Version badge should NOT be rendered
   *
   * Why this will fail:
   * - Test expects badge to not exist, but current implementation doesn't
   *   have any badge rendering logic (conditional or otherwise)
   * - This test might pass accidentally if implementation is missing
   * - This validates that version is truly optional and doesn't break UI
   */
  // @spec - Validates optional version property
  test(
    'should not display version badge when app has no version',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name only (no version)
      await startServerWithSchema({
        name: 'test-app-no-version',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The version badge should not exist in the DOM
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeHidden()
      await expect(badge).toHaveCount(0)
    }
  )

  /**
   * Test Case 3: Pre-release version format
   *
   * GIVEN: An app with pre-release version (2.0.0-beta.1)
   * WHEN: User navigates to the home page
   * THEN: Badge should display pre-release version exactly as specified
   *
   * Why this will fail:
   * - No badge element exists to display any version format
   * - Validates that version rendering preserves SemVer pre-release identifiers
   */
  // @spec - Validates pre-release version format
  test.fixme(
    'should display pre-release version in badge',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with pre-release version
      await startServerWithSchema({
        name: 'beta-app',
        version: '2.0.0-beta.1',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The version badge should display the pre-release version
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText('2.0.0-beta.1')
    }
  )

  /**
   * Test Case 4: Version with build metadata
   *
   * GIVEN: An app with build metadata in version (1.0.0+build.123)
   * WHEN: User navigates to the home page
   * THEN: Badge should display version with build metadata intact
   *
   * Why this will fail:
   * - No badge element exists to display any version format
   * - Validates that version rendering preserves SemVer build metadata
   */
  // FIXME: Implement version badge display in DefaultHomePage (RED phase - feature not implemented)
  test.fixme(
    'should display version with build metadata in badge',
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with version containing build metadata
      await startServerWithSchema({
        name: 'build-app',
        version: '1.0.0+build.123',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The version badge should display the version with build metadata
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText('1.0.0+build.123')
    }
  )

  /**
   * Test Case 5: Complex version format (pre-release + build metadata)
   *
   * GIVEN: An app with both pre-release and build metadata (1.0.0-alpha+001)
   * WHEN: User navigates to the home page
   * THEN: Badge should display complete version string
   *
   * Why this will fail:
   * - No badge element exists to display any version format
   * - Validates full SemVer specification support
   */
  // FIXME: Implement version badge display in DefaultHomePage (RED phase - feature not implemented)
  test.fixme(
    'should display complex version format in badge',
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with complex version format
      await startServerWithSchema({
        name: 'complex-version-app',
        version: '1.0.0-alpha+001',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The version badge should display the complete version string
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText('1.0.0-alpha+001')
    }
  )

  /**
   * Test Case 6: Badge positioning relative to app name
   *
   * GIVEN: An app with name and version
   * WHEN: User navigates to the home page
   * THEN: Badge should appear after (below) the app name heading
   *
   * Why this will fail:
   * - No badge element exists in the DOM
   * - Tests that badge is positioned correctly in the layout
   * - Validates visual hierarchy (name first, version second)
   */
  // FIXME: Implement version badge display in DefaultHomePage (RED phase - feature not implemented)
  test.fixme(
    'should display version badge below app name',
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name and version
      await startServerWithSchema({
        name: 'layout-test-app',
        version: '1.2.3',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: App name should be visible as h1
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('layout-test-app')

      // AND: Version badge should exist in the DOM
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText('1.2.3')

      // AND: Badge should appear after heading in DOM order
      // (This validates semantic structure for screen readers)
      const container = page.locator('.space-y-6')
      const children = container.locator('> *')
      const headingIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.tagName === 'H1')
      )
      const badgeIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-version-badge')
      )

      expect(badgeIndex).toBeGreaterThan(headingIndex)
    }
  )

  /**
   * Test Case 7: Badge accessibility attributes
   *
   * GIVEN: An app with version
   * WHEN: User navigates to the home page
   * THEN: Badge should have proper accessibility attributes
   *
   * Why this will fail:
   * - No badge element exists with required data-testid attribute
   * - Validates that badge is testable and accessible
   */
  // FIXME: Implement version badge display in DefaultHomePage (RED phase - feature not implemented)
  test.fixme('should have accessible badge element', async ({ page, startServerWithSchema }) => {
    // GIVEN: A server configured with app version
    await startServerWithSchema({
      name: 'accessible-app',
      version: '3.2.1',
    })

    // WHEN: User navigates to the homepage
    await page.goto('/')

    // THEN: Badge should have data-testid for testing
    const badge = page.locator('[data-testid="app-version-badge"]')
    await expect(badge).toBeVisible()

    // AND: Badge should be a span element (default Badge component behavior)
    await expect(badge).toHaveAttribute('data-slot', 'badge')
  })
})
