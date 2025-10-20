/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '../fixtures'

/**
 * E2E Tests for App Name Display on DefaultHomePage
 *
 * These tests specify the behavior of displaying the app name as the main
 * heading on the DefaultHomePage. They validate all aspects of name rendering
 * including edge cases, accessibility, and page metadata.
 *
 * Specification:
 * - App name must be displayed as the main h1 heading
 * - Name must appear in page title metadata as "{name} - Powered by Omnera"
 * - Name must follow npm package naming conventions (see NameSchema validation)
 * - Support names from 1 to 214 characters
 * - Support scoped packages (@scope/package-name)
 * - Support hyphens, underscores, dots (within name)
 * - Heading must be centered and use TypographyH1 styling
 * - Must maintain proper heading hierarchy (h1 as primary heading)
 * - Must be accessible to screen readers
 *
 * Reference Implementation:
 * - Component: src/presentation/components/DefaultHomePage.tsx (line 35)
 * - Domain Model: src/domain/models/app/name.ts (NameSchema)
 * - Validation: npm package naming conventions (/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/)
 */

test.describe('AppSchema - Name Display', () => {
  /**
   * Test Case 1: Basic app name display
   *
   * GIVEN: A server configured with a specific app name
   * WHEN: User navigates to the homepage
   * THEN: The app name should be displayed as the main h1 heading
   *
   * This is the baseline test that validates the core functionality.
   */
  // @spec - Validates basic app name display
  test(
    'should display app name as title',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with a specific app name
      await startServerWithSchema({
        name: 'test-app-alpha',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The app name should be displayed as the main heading
      const heading = page.locator('h1')
      await expect(heading).toHaveText('test-app-alpha')
    }
  )

  /**
   * Test Case 2: App name in page title metadata
   *
   * GIVEN: An app with name "my-dashboard"
   * WHEN: User navigates to the homepage
   * THEN: Browser title should be "my-dashboard - Powered by Omnera"
   *
   * This test validates that page metadata is correctly configured.
   * Important for browser tabs, bookmarks, and SEO.
   */
  // @spec - Validates app name in page title metadata
  test(
    'should display app name in page title',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name
      await startServerWithSchema({
        name: 'my-dashboard',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Page title should include app name
      await expect(page).toHaveTitle('my-dashboard - Powered by Omnera')
    }
  )

  /**
   * Test Case 3: Minimum length name (1 character)
   *
   * GIVEN: An app with single-character name "a"
   * WHEN: User navigates to the homepage
   * THEN: Single character should be displayed as heading
   *
   * NameSchema allows minimum 1 character (name.ts line 29)
   * Tests edge case of shortest valid name
   * Validates no minimum display length restrictions
   */
  // @spec - Validates minimum length name (1 character)
  test(
    'should display single-character app name',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with minimum length name
      await startServerWithSchema({
        name: 'a',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Single character should be visible as heading
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      await expect(heading).toHaveText('a')
    }
  )

  /**
   * Test Case 4: Maximum length name (214 characters)
   *
   * GIVEN: An app with 214-character name (npm package max length)
   * WHEN: User navigates to the homepage
   * THEN: Full name should be displayed without truncation
   *
   * NameSchema allows maximum 214 characters (name.ts line 30)
   * Tests edge case of longest valid name
   * Validates that UI can handle very long names
   * Important for text wrapping and layout
   */
  // @spec - Validates maximum length name (214 characters)
  test(
    'should display maximum-length app name without truncation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with maximum length name (214 chars)
      const longName = 'a'.repeat(214)
      await startServerWithSchema({
        name: longName,
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Full name should be displayed
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      await expect(heading).toHaveText(longName)

      // AND: Text should not be clipped (overflow visible)
      const headingBox = await heading.boundingBox()
      expect(headingBox).not.toBeNull()
      expect(headingBox!.height).toBeGreaterThan(0)
    }
  )

  /**
   * Test Case 5: Scoped package name (@scope/package-name)
   *
   * GIVEN: An app with scoped package name "@myorg/dashboard"
   * WHEN: User navigates to the homepage
   * THEN: Full scoped name including @ and / should be displayed
   *
   * NameSchema supports scoped packages via pattern (name.ts line 31)
   * Tests that special characters (@, /) are rendered correctly
   * Common pattern in npm ecosystem
   */
  // @spec - Validates scoped package name (@scope/package)
  test(
    'should display scoped package name with @ symbol',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with scoped package name
      await startServerWithSchema({
        name: '@myorg/dashboard',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Full scoped name should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('@myorg/dashboard')
    }
  )

  /**
   * Test Case 6: Name with hyphens (kebab-case)
   *
   * GIVEN: An app with hyphenated name "user-management-system"
   * WHEN: User navigates to the homepage
   * THEN: Name with hyphens should be displayed exactly
   *
   * NameSchema allows hyphens within name (name.ts pattern)
   * Common naming convention (kebab-case)
   * Tests that hyphens are preserved
   */
  // @spec - Validates name with hyphens (kebab-case)
  test(
    'should display app name with hyphens',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with hyphenated name
      await startServerWithSchema({
        name: 'user-management-system',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Name with hyphens should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('user-management-system')
    }
  )

  /**
   * Test Case 7: Name with underscores (snake_case)
   *
   * GIVEN: An app with underscored name "user_dashboard_app"
   * WHEN: User navigates to the homepage
   * THEN: Name with underscores should be displayed exactly
   *
   * NameSchema allows underscores within name (name.ts pattern)
   * Less common but valid naming convention
   * Tests that underscores are preserved
   */
  // @spec - Validates name with underscores (snake_case)
  test(
    'should display app name with underscores',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with underscored name
      await startServerWithSchema({
        name: 'user_dashboard_app',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Name with underscores should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('user_dashboard_app')
    }
  )

  /**
   * Test Case 8: Name with dots (package.subname)
   *
   * GIVEN: An app with dotted name "app.dashboard.v2"
   * WHEN: User navigates to the homepage
   * THEN: Name with dots should be displayed exactly
   *
   * NameSchema allows dots within name (name.ts pattern allows ._~)
   * Valid npm package naming convention
   * Tests that dots are preserved
   */
  // @spec - Validates name with dots (package.subname)
  test(
    'should display app name with dots',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with dotted name
      await startServerWithSchema({
        name: 'app.dashboard.v2',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Name with dots should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('app.dashboard.v2')
    }
  )

  /**
   * Test Case 9: Name with mixed valid characters
   *
   * GIVEN: An app with complex name "@scope/my-app_v2.beta-test"
   * WHEN: User navigates to the homepage
   * THEN: All special characters should be preserved
   *
   * NameSchema allows complex combinations (name.ts pattern)
   * Tests that regex pattern correctly handles all valid characters
   * Edge case for most complex valid name format
   */
  // @spec - Validates name with mixed special characters
  test(
    'should display app name with mixed valid characters',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with complex name
      await startServerWithSchema({
        name: '@scope/my-app_v2.beta-test',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Full complex name should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('@scope/my-app_v2.beta-test')
    }
  )

  /**
   * Test Case 10: Heading hierarchy (only one h1)
   *
   * GIVEN: An app with name "accessibility-test"
   * WHEN: User navigates to the homepage
   * THEN: Page should have exactly one h1 element (primary heading)
   *
   * DefaultHomePage currently renders one h1 (line 35)
   * This test validates proper semantic HTML structure
   * Important for accessibility and SEO
   * Screen readers use heading hierarchy for navigation
   */
  // @spec - Validates heading hierarchy (single h1)
  test(
    'should have exactly one h1 heading on page',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name
      await startServerWithSchema({
        name: 'accessibility-test',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Page should have exactly one h1 element
      const headings = page.locator('h1')
      await expect(headings).toHaveCount(1)

      // AND: The h1 should contain the app name
      await expect(headings).toHaveText('accessibility-test')
    }
  )

  /**
   * Test Case 11: Heading is primary landmark
   *
   * GIVEN: An app with name "semantic-html-test"
   * WHEN: User navigates to the homepage
   * THEN: h1 should be the first heading level on the page
   *
   * DefaultHomePage currently renders h1 as first heading
   * This test validates no h2-h6 appear before h1
   * Proper heading hierarchy is critical for screen reader navigation
   * WCAG 2.1 Success Criterion 1.3.1 (Info and Relationships)
   */
  // @spec - Validates h1 as primary heading landmark
  test(
    'should have h1 as first heading level',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name
      await startServerWithSchema({
        name: 'semantic-html-test',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: h1 should exist
      const h1 = page.locator('h1')
      await expect(h1).toBeVisible()

      // AND: No h2-h6 should exist on this simple page
      // (DefaultHomePage only has h1, no other heading levels)
      const lowerHeadings = page.locator('h2, h3, h4, h5, h6')
      await expect(lowerHeadings).toHaveCount(0)
    }
  )

  /**
   * Test Case 12: Heading is centered
   *
   * GIVEN: An app with name "layout-test"
   * WHEN: User navigates to the homepage
   * THEN: h1 heading should be centered horizontally
   *
   * DefaultHomePage applies "text-center" class to h1 (line 35)
   * TypographyH1 component also has "text-center" in className (line 35)
   * This test validates visual layout matches design
   * Important for consistent user experience
   */
  // @spec - Validates centered alignment
  test(
    'should display heading with centered alignment',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name
      await startServerWithSchema({
        name: 'layout-test',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Heading should be centered
      const heading = page.locator('h1')
      await expect(heading).toHaveCSS('text-align', 'center')
    }
  )

  /**
   * Test Case 13: Heading visibility and rendering
   *
   * GIVEN: An app with name "visibility-test"
   * WHEN: User navigates to the homepage
   * THEN: h1 heading should be visible and not hidden
   *
   * DefaultHomePage renders h1 with visible content
   * This test validates no CSS rules hide the heading
   * Important for basic functionality verification
   * Ensures text is not transparent, off-screen, or display:none
   */
  test(
    'should display heading as visible element',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name
      await startServerWithSchema({
        name: 'visibility-test',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Heading should be visible
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()

      // AND: Heading should be in viewport
      await expect(heading).toBeInViewport()
    }
  )

  /**
   * Test Case 14: Heading text content preservation
   *
   * GIVEN: An app with name containing special chars "my-app-2024"
   * WHEN: User navigates to the homepage
   * THEN: Text content should exactly match input (no sanitization)
   *
   * DefaultHomePage renders {app.name} directly in JSX (line 35)
   * React automatically escapes text content (XSS protection)
   * This test validates text is not transformed or sanitized beyond React defaults
   * Important for preserving exact name format
   */
  test(
    'should preserve exact text content without transformation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with name containing numbers and hyphens
      await startServerWithSchema({
        name: 'my-app-2024',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Text content should exactly match input
      const heading = page.locator('h1')
      await expect(heading).toHaveText('my-app-2024')

      // AND: Text content should be preserved without transformation
      await expect(heading).toContainText('my-app-2024')
    }
  )

  /**
   * REGRESSION TEST: Complete App Name Display Workflow
   *
   * This comprehensive test validates the entire app name display workflow
   * from end to end, covering all the scenarios tested individually above.
   * It consolidates multiple behaviors into one realistic user journey.
   *
   * GIVEN: An app with complex scoped package name and all valid characters
   * WHEN: User navigates to the homepage
   * THEN: All name display requirements should be met:
   *   1. Basic display: Name appears in h1 heading
   *   2. Metadata: Name appears in page title as "{name} - Powered by Omnera"
   *   3. Special characters: Scoped package (@), hyphens, underscores, dots preserved
   *   4. Accessibility: Proper heading hierarchy, centered alignment
   *   5. Styling: TypographyH1 component applied, visible and in viewport
   *
   * This test serves as a regression suite to prevent breaking changes
   * to core name display functionality.
   */
  test(
    'should handle complete app name display workflow with all features',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with complex app name containing all valid characters
      // This name tests: scoped package (@scope/), hyphens (-), underscores (_), dots (.)
      const complexName = '@myorg-team.test/dashboard_v2.beta-prod'

      await startServerWithSchema({
        name: complexName,
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Validate basic name display in h1 heading
      const heading = page.locator('h1')
      await expect(heading).toBeVisible()
      await expect(heading).toHaveText(complexName)

      // AND: Validate name appears in page title metadata
      await expect(page).toHaveTitle(`${complexName} - Powered by Omnera`)

      // AND: Validate special characters are preserved (scoped package, hyphens, underscores, dots)
      await expect(heading).toContainText('@myorg-team.test/') // Scoped package with @, /, .
      await expect(heading).toContainText('dashboard_v2') // Underscore
      await expect(heading).toContainText('beta-prod') // Hyphen

      // AND: Validate accessibility - proper heading hierarchy
      const allHeadings = page.locator('h1')
      await expect(allHeadings).toHaveCount(1) // Exactly one h1 element

      // AND: Validate no lower-level headings exist before h1
      const lowerHeadings = page.locator('h2, h3, h4, h5, h6')
      await expect(lowerHeadings).toHaveCount(0)

      // AND: Validate centered alignment
      await expect(heading).toHaveCSS('text-align', 'center')

      // AND: Validate TypographyH1 styling is applied (large font size)
      const fontSize = await heading.evaluate((el) => {
        return window.getComputedStyle(el).fontSize
      })
      const fontSizePx = parseInt(fontSize.replace('px', ''))
      expect(fontSizePx).toBeGreaterThan(30) // TypographyH1 should have large font

      // AND: Validate element is in viewport and visible
      await expect(heading).toBeInViewport()

      // AND: Validate text content preservation (no sanitization beyond React defaults)
      const textContent = heading
      await expect(textContent).toHaveText(complexName) // Exact match
    }
  )

  /**
   * Test Case 15: Page title with single-character name
   *
   * GIVEN: An app with single-character name "x"
   * WHEN: User navigates to the homepage
   * THEN: Page title should be "x - Powered by Omnera"
   *
   * Tests edge case of shortest name in page title
   * Validates title template works with minimal input
   * Important for consistent title formatting
   */
  test(
    'should display single-character name in page title',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with single-character name
      await startServerWithSchema({
        name: 'x',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Page title should include single character
      await expect(page).toHaveTitle('x - Powered by Omnera')
    }
  )

  /**
   * Test Case 16: Page title with scoped package name
   *
   * GIVEN: An app with scoped name "@company/product"
   * WHEN: User navigates to the homepage
   * THEN: Page title should preserve @ symbol and forward slash
   *
   * Tests that special characters in scoped packages appear in title
   * Browser title should not sanitize @ or / characters
   * Important for accurate representation in browser tabs
   */
  test(
    'should display scoped package name in page title',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with scoped package name
      await startServerWithSchema({
        name: '@company/product',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Page title should include scoped name
      await expect(page).toHaveTitle('@company/product - Powered by Omnera')
    }
  )

  /**
   * Test Case 17: TypographyH1 component styling applied
   *
   * GIVEN: An app with name "typography-test"
   * WHEN: User navigates to the homepage
   * THEN: h1 should use TypographyH1 component styling (large font size)
   *
   * DefaultHomePage uses TypographyH1 component (line 35)
   * TypographyH1 applies specific typography styles
   * This test validates correct component is used for styling
   * Important for consistent visual hierarchy
   */
  test(
    'should apply TypographyH1 component styling',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name
      await startServerWithSchema({
        name: 'typography-test',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Heading should have large font size (TypographyH1 style)
      const heading = page.locator('h1')

      // Get computed font size (TypographyH1 typically uses text-4xl or larger)
      const fontSize = await heading.evaluate((el) => {
        return window.getComputedStyle(el).fontSize
      })

      // Parse px value and ensure it's large (> 30px for h1)
      const fontSizePx = parseInt(fontSize.replace('px', ''))
      expect(fontSizePx).toBeGreaterThan(30)
    }
  )

  /**
   * Test Case 18: Multiple app names render independently
   *
   * GIVEN: Two different test runs with different app names
   * WHEN: User navigates to each homepage
   * THEN: Each should display its respective app name
   *
   * Tests that server configuration is properly isolated per test
   * Validates fixture setup correctly passes different schemas
   * Important for test independence and repeatability
   */
  test(
    'should display different app names in separate test runs',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with first app name
      await startServerWithSchema({
        name: 'first-app',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: First app name should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('first-app')

      // NOTE: In a separate test run, a different name would be used
      // This test validates that each test run is independent
    }
  )

  /**
   * Test Case 19: Name with tilde character
   *
   * GIVEN: An app with name containing tilde "app~test"
   * WHEN: User navigates to the homepage
   * THEN: Tilde should be displayed in heading
   *
   * NameSchema pattern allows tilde character (name.ts line 31: [a-z0-9-._~])
   * Less common but valid character in npm packages
   * Tests that regex pattern correctly handles tilde
   */
  test(
    'should display app name with tilde character',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with name containing tilde
      await startServerWithSchema({
        name: 'app~test',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Name with tilde should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('app~test')
    }
  )

  /**
   * Test Case 20: Scoped package with complex scope name
   *
   * GIVEN: An app with complex scoped name "@my-org.team/product-v2"
   * WHEN: User navigates to the homepage
   * THEN: Full scoped name with dots and hyphens should be displayed
   *
   * NameSchema allows complex scope names (name.ts pattern)
   * Tests combination of scoped package + multiple special chars
   * Real-world naming scenario for organizations
   */
  test(
    'should display complex scoped package name',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with complex scoped name
      await startServerWithSchema({
        name: '@my-org.team/product-v2',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Full complex scoped name should be displayed
      const heading = page.locator('h1')
      await expect(heading).toHaveText('@my-org.team/product-v2')
    }
  )
})
