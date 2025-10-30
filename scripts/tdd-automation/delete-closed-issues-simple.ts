#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Delete Closed TDD Automation Issues (Simple Version)
 *
 * Permanently deletes closed TDD automation issues using GitHub GraphQL API.
 * ⚠️  WARNING: Deletion is PERMANENT and CANNOT be undone!
 */

import { execSync } from 'node:child_process'

interface Issue {
  number: number
  title: string
  id: string // GraphQL node ID
}

const forceMode = process.argv.includes('--force')

console.log('🗑️  Delete Closed TDD Automation Issues\n')

// Fetch closed issues
console.log('🔄 Fetching closed tdd-automation issues...')
const issuesJson = execSync(
  'gh issue list --state closed --label "tdd-automation" --limit 1000 --json number,title,id',
  { encoding: 'utf-8' }
)

const issues: Issue[] = JSON.parse(issuesJson)
console.log(`   Fetched ${issues.length} closed issues\n`)

if (issues.length === 0) {
  console.log('✅ No closed issues to delete')
  process.exit(0)
}

// Show warning
if (!forceMode) {
  console.log('⚠️  WARNING: This will PERMANENTLY DELETE all closed issues!')
  console.log('⚠️  This operation CANNOT be undone!\n')
  console.log(`Total issues to delete: ${issues.length}\n`)
  console.log('⚠️  Type "DELETE" to confirm deletion:\n')

  // Read user input
  const readline = require('node:readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const confirmation = await new Promise<string>((resolve) => {
    rl.question('', (answer: string) => {
      rl.close()
      resolve(answer)
    })
  })

  if (confirmation.trim() !== 'DELETE') {
    console.log('❌ Confirmation failed - aborting')
    process.exit(1)
  }
  console.log('')
}

// Delete issues
let deletedCount = 0
for (const issue of issues) {
  console.log(`🔄 Deleting #${issue.number}...`)

  const mutation = `
    mutation {
      deleteIssue(input: {
        issueId: "${issue.id}"
      }) {
        repository {
          id
        }
      }
    }
  `

  try {
    execSync(`gh api graphql -f query='${mutation}'`, {
      encoding: 'utf-8',
      stdio: 'pipe',
    })
    deletedCount++
  } catch (error) {
    console.error(`❌ Failed to delete #${issue.number}:`, error)
  }
}

console.log(`\n✅ Deleted ${deletedCount} issues`)
