#!/usr/bin/env bun

/**
 * Script to remove $id from action schema files
 *
 * $id is not needed for referenced schema files and causes issues with AJV URI resolution
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

function removeId(filePath: string) {
  const content = readFileSync(filePath, 'utf-8')
  const schema = JSON.parse(content)

  if (schema.$id) {
    delete schema.$id
    writeFileSync(filePath, JSON.stringify(schema, null, 2), 'utf-8')
    return true
  }

  return false
}

function main() {
  const actionsDir = join(process.cwd(), 'docs/specifications/schemas/automations/actions')

  console.log('🔧 Removing $id from action schema files...\n')

  const files = readdirSync(actionsDir).filter((f) => f.endsWith('.schema.json'))

  let modifiedCount = 0

  files.forEach((file) => {
    const filePath = join(actionsDir, file)
    const wasModified = removeId(filePath)
    if (wasModified) {
      console.log(`   ✅ Removed $id: ${file}`)
      modifiedCount++
    }
  })

  console.log(`\n✅ Modified ${modifiedCount} file(s)`)
}

main()
