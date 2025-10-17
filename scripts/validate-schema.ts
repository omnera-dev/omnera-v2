#!/usr/bin/env bun

/**
 * Validates specs.schema.json using AJV (Another JSON Schema Validator)
 * This provides full metaschema validation against JSON Schema Draft 7
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import Ajv, { type ValidateFunction, type ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'

const SCHEMA_PATH = join(__dirname, '..', 'docs', 'specifications', 'specs.schema.json')

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

async function validateWithAjv() {
  log('🔍 Validating JSON Schema with AJV (Full Metaschema Validation)', colors.cyan)
  console.log()

  if (!existsSync(SCHEMA_PATH)) {
    log(`❌ Schema file not found: ${SCHEMA_PATH}`, colors.red)
    process.exit(1)
  }

  try {
    // Read schema
    const schemaContent = readFileSync(SCHEMA_PATH, 'utf-8')
    const schema = JSON.parse(schemaContent)

    // Create AJV instance with Draft 7 support
    const ajv = new Ajv({
      strict: false, // Allow Draft 7 patterns
      allErrors: true, // Report all errors, not just first
      verbose: true, // Include data in errors
      validateSchema: true, // Validate the schema itself
    })

    // Add format validators (for format keywords like uri, email, etc.)
    addFormats(ajv)

    // Note: AJV includes Draft 7 metaschema by default, no need to add it manually
    // The metaschema will be used automatically when validating schemas with
    // "$schema": "http://json-schema.org/draft-07/schema#"

    // Compile and validate
    log('📋 Compiling schema...', colors.blue)
    let validate: ValidateFunction
    try {
      validate = ajv.compile(schema)
      log('✓ Schema compiled successfully', colors.green)
    } catch (e) {
      const error = e as Error & { errors?: ErrorObject[] }
      log('✗ Schema compilation failed', colors.red)
      console.error(error.message)
      if (error.errors) {
        console.log('\nValidation Errors:')
        error.errors.forEach((err: ErrorObject) => {
          console.log(`  - ${err.instancePath || '/'}: ${err.message}`)
          if (err.params) {
            console.log(`    Parameters: ${JSON.stringify(err.params)}`)
          }
        })
      }
      process.exit(1)
    }

    // Validate the schema against the metaschema
    log('\n🔍 Validating against Draft 7 metaschema...', colors.blue)
    const metaValid = ajv.validateSchema(schema)

    if (!metaValid) {
      log('✗ Schema does not conform to Draft 7 metaschema', colors.red)
      if (ajv.errors) {
        console.log('\nMetaschema Validation Errors:')
        ajv.errors.forEach((err: ErrorObject) => {
          console.log(`  - ${err.instancePath || '/'}: ${err.message}`)
        })
      }
      process.exit(1)
    }

    log('✓ Schema conforms to Draft 7 metaschema', colors.green)

    // Test with a sample document
    log('\n🧪 Testing with sample data...', colors.blue)
    const sampleDoc = {
      name: 'Test App',
      description: 'A test application',
      version: '1.0.0',
      tables: [],
      pages: [
        {
          type: 'custom-html',
          name: 'home',
          path: '/',
          head: [],
          body: [
            {
              type: 'custom-html',
              content: '<h1>Welcome</h1>',
            },
          ],
        },
      ],
      automations: [],
      connections: [],
    }

    const isValid = validate(sampleDoc)
    if (isValid) {
      log('✓ Sample document validates successfully', colors.green)
    } else {
      log('✗ Sample document validation failed', colors.yellow)
      if (validate.errors) {
        console.log('\nValidation Errors:')
        validate.errors.forEach((err: ErrorObject) => {
          console.log(`  - ${err.instancePath || '/'}: ${err.message}`)
        })
      }
    }

    // Summary
    console.log()
    log('✅ Schema validation complete!', colors.green)
    console.log()
    log('📊 Validation Summary:', colors.cyan)
    console.log(`  ${colors.gray}Schema Version: Draft 7${colors.reset}`)
    console.log(`  ${colors.gray}Metaschema Valid: ✓${colors.reset}`)
    console.log(`  ${colors.gray}Compilation: ✓${colors.reset}`)
    console.log(`  ${colors.gray}Sample Test: ${isValid ? '✓' : '✗'}${colors.reset}`)

    if (schema.properties) {
      console.log(
        `  ${colors.gray}Properties: ${Object.keys(schema.properties).length}${colors.reset}`
      )
    }
    if (schema.definitions) {
      console.log(
        `  ${colors.gray}Definitions: ${Object.keys(schema.definitions).length}${colors.reset}`
      )
    }
    console.log(
      `  ${colors.gray}File Size: ${(schemaContent.length / 1024).toFixed(2)} KB${colors.reset}`
    )
  } catch (error) {
    const e = error as Error
    log(`\n❌ Unexpected error: ${e.message}`, colors.red)
    process.exit(1)
  }
}

// Run validation
validateWithAjv().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})
