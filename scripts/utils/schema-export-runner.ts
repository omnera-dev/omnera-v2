/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Schema Export Runner
 *
 * Runs the export-schema script and parses the output to check
 * which properties are implemented in the current AppSchema.
 */

import { spawn } from 'node:child_process'
import type { JSONSchema } from '../types/roadmap'

export interface SchemaImplementationStatus {
  propertyPath: string
  isImplemented: boolean
  schemaFilePath?: string
  schemaType?: string
}

/**
 * Run export-schema script and return the exported schema
 *
 * @returns Promise<JSONSchema> - The current AppSchema as JSON Schema
 */
export async function runSchemaExport(): Promise<JSONSchema> {
  return new Promise((resolve, reject) => {
    // Run: bun run scripts/export-schema.ts
    const child = spawn('bun', ['run', 'scripts/export-schema.ts'], {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    let _stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      _stdout += data.toString()
    })

    child.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Schema export failed with code ${code}: ${stderr}`))
        return
      }

      try {
        // The export-schema script writes to schemas/0.0.1/app.schema.json
        // We need to read that file
        const schemaPath = 'schemas/0.0.1/app.schema.json'
        const file = Bun.file(schemaPath)
        file.json().then(
          (schema) => {
            resolve(schema as JSONSchema)
          },
          (error) => {
            reject(new Error(`Failed to parse exported schema: ${error}`))
          }
        )
      } catch (error) {
        reject(new Error(`Failed to read exported schema: ${error}`))
      }
    })

    child.on('error', (error) => {
      reject(new Error(`Failed to spawn export-schema process: ${error.message}`))
    })
  })
}

/**
 * Check if a property is implemented in the current schema
 *
 * @param propertyPath - Property path (e.g., "name", "tables", "pages.form-page")
 * @param currentSchema - The current AppSchema JSON
 * @returns SchemaImplementationStatus
 */
export function checkPropertyImplementation(
  propertyPath: string,
  currentSchema: JSONSchema
): SchemaImplementationStatus {
  const parts = propertyPath.split('.')

  // Navigate through the schema structure
  let current: unknown = currentSchema.properties
  let isImplemented = false

  for (const part of parts) {
    if (!current || typeof current !== 'object') {
      break
    }

    // Check if property exists
    if (part in current) {
      current = (current as Record<string, unknown>)[part]
      isImplemented = true
    } else {
      isImplemented = false
      break
    }
  }

  // Determine schema file path (convention: src/domain/models/app/{last-part}.ts)
  const lastPart = parts[parts.length - 1]!
  const schemaFilePath = isImplemented ? `src/domain/models/app/${lastPart}.ts` : undefined

  // Determine schema type if implemented
  let schemaType: string | undefined
  if (isImplemented && current && typeof current === 'object') {
    const schema = current as Record<string, unknown>
    if (schema.type) {
      schemaType = Array.isArray(schema.type) ? schema.type.join(' | ') : String(schema.type)
    } else if (schema.anyOf) {
      schemaType = 'union'
    } else if (schema.oneOf) {
      schemaType = 'oneOf'
    } else if (schema.allOf) {
      schemaType = 'allOf'
    }
  }

  return {
    propertyPath,
    isImplemented,
    schemaFilePath,
    schemaType,
  }
}

/**
 * Check implementation status for multiple properties
 *
 * @param propertyPaths - Array of property paths
 * @param currentSchema - The current AppSchema JSON
 * @returns Map of property path to implementation status
 */
export function checkMultiplePropertyImplementations(
  propertyPaths: string[],
  currentSchema: JSONSchema
): Map<string, SchemaImplementationStatus> {
  const statusMap = new Map<string, SchemaImplementationStatus>()

  for (const propertyPath of propertyPaths) {
    const status = checkPropertyImplementation(propertyPath, currentSchema)
    statusMap.set(propertyPath, status)
  }

  return statusMap
}

/**
 * Format implementation status as human-readable string
 */
export function formatImplementationStatus(status: SchemaImplementationStatus): string {
  if (status.isImplemented) {
    return `✅ Implemented (${status.schemaFilePath})`
  }
  return '🔴 Not implemented'
}

/**
 * Get implementation progress for a set of properties
 *
 * @param propertyPaths - Array of property paths
 * @param currentSchema - The current AppSchema JSON
 * @returns Object with implementation statistics
 */
export function getImplementationProgress(
  propertyPaths: string[],
  currentSchema: JSONSchema
): {
  total: number
  implemented: number
  missing: number
  percentComplete: number
} {
  let implemented = 0

  for (const propertyPath of propertyPaths) {
    const status = checkPropertyImplementation(propertyPath, currentSchema)
    if (status.isImplemented) {
      implemented++
    }
  }

  const total = propertyPaths.length
  const missing = total - implemented
  const percentComplete = total > 0 ? Math.round((implemented / total) * 100) : 0

  return {
    total,
    implemented,
    missing,
    percentComplete,
  }
}
