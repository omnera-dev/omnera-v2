#!/usr/bin/env bun

/**
 * Updates the license date and version in LICENSE.md for BSL 1.1
 * Called by semantic-release during the release process
 */

import { join } from 'node:path'

const version = process.argv[2]

if (!version) {
  console.error('Error: Version argument is required')
  process.exit(1)
}

const licensePath = join(import.meta.dir, '..', 'LICENSE.md')

try {
  // Read license file
  const licenseFile = Bun.file(licensePath)
  let licenseContent = await licenseFile.text()

  // Get current year for copyright
  const currentYear = new Date().getFullYear()

  // Calculate Change Date (4 years from today for BSL 1.1)
  const changeDate = new Date()
  changeDate.setFullYear(changeDate.getFullYear() + 4)
  const changeDateStr = changeDate.toISOString().split('T')[0]

  // Update version in "Licensed Work: Omnera X.X.X"
  licenseContent = licenseContent.replace(
    /Licensed Work:\s+Omnera\s+[\d.]+/,
    `Licensed Work:          Omnera ${version}`
  )

  // Update copyright year in "(c) YYYY ESSENTIAL SERVICES"
  licenseContent = licenseContent.replace(
    /\(c\)\s+\d{4}\s+ESSENTIAL SERVICES/,
    `(c) ${currentYear} ESSENTIAL SERVICES`
  )

  // Update Change Date
  licenseContent = licenseContent.replace(
    /Change Date:\s+\d{4}-\d{2}-\d{2}/,
    `Change Date:            ${changeDateStr}`
  )

  // Write updated content
  await Bun.write(licensePath, licenseContent)

  console.log('✓ Updated LICENSE.md:')
  console.log(`  - Version: ${version}`)
  console.log(`  - Copyright year: ${currentYear}`)
  console.log(`  - Change Date: ${changeDateStr}`)
} catch (error) {
  console.error('Error updating LICENSE.md:', (error as Error).message)
  process.exit(1)
}
