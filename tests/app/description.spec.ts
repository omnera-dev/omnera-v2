import { test, expect } from '../fixtures'

/**
 * E2E Tests for App Description Display
 *
 * Test Organization:
 * 1. @spec tests - Granular specification tests (multiple per file)
 * 2. @regression test - ONE consolidated workflow test per file
 * 3. @critical test - Not applicable (description is not a critical feature)
 *
 * These tests specify the behavior of displaying the app description on the
 * DefaultHomePage. They are written in the RED phase of TDD and will fail
 * initially because the implementation doesn't exist yet.
 *
 * Specification:
 * - When app has `description` property, display it AFTER the app name (h1 title)
 * - Description should be visible and accessible via data-testid="app-description"
 * - Description must appear AFTER the h1 element in DOM order (critical positioning)
 * - Description should be rendered as a paragraph (<p>) element
 * - When app has no description, description element should NOT be rendered
 * - Description supports single-line text only (validated by DescriptionSchema)
 * - Description supports Unicode characters, emojis, special characters
 * - Description can be empty string (different from undefined)
 * - Very long descriptions should wrap properly
 *
 */

test.describe('AppSchema - Description Display', () => {
  // ============================================================================
  // SPECIFICATION TESTS (@spec)
  // Granular tests defining acceptance criteria during TDD development
  // Run during: Development, pre-commit (bun test:e2e:spec)
  // ============================================================================

  /**
   * Test Case 1: Basic description display
   *
   * GIVEN: An app with name and description
   * WHEN: User navigates to the homepage
   * THEN: Description should be visible below the app name
   */
  test(
    'should display description when app has description',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name and description
      await startServerWithSchema({
        name: 'test-app',
        description: 'A simple test application for demo purposes',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The description should be visible
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()

      // AND: The description should contain the text
      await expect(description).toHaveText('A simple test application for demo purposes')
    }
  )

  /**
   * Test Case 2: App without description (optional property)
   *
   * GIVEN: An app with only name (no description property)
   * WHEN: User navigates to the homepage
   * THEN: Description element should NOT be rendered
   */
  test(
    'should not display description when app has no description',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name only (no description)
      await startServerWithSchema({
        name: 'test-app-no-desc',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: The description element should not exist in the DOM
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeHidden()
      await expect(description).toHaveCount(0)
    }
  )

  /**
   * Test Case 3: Description positioning AFTER title (CRITICAL REQUIREMENT)
   *
   * GIVEN: An app with name and description
   * WHEN: User navigates to the homepage
   * THEN: Description MUST appear AFTER the h1 title in DOM order
   */
  test(
    'should display description AFTER the app title in DOM order',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name and description
      await startServerWithSchema({
        name: 'positioning-test',
        description: 'This description should appear after the title',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: App title (h1) should be visible
      const title = page.locator('h1')
      await expect(title).toBeVisible()
      await expect(title).toHaveText('positioning-test')

      // AND: Description should exist in the DOM
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()
      await expect(description).toHaveText('This description should appear after the title')

      // AND: Description MUST appear AFTER title in DOM order (CRITICAL)
      // Get the parent container that holds both title and description
      const container = page.locator('.space-y-6')
      const children = container.locator('> *')

      // Find the index of h1 and description in the DOM
      const titleIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.tagName === 'H1')
      )
      const descriptionIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-description')
      )

      // CRITICAL ASSERTION: Description index must be GREATER than title index
      expect(descriptionIndex).toBeGreaterThan(titleIndex)
    }
  )

  /**
   * Test Case 4: Description with special characters
   *
   * GIVEN: An app with description containing special characters
   * WHEN: User navigates to the homepage
   * THEN: Special characters should be displayed correctly
   */
  test(
    'should display description with special characters',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with description containing special characters
      await startServerWithSchema({
        name: 'special-chars-app',
        description: 'My app - with special characters!@#$%^&*()_+={}[]|\\:";\'<>?,./~`',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Description with special characters should be displayed
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()
      await expect(description).toHaveText(
        'My app - with special characters!@#$%^&*()_+={}[]|\\:";\'<>?,./~`'
      )
    }
  )

  /**
   * Test Case 5: Description with Unicode characters and emojis
   *
   * GIVEN: An app with description containing Unicode and emojis
   * WHEN: User navigates to the homepage
   * THEN: Unicode characters and emojis should be displayed correctly
   */
  test(
    'should display description with Unicode characters and emojis',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with Unicode and emoji description
      await startServerWithSchema({
        name: 'unicode-app',
        description: 'Très bien! 你好 🎉 Welcome to our app 🚀 مرحبا',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Description with Unicode and emojis should be displayed
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()
      await expect(description).toHaveText('Très bien! 你好 🎉 Welcome to our app 🚀 مرحبا')
    }
  )

  /**
   * Test Case 6: Very long description text wrapping
   *
   * GIVEN: An app with very long description (500+ characters)
   * WHEN: User navigates to the homepage
   * THEN: Description should wrap properly and remain visible
   */
  test(
    'should display very long description with proper text wrapping',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with very long description
      const longDescription =
        'This is a very long description that should wrap properly in the UI layout without breaking the design. '.repeat(
          10
        )

      await startServerWithSchema({
        name: 'long-desc-app',
        description: longDescription,
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Long description should be visible
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()
      await expect(description).toHaveText(longDescription)

      // AND: Text should wrap (element height should be greater than single line)
      const descriptionBox = await description.boundingBox()
      expect(descriptionBox).not.toBeNull()
      expect(descriptionBox!.height).toBeGreaterThan(20) // Multi-line text
    }
  )

  /**
   * Test Case 7: Empty string description
   *
   * GIVEN: An app with empty string description (not undefined)
   * WHEN: User navigates to the homepage
   * THEN: Description element should NOT be rendered (empty strings are treated as no description)
   */
  test(
    'should not display description when description is empty string',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with empty string description
      await startServerWithSchema({
        name: 'empty-desc-app',
        description: '',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Description element should not be rendered
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeHidden()
      await expect(description).toHaveCount(0)
    }
  )

  /**
   * Test Case 8: Description semantic HTML structure
   *
   * GIVEN: An app with description
   * WHEN: User navigates to the homepage
   * THEN: Description should be rendered as a paragraph (<p>) element
   */
  test(
    'should render description as paragraph element',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app description
      await startServerWithSchema({
        name: 'semantic-test',
        description: 'A semantic HTML test description',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Description should be a <p> element
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()

      // Verify it's a paragraph element
      const tagName = await description.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('p')
    }
  )

  /**
   * Test Case 9: Description centered alignment
   *
   * GIVEN: An app with description
   * WHEN: User navigates to the homepage
   * THEN: Description should be centered horizontally
   */
  test(
    'should display description with centered alignment',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app description
      await startServerWithSchema({
        name: 'centered-app',
        description: 'This description should be centered',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Description should be centered
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toHaveCSS('text-align', 'center')
    }
  )

  /**
   * Test Case 10: Description visibility and rendering
   *
   * GIVEN: An app with description
   * WHEN: User navigates to the homepage
   * THEN: Description should be visible and in viewport
   */
  test(
    'should display description as visible element in viewport',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app description
      await startServerWithSchema({
        name: 'visibility-test',
        description: 'This description should be visible',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Description should be visible
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()

      // AND: Description should be in viewport
      await expect(description).toBeInViewport()
    }
  )

  /**
   * Test Case 11: Description text content preservation
   *
   * GIVEN: An app with description containing mixed case, special chars, and whitespace
   * WHEN: User navigates to the homepage
   * THEN: Text content should exactly match input (no transformation)
   */
  test(
    'should preserve exact text content without transformation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with description containing:
      // - Mixed case (uppercase, lowercase)
      // - Special characters (punctuation, symbols)
      // - Numbers
      // - Unicode characters
      // This tests that NO transformation happens (no toLowerCase, toUpperCase, trim, etc.)
      const exactDescription = 'MyApp v2.0 - Build FAST! Cost: $99.99 (50% off) 🎉 Très bien!'

      await startServerWithSchema({
        name: 'preservation-test',
        description: exactDescription,
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Text content should EXACTLY match input (character-for-character)
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()

      // Validate exact text preservation (no case changes, no trimming, no transformations)
      await expect(description).toHaveText(exactDescription)

      // Additional verification: Check textContent directly (not innerHTML)
      const textContent = description
      await expect(textContent).toHaveText(exactDescription)

      // Verify specific case preservation (no toLowerCase/toUpperCase applied)
      expect(textContent).toContain('MyApp') // Capital M, capital A
      expect(textContent).toContain('FAST!') // All caps with exclamation
      expect(textContent).toContain('v2.0') // Lowercase v

      // Verify special character preservation
      expect(textContent).toContain('$99.99') // Dollar sign and decimal
      expect(textContent).toContain('(50% off)') // Parentheses and percent
      expect(textContent).toContain('🎉') // Emoji
      expect(textContent).toContain('Très bien!') // Accented character

      // Verify no trimming happened (preserve leading/trailing if present)
      expect(textContent!.length).toBe(exactDescription.length)
    }
  )

  /**
   * Test Case 12: Complete layout with version, title, and description
   *
   * GIVEN: An app with version, name, and description
   * WHEN: User navigates to the homepage
   * THEN: All elements should appear in correct order: version → title → description
   */
  test(
    'should display version, title, and description in correct order',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with version, name, and description
      await startServerWithSchema({
        name: 'full-layout-test',
        version: '2.0.0',
        description: 'A complete layout with all elements',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: All three elements should be visible
      const badge = page.locator('[data-testid="app-version-badge"]')
      const title = page.locator('h1')
      const description = page.locator('[data-testid="app-description"]')

      await expect(badge).toBeVisible()
      await expect(title).toBeVisible()
      await expect(description).toBeVisible()

      // AND: Elements should be in correct order: badge → title → description
      const container = page.locator('.space-y-6')
      const children = container.locator('> *')

      const badgeIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-version-badge')
      )
      const titleIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.tagName === 'H1')
      )
      const descriptionIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-description')
      )

      // Verify order: badge < title < description
      expect(badgeIndex).toBeLessThan(titleIndex)
      expect(titleIndex).toBeLessThan(descriptionIndex)
    }
  )

  /**
   * Test Case 13: Description with maximum allowed characters
   *
   * GIVEN: An app with very long description (1000+ characters)
   * WHEN: User navigates to the homepage
   * THEN: Full description should be displayed without truncation
   */
  test(
    'should display maximum-length description without truncation',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with very long description (1000 chars)
      const maxDescription =
        'Full-featured e-commerce platform with shopping cart, checkout flow, payment processing, inventory management, user authentication, order tracking, customer support, email notifications, analytics dashboard, and mobile-responsive design. Built with modern technologies for scalability and performance. Supports multiple payment gateways, international shipping, tax calculations, coupon codes, product reviews, wishlist functionality, and real-time inventory updates. Includes admin panel for managing products, orders, and customers. '.repeat(
          2
        )

      await startServerWithSchema({
        name: 'max-desc-app',
        description: maxDescription,
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Full description should be displayed
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()
      await expect(description).toHaveText(maxDescription)

      // AND: Text should wrap properly (multi-line)
      const descriptionBox = await description.boundingBox()
      expect(descriptionBox).not.toBeNull()
      expect(descriptionBox!.height).toBeGreaterThan(50) // Definitely multi-line
    }
  )

  /**
   * Test Case 14: Description with HTML-like content (XSS prevention)
   *
   * GIVEN: An app with description containing HTML-like tags
   * WHEN: User navigates to the homepage
   * THEN: HTML tags should be escaped and displayed as text (not rendered as HTML)
   */
  test(
    'should escape HTML-like content in description',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with description containing HTML-like tags
      await startServerWithSchema({
        name: 'xss-test-app',
        description: '<script>alert("test")</script> <b>Bold text</b> <a href="#">Link</a>',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: HTML tags should be escaped and displayed as plain text
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()

      // Text should contain literal HTML tags (escaped)
      await expect(description).toHaveText(
        '<script>alert("test")</script> <b>Bold text</b> <a href="#">Link</a>'
      )

      // Verify no actual HTML elements were created (security check)
      // The description script tag should NOT be executed
      const descriptionHtml = await description.innerHTML()
      expect(descriptionHtml).not.toContain('<script>')
      expect(descriptionHtml).not.toContain('<b>')
      expect(descriptionHtml).not.toContain('<a href')
    }
  )

  /**
   * Test Case 15: Description spacing below title
   *
   * GIVEN: An app with name and description
   * WHEN: User navigates to the homepage
   * THEN: There should be appropriate spacing between title and description
   */
  test(
    'should have appropriate spacing between title and description',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: A server configured with app name and description
      await startServerWithSchema({
        name: 'spacing-test',
        description: 'Testing spacing between title and description',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Both elements should be visible
      const title = page.locator('h1')
      const description = page.locator('[data-testid="app-description"]')
      await expect(title).toBeVisible()
      await expect(description).toBeVisible()

      // AND: There should be vertical spacing between them
      const titleBox = await title.boundingBox()
      const descriptionBox = await description.boundingBox()

      expect(titleBox).not.toBeNull()
      expect(descriptionBox).not.toBeNull()

      // Description top should be below title bottom (with gap)
      expect(descriptionBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height)

      // There should be a gap (space-y-6 = 1.5rem = 24px in Tailwind)
      const gap = descriptionBox!.y - (titleBox!.y + titleBox!.height)
      expect(gap).toBeGreaterThan(10) // At least some spacing
    }
  )

  // ============================================================================
  // REGRESSION TEST (@regression)
  // ONE consolidated test covering complete workflow
  // Run during: CI/CD, pre-release (bun test:e2e:ci)
  // ============================================================================

  /**
   * REGRESSION TEST: Complete App Description Display Workflow
   *
   * This comprehensive test validates the entire app description display workflow
   * from end to end, covering all the scenarios tested individually above.
   * It consolidates multiple behaviors into one realistic user journey.
   *
   * GIVEN: Apps with various description configurations
   * WHEN: User navigates to homepage for each scenario
   * THEN: All description display requirements should be met:
   *   1. Basic display: Description appears below title when present
   *   2. Optional property: No description element when omitted or empty string
   *   3. Positioning: Description AFTER h1 title in DOM order (CRITICAL)
   *   4. Special characters: Unicode, emojis, special chars preserved
   *   5. Long text: Very long descriptions wrap properly
   *   6. Semantic HTML: Rendered as <p> element
   *   7. Styling: Centered alignment, visible in viewport
   *   8. Security: HTML-like content is escaped (XSS prevention)
   *   9. Layout: Proper spacing between title and description
   *   10. Integration: Version → Title → Description order when all present
   *
   * This test serves as a regression suite to prevent breaking changes
   * to core description display functionality.
   */
  test(
    'user can view complete app description with all features',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // ============================================================
      // Scenario 1: App WITH description - Complex text with special chars
      // ============================================================

      // GIVEN: A server configured with app name and complex description
      const appName = 'regression-test-app'
      const complexDescription =
        'Full-featured platform 🚀 with special chars!@#$% and Unicode 你好 - très bien!'

      await startServerWithSchema({
        name: appName,
        version: '1.5.0',
        description: complexDescription,
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Validate description is visible with correct text
      const description = page.locator('[data-testid="app-description"]')
      await expect(description).toBeVisible()
      await expect(description).toHaveText(complexDescription)

      // AND: Validate description supports special characters and Unicode
      await expect(description).toContainText('🚀') // Emoji
      await expect(description).toContainText('!@#$%') // Special chars
      await expect(description).toContainText('你好') // Unicode
      await expect(description).toContainText('très bien') // Accented chars

      // AND: Validate CRITICAL positioning: description AFTER title in DOM
      const title = page.locator('h1')
      await expect(title).toBeVisible()
      await expect(title).toHaveText(appName)

      const container = page.locator('.space-y-6')
      const children = container.locator('> *')

      const titleIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.tagName === 'H1')
      )
      const descriptionIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-description')
      )

      // CRITICAL: Description must be AFTER title
      expect(descriptionIndex).toBeGreaterThan(titleIndex)

      // AND: Validate complete layout order: version → title → description
      const badge = page.locator('[data-testid="app-version-badge"]')
      await expect(badge).toBeVisible()

      const badgeIndex = await children.evaluateAll((elements) =>
        elements.findIndex((el) => el.getAttribute('data-testid') === 'app-version-badge')
      )

      expect(badgeIndex).toBeLessThan(titleIndex)
      expect(titleIndex).toBeLessThan(descriptionIndex)

      // AND: Validate semantic HTML structure (paragraph element)
      const tagName = await description.evaluate((el) => el.tagName.toLowerCase())
      expect(tagName).toBe('p')

      // AND: Validate centered alignment
      await expect(description).toHaveCSS('text-align', 'center')

      // AND: Validate visibility and viewport positioning
      await expect(description).toBeInViewport()

      // AND: Validate spacing between title and description
      const titleBox = await title.boundingBox()
      const descriptionBox = await description.boundingBox()
      expect(descriptionBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height)
      const gap = descriptionBox!.y - (titleBox!.y + titleBox!.height)
      expect(gap).toBeGreaterThan(10) // Appropriate spacing

      // ============================================================
      // Scenario 2: Test very long description with wrapping
      // ============================================================

      const longDescription =
        'This is a very long description that tests text wrapping behavior in the UI layout. '.repeat(
          10
        )

      await startServerWithSchema({
        name: appName,
        description: longDescription,
      })
      await page.goto('/')

      const longDesc = page.locator('[data-testid="app-description"]')
      await expect(longDesc).toBeVisible()
      await expect(longDesc).toHaveText(longDescription)

      // Validate multi-line wrapping
      const longDescBox = await longDesc.boundingBox()
      expect(longDescBox!.height).toBeGreaterThan(20) // Multi-line

      // ============================================================
      // Scenario 3: Test HTML escaping (XSS prevention)
      // ============================================================

      await startServerWithSchema({
        name: appName,
        description: '<script>alert("xss")</script> <b>Bold</b>',
      })
      await page.goto('/')

      const xssDesc = page.locator('[data-testid="app-description"]')
      await expect(xssDesc).toBeVisible()
      await expect(xssDesc).toHaveText('<script>alert("xss")</script> <b>Bold</b>')

      // Verify HTML is escaped (not rendered)
      const xssHtml = await xssDesc.innerHTML()
      expect(xssHtml).not.toContain('<script>')
      expect(xssHtml).not.toContain('<b>')

      // ============================================================
      // Scenario 4: App WITHOUT description - Element should not exist
      // ============================================================

      // GIVEN: A server configured with app name only (no description)
      await startServerWithSchema({
        name: 'no-description-app',
      })

      // WHEN: User navigates to the homepage
      await page.goto('/')

      // THEN: Description element should not exist in the DOM
      const hiddenDesc = page.locator('[data-testid="app-description"]')
      await expect(hiddenDesc).toBeHidden()
      await expect(hiddenDesc).toHaveCount(0)

      // AND: App name should still be visible (description is optional)
      const titleWithoutDesc = page.locator('h1')
      await expect(titleWithoutDesc).toBeVisible()
      await expect(titleWithoutDesc).toHaveText('no-description-app')

      // ============================================================
      // Scenario 5: Empty string description - Should not render
      // ============================================================

      await startServerWithSchema({
        name: 'empty-desc-app',
        description: '',
      })

      await page.goto('/')

      const emptyDesc = page.locator('[data-testid="app-description"]')
      await expect(emptyDesc).toBeHidden()
      await expect(emptyDesc).toHaveCount(0)
    }
  )
})
