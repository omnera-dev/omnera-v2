#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Snapshot Testing Guide for Omnera
 *
 * This script provides guidance on working with snapshots in E2E tests.
 * Run: bun run scripts/snapshot-guide.ts
 */

import { $ } from 'bun'

const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const GREEN = '\x1b[32m'
const BLUE = '\x1b[34m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'

console.log(`
${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
${BOLD}${CYAN}                    🎯 Snapshot Testing Guide for Omnera${RESET}
${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

${BOLD}${GREEN}📸 Visual Snapshots (toHaveScreenshot)${RESET}
${YELLOW}────────────────────────────────────────${RESET}
Visual snapshots capture pixel-perfect screenshots of pages/elements.
Perfect for: Theme validation, layouts, visual components, responsive design

${CYAN}Commands:${RESET}
  ${GREEN}bun test:e2e:update-snapshots${RESET}              - Update ALL snapshots
  ${GREEN}bun test:e2e:update-snapshots:spec${RESET}         - Update @spec test snapshots only
  ${GREEN}bun test:e2e:update-snapshots:regression${RESET}   - Update @regression test snapshots only

${CYAN}Example usage in tests:${RESET}
  ${BLUE}// Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
    animations: 'disabled'
  })

  // Element screenshot with masking
  await expect(page.locator('.card')).toHaveScreenshot('card.png', {
    mask: [page.locator('.timestamp')],  // Hide dynamic content
    threshold: 0.2  // Color tolerance
  })${RESET}

${BOLD}${GREEN}🎯 ARIA Snapshots (toMatchAriaSnapshot)${RESET}
${YELLOW}────────────────────────────────────────${RESET}
ARIA snapshots capture the accessibility tree structure in YAML format.
Perfect for: Page structure, navigation, forms, data tables, accessibility

${CYAN}Example usage in tests:${RESET}
  ${BLUE}// Match accessibility structure
  await expect(page.locator('main')).toMatchAriaSnapshot(\`
    - heading "Page Title" [level=1]
    - navigation
      - link "Home"
      - link "About"
    - button "Submit"
  \`)

  // Partial matching with regex
  await expect(page.locator('header')).toMatchAriaSnapshot(\`
    - heading /Welcome .*/  // Matches "Welcome Alice", etc.
  \`)${RESET}

${BOLD}${GREEN}📊 Decision Matrix${RESET}
${YELLOW}────────────────────────────────────────${RESET}
${CYAN}Spec Type${RESET}              → ${GREEN}Recommended Approach${RESET}
Theme/Colors/Shadows    → Visual Screenshot
Typography/Fonts        → Visual Screenshot
Layouts/Responsive      → Visual Screenshot + ARIA
Page Structure          → ARIA Snapshot
Navigation/Menus        → ARIA Snapshot
Forms (structure)       → ARIA Snapshot
Forms (validation)      → Assertions + ARIA
Data Tables/Lists       → ARIA Snapshot
Interactive Widgets     → Combined (all three)
Business Logic          → Assertions only

${BOLD}${GREEN}📁 Snapshot Storage${RESET}
${YELLOW}────────────────────────────────────────${RESET}
Snapshots are stored in: ${CYAN}specs/**/__snapshots__/${RESET}
  • ${GREEN}*.png${RESET}  - Visual screenshots
  • ${GREEN}*.yml${RESET}  - ARIA snapshots
  • ${GREEN}*.yaml${RESET} - ARIA snapshots (alt extension)

${YELLOW}Git will ignore:${RESET}
  • *-actual.* (failed snapshot attempts)
  • *-diff.*   (visual differences)

${YELLOW}Git will keep:${RESET}
  • All baseline snapshots (*.png, *.yml, *.yaml)

${BOLD}${GREEN}🔄 Workflow${RESET}
${YELLOW}────────────────────────────────────────${RESET}
1. ${CYAN}Write tests${RESET} with snapshot expectations (test.fixme)
2. ${CYAN}Implement feature${RESET} to make tests pass
3. ${CYAN}Remove test.fixme()${RESET} to enable the test
4. ${CYAN}Run tests:${RESET} ${GREEN}bun test:e2e${RESET}
5. ${CYAN}Create baseline:${RESET} ${GREEN}bun test:e2e:update-snapshots${RESET}
6. ${CYAN}Review snapshots${RESET} carefully before committing
7. ${CYAN}Commit snapshots${RESET} to version control

${BOLD}${GREEN}⚠️  Important Notes${RESET}
${YELLOW}────────────────────────────────────────${RESET}
• Always review snapshot diffs before updating
• Use descriptive names: 'button-primary.png' not 'snapshot1.png'
• Mask dynamic content (timestamps, user data) in visual tests
• Keep snapshots small - prefer element over full page when possible
• Default threshold (0.2) works well for most cases
• ARIA snapshots are resilient to CSS changes
• Visual snapshots catch CSS regressions

${BOLD}${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
`)

// Show current snapshot count if any exist
try {
  const pngCount = await $`find specs -name "*.png" -path "*/__snapshots__/*" 2>/dev/null | wc -l`
    .text()
    .then((t) => parseInt(t.trim()))
  const ymlCount =
    await $`find specs -name "*.yml" -o -name "*.yaml" -path "*/__snapshots__/*" 2>/dev/null | wc -l`
      .text()
      .then((t) => parseInt(t.trim()))

  if (pngCount > 0 || ymlCount > 0) {
    console.log(`${BOLD}${GREEN}📊 Current Snapshot Status${RESET}`)
    console.log(`${YELLOW}────────────────────────────────────────${RESET}`)
    if (pngCount > 0) console.log(`  ${CYAN}Visual snapshots:${RESET} ${pngCount} files`)
    if (ymlCount > 0) console.log(`  ${CYAN}ARIA snapshots:${RESET} ${ymlCount} files`)
    console.log('')
  }
} catch {
  // Ignore errors if find command fails
}
