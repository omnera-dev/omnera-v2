#!/usr/bin/env bun

/**
 * Script to fix $ref paths in action schema files
 *
 * This script updates internal references (#/definitions/...) to point to
 * the parent automations.schema.json file
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

function fixReferences(filePath: string) {
  const content = readFileSync(filePath, 'utf-8')
  const schema = JSON.parse(content)

  let modified = false

  // Recursively update $ref paths
  function updateRefs(obj: any) {
    if (typeof obj !== 'object' || obj === null) return

    for (const key in obj) {
      if (key === '$ref' && typeof obj[key] === 'string') {
        // Update internal references to point to parent schema
        if (obj[key].startsWith('#/definitions/')) {
          obj[key] = `../automations.schema.json${obj[key]}`
          modified = true
        }
      } else if (typeof obj[key] === 'object') {
        updateRefs(obj[key])
      }
    }
  }

  updateRefs(schema)

  if (modified) {
    writeFileSync(filePath, JSON.stringify(schema, null, 2), 'utf-8')
    return true
  }

  return false
}

function main() {
  const actionsDir = join(process.cwd(), 'docs/specifications/schemas/automations/actions')

  console.log('🔧 Fixing $ref paths in action schema files...\n')

  const files = readdirSync(actionsDir).filter((f) => f.endsWith('.schema.json'))

  let fixedCount = 0

  files.forEach((file) => {
    const filePath = join(actionsDir, file)
    const wasFixed = fixReferences(filePath)
    if (wasFixed) {
      console.log(`   ✅ Fixed: ${file}`)
      fixedCount++
    }
  })

  console.log(`\n✅ Fixed ${fixedCount} file(s)`)
}

main()
