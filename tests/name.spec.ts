import { test, expect } from './__fixtures__'

test('should display app name as title', async ({ page, startServerWithSchema }) => {
  // GIVEN: A server configured with a specific app name
  await startServerWithSchema({
    name: 'test-app-alpha',
  })

  // WHEN: User navigates to the homepage
  await page.goto('/')

  // THEN: The app name should be displayed as the main heading
  const heading = page.locator('h1')
  await expect(heading).toHaveText('test-app-alpha')
})
