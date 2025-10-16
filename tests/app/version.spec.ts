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
  test(
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
  test(
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
  // @spec - Validates build metadata in version
  test(
    'should display version with build metadata in badge',
    { tag: '@spec' },
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
  // @spec - Validates complex SemVer format
  test(
    'should display complex version format in badge',
    { tag: '@spec' },
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
   * THEN: Badge should appear before (above) the app name heading
   *
   * Why this will fail:
   * - No badge element exists in the DOM
   * - Tests that badge is positioned correctly in the layout
   * - Validates visual hierarchy (badge as metadata, then prominent title)
   */
  // @spec - Validates badge positioning
  test(
    'should display version badge above app name',
    { tag: '@spec' },
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

      // AND: Badge should appear before heading in DOM order
      // (Badge appears before (above) the app name heading for proper visual hierarchy)
      const container = page.locator('.space-y-6')
      const children = container.locator('> *')
      const headingIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.tagName === 'H1')
      )
      const badgeIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-version-badge')
      )

      expect(badgeIndex).toBeLessThan(headingIndex)
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
  // @spec - Validates accessibility attributes
  test(
    'should have accessible badge element',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
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
    }
  )

  /**
   * REGRESSION TEST: Complete Version Badge Display Workflow
   *
   * This comprehensive test validates the entire version badge display workflow
   * from end to end, covering all the scenarios tested individually above.
   * It consolidates multiple behaviors into one realistic user journey.
   *
   * Test Flow:
   * 1. Test app WITH version: Badge displays with complex SemVer format
   * 2. Test app WITHOUT version: Badge is hidden (optional property)
   * 3. Test badge positioning: Badge appears above app name
   * 4. Test different SemVer formats: Simple, pre-release, build metadata
   *
   * GIVEN: Multiple test scenarios with different version configurations
   * WHEN: User navigates to the homepage for each scenario
   * THEN: All version badge requirements should be met:
   *   1. Badge displays when version is present
   *   2. Badge is hidden when version is absent
   *   3. Badge supports all SemVer formats (simple, pre-release, build metadata)
   *   4. Badge is positioned above app name in DOM order
   *   5. Badge has proper accessibility attributes (data-testid)
   *
   * This test serves as a regression suite to prevent breaking changes
   * to core version badge functionality.
   *
   * Why this will fail:
   * - Version badge feature is not implemented yet
   * - No Badge component import or usage in DefaultHomePage
   * - No conditional rendering logic for optional version property
   */
  test(
    'should handle complete version badge display workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // ============================================================
      // Scenario 1: App WITH version - Complex SemVer format
      // ============================================================

      // GIVEN: A server configured with app name and complex version (pre-release + build)
      const appName = 'regression-test-app'
      const complexVersion = '2.1.0-beta.5+build.abc123'

      await startServerWithSchema({
        name: appName,
        version: complexVersion,
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Validate badge is visible and contains correct version
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText(complexVersion)

      // AND: Validate badge supports complex SemVer format (pre-release + build metadata)
      await expect(badge).toContainText('beta.5') // Pre-release identifier
      await expect(badge).toContainText('build.abc123') // Build metadata

      // AND: Validate badge positioning above app name
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      await expect(heading).toHaveText(appName)

      // Validate DOM order: badge comes before h1
      const container = page.locator('.space-y-6')
      const children = container.locator('> *')
      const headingIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.tagName === 'H1')
      )
      const badgeIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-version-badge')
      )
      expect(badgeIndex).toBeLessThan(headingIndex)

      // AND: Validate badge has accessibility attributes
      await expect(badge).toHaveAttribute('data-slot', 'badge')

      // ============================================================
      // Scenario 2: Test different SemVer formats by updating schema
      // ============================================================

      // Test simple version format (major.minor.patch)
      await startServerWithSchema({
        name: appName,
        version: '1.0.0',
      })
      await page.goto('/')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText('1.0.0')

      // Test pre-release version format (with alpha)
      await startServerWithSchema({
        name: appName,
        version: '3.0.0-alpha.1',
      })
      await page.goto('/')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText('3.0.0-alpha.1')

      // Test version with build metadata only
      await startServerWithSchema({
        name: appName,
        version: '2.5.0+20250116',
      })
      await page.goto('/')
      await expect(badge).toBeVisible()
      await expect(badge).toHaveText('2.5.0+20250116')

      // ============================================================
      // Scenario 3: App WITHOUT version - Badge should be hidden
      // ============================================================

      // GIVEN: A server configured with app name only (no version)
      await startServerWithSchema({
        name: 'no-version-app',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Badge should not exist in the DOM
      const hiddenBadge = page.locator('[data-testid="app-version-badge"]')
      await expect(hiddenBadge).toBeHidden()
      await expect(hiddenBadge).toHaveCount(0)

      // AND: App name should still be visible (version is optional)
      const headingWithoutVersion = page.locator('h1')
      await expect(headingWithoutVersion).toBeVisible()
      await expect(headingWithoutVersion).toHaveText('no-version-app')
    }
  )
})
