/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures'

/**
 * E2E Tests for Connection Management (Admin)
 *
 * Test Organization:
 * - @spec tests - Individual specification tests
 * - @regression test - ONE consolidated workflow test
 *
 * Source: specs/admin/connections/connections.json
 */

// ADMIN-CONNECTIONS-001: user is authenticated in a workspace → user navigates to connections page → system displays list of all configured connections with status
test.fixme(
  'ADMIN-CONNECTIONS-001: should display list of configured connections with status',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: user is authenticated in a workspace
    await startServerWithSchema({
      name: 'connections-list-test',
    })

    // WHEN: user navigates to connections page
    await page.goto('/admin/connections')

    // THEN: system displays list of all configured connections with status
    await expect(page.locator('[data-testid="connections-list"]')).toBeVisible()
  }
)

// ADMIN-CONNECTIONS-002: connection exists with valid OAuth credentials but is not connected → user initiates connection via 'Connect' button → OAuth flow completes successfully and connection status becomes 'connected'
test.fixme(
  'ADMIN-CONNECTIONS-002: should complete OAuth flow when user clicks Connect',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: connection exists with valid OAuth credentials but is not connected
    await startServerWithSchema({
      name: 'connections-oauth-test',
    })

    await page.goto('/admin/connections')

    // WHEN: user initiates connection via 'Connect' button
    await page.click('[data-testid="connect-button"]')

    // THEN: OAuth flow completes successfully and connection status becomes 'connected'
    await expect(page.locator('[data-testid="connection-status"]')).toHaveText('connected')
  }
)

// ADMIN-CONNECTIONS-003: connection is in 'connected' status with active tokens → user clicks 'Disconnect' button → connection status changes to 'disconnected' and OAuth tokens are revoked
test.fixme(
  'ADMIN-CONNECTIONS-003: should disconnect and revoke tokens when user clicks Disconnect',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: connection is in 'connected' status with active tokens
    await startServerWithSchema({
      name: 'connections-disconnect-test',
    })

    await page.goto('/admin/connections')

    // WHEN: user clicks 'Disconnect' button
    await page.click('[data-testid="disconnect-button"]')

    // THEN: connection status changes to 'disconnected' and OAuth tokens are revoked
    await expect(page.locator('[data-testid="connection-status"]')).toHaveText('disconnected')
  }
)

// ADMIN-CONNECTIONS-004: connection is configured and shareable feature is enabled → user clicks 'Copy Link' button → shareable connection URL is copied to clipboard
test.fixme(
  'ADMIN-CONNECTIONS-004: should copy shareable connection URL to clipboard',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: connection is configured and shareable feature is enabled
    await startServerWithSchema({
      name: 'connections-share-test',
    })

    await page.goto('/admin/connections')

    // WHEN: user clicks 'Copy Link' button
    await page.click('[data-testid="copy-link-button"]')

    // THEN: shareable connection URL is copied to clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toContain('/share/')
  }
)

// ============================================================================
// REGRESSION TEST (@regression)
// ONE consolidated test covering complete workflow
// Run during: CI/CD, pre-release (bun test:e2e:regression)
// ============================================================================

test.fixme(
  'user can complete full connection management workflow',
  { tag: '@regression' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: application is running
    await startServerWithSchema({
      name: 'connections-workflow-test',
    })

    // WHEN: user navigates to connections page
    await page.goto('/admin/connections')

    // THEN: connections list is visible
    await expect(page.locator('[data-testid="connections-list"]')).toBeVisible()

    // WHEN: user connects a connection
    await page.click('[data-testid="connect-button"]')

    // THEN: connection status becomes connected
    await expect(page.locator('[data-testid="connection-status"]')).toHaveText('connected')

    // WHEN: user copies shareable link
    await page.click('[data-testid="copy-link-button"]')

    // THEN: link is copied to clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    expect(clipboardText).toBeTruthy()

    // WHEN: user disconnects the connection
    await page.click('[data-testid="disconnect-button"]')

    // THEN: connection status becomes disconnected
    await expect(page.locator('[data-testid="connection-status"]')).toHaveText('disconnected')
  }
)
