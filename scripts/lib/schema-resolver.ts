/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Schema $ref resolution utilities
 *
 * Provides functions to resolve JSON Schema and OpenAPI $ref pointers
 * before schema comparison. This ensures accurate diff calculations when
 * goal schemas use modular $ref pointers while current schemas are flattened.
 */

import $RefParser from '@apidevtools/json-schema-ref-parser'

// ============================================================================
// Types
// ============================================================================

export interface JSONSchema {
  $schema?: string
  $id?: string
  title?: string
  description?: string
  type?: string | string[]
  properties?: Record<string, unknown>
  required?: string[]
  definitions?: Record<string, unknown>
  [key: string]: unknown
}

export interface OpenAPISpec {
  openapi: string
  info: {
    title: string
    version: string
    [key: string]: unknown
  }
  paths?: Record<string, unknown>
  components?: {
    schemas?: Record<string, unknown>
    [key: string]: unknown
  }
  [key: string]: unknown
}

// ============================================================================
// JSON Schema Resolution
// ============================================================================

/**
 * Resolves all $ref pointers in a JSON Schema file
 *
 * @param schemaPath - Absolute path to JSON Schema file
 * @returns Fully resolved schema with all $ref pointers dereferenced
 *
 * @example
 * const resolved = await resolveJsonSchema('/path/to/app.schema.json')
 * // All $ref pointers replaced with inline definitions
 */
export async function resolveJsonSchema(schemaPath: string): Promise<JSONSchema> {
  try {
    const resolved = await $RefParser.dereference(schemaPath, {
      continueOnError: false,
      dereference: {
        circular: 'ignore', // Handle circular references
      },
    })

    return resolved as JSONSchema
  } catch (error) {
    throw new Error(`Failed to resolve JSON Schema at ${schemaPath}: ${error}`)
  }
}

// ============================================================================
// OpenAPI Schema Resolution
// ============================================================================

/**
 * Resolves all $ref pointers in an OpenAPI specification file
 *
 * @param schemaPath - Absolute path to OpenAPI JSON file
 * @returns Fully resolved OpenAPI spec with all $ref pointers dereferenced
 *
 * @example
 * const resolved = await resolveOpenApiSchema('/path/to/app.openapi.json')
 * // All $ref pointers in paths, components, etc. are resolved
 */
export async function resolveOpenApiSchema(schemaPath: string): Promise<OpenAPISpec> {
  try {
    const resolved = await $RefParser.dereference(schemaPath, {
      continueOnError: false,
      dereference: {
        circular: 'ignore', // Handle circular references
      },
    })

    return resolved as OpenAPISpec
  } catch (error) {
    throw new Error(`Failed to resolve OpenAPI schema at ${schemaPath}: ${error}`)
  }
}

// ============================================================================
// Bundling (Alternative Resolution Strategy)
// ============================================================================

/**
 * Bundles all external $ref pointers into a single schema file
 *
 * Unlike dereference() which inlines all definitions, bundle() moves
 * external references into the "definitions" section while preserving
 * internal $ref pointers. This is useful for creating self-contained
 * schemas that maintain structural clarity.
 *
 * @param schemaPath - Absolute path to JSON Schema file
 * @returns Bundled schema with all external $ref moved to definitions
 *
 * @example
 * const bundled = await bundleJsonSchema('/path/to/app.schema.json')
 * // External $ref moved to definitions, internal $ref preserved
 */
export async function bundleJsonSchema(schemaPath: string): Promise<JSONSchema> {
  try {
    const bundled = await $RefParser.bundle(schemaPath, {
      continueOnError: false,
      dereference: {
        circular: 'ignore',
      },
    })

    return bundled as JSONSchema
  } catch (error) {
    throw new Error(`Failed to bundle JSON Schema at ${schemaPath}: ${error}`)
  }
}

/**
 * Bundles all external $ref pointers in an OpenAPI specification
 *
 * @param schemaPath - Absolute path to OpenAPI JSON file
 * @returns Bundled OpenAPI spec with external $ref moved to components
 */
export async function bundleOpenApiSchema(schemaPath: string): Promise<OpenAPISpec> {
  try {
    const bundled = await $RefParser.bundle(schemaPath, {
      continueOnError: false,
      dereference: {
        circular: 'ignore',
      },
    })

    return bundled as OpenAPISpec
  } catch (error) {
    throw new Error(`Failed to bundle OpenAPI schema at ${schemaPath}: ${error}`)
  }
}
