/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { join, dirname } from 'node:path'
import type { JSONSchema, JSONSchemaProperty } from '../types/roadmap'

interface SchemaCache {
  [path: string]: JSONSchema | JSONSchemaProperty
}

const processingSet = new Set<string>()

export async function resolveSchemaRefs(
  schema: JSONSchema | JSONSchemaProperty,
  basePath: string,
  cache: SchemaCache = {}
): Promise<JSONSchema | JSONSchemaProperty> {
  const resolved = JSON.parse(JSON.stringify(schema))
  processingSet.clear()
  await resolveRefsRecursive(resolved, basePath, cache)
  return resolved
}

async function resolveRefsRecursive(
  obj: JSONSchema | JSONSchemaProperty | Record<string, unknown>,
  basePath: string,
  cache: SchemaCache
): Promise<void> {
  if (!obj || typeof obj !== 'object') {
    return
  }

  if (obj.$ref && typeof obj.$ref === 'string') {
    const refPath = obj.$ref

    if (refPath.startsWith('#/')) {
      return
    }

    const [filePath, pointer] = refPath.split('#')

    if (filePath) {
      const absolutePath = join(basePath, filePath)

      if (processingSet.has(absolutePath)) {
        return
      }

      if (!cache[absolutePath]) {
        try {
          processingSet.add(absolutePath)

          const file = Bun.file(absolutePath)
          const content = await file.json()
          cache[absolutePath] = content

          const newBasePath = dirname(absolutePath)
          await resolveRefsRecursive(content, newBasePath, cache)

          // eslint-disable-next-line drizzle/enforce-delete-with-where
          processingSet.delete(absolutePath)
        } catch {
          // eslint-disable-next-line drizzle/enforce-delete-with-where
          processingSet.delete(absolutePath)
          return
        }
      }

      const referencedSchema = cache[absolutePath]

      if (pointer && pointer.startsWith('/')) {
        const parts = pointer.substring(1).split('/')
        let target: JSONSchema | JSONSchemaProperty | Record<string, unknown> | undefined =
          referencedSchema
        for (const part of parts) {
          if (target && typeof target === 'object' && part in target) {
            target = (target as Record<string, unknown>)[part] as
              | JSONSchema
              | JSONSchemaProperty
              | Record<string, unknown>
              | undefined
          } else {
            return
          }
        }

        delete obj.$ref
        Object.assign(obj, target)
      } else {
        delete obj.$ref
        Object.assign(obj, referencedSchema)
      }
    }
  }

  if ('properties' in obj && obj.properties && typeof obj.properties === 'object') {
    const properties = obj.properties as Record<string, unknown>
    for (const key of Object.keys(properties)) {
      const prop = properties[key]
      if (prop && typeof prop === 'object') {
        await resolveRefsRecursive(prop as JSONSchema | JSONSchemaProperty, basePath, cache)
      }
    }
  }

  if ('items' in obj && obj.items) {
    if (Array.isArray(obj.items)) {
      for (const item of obj.items) {
        if (item && typeof item === 'object') {
          await resolveRefsRecursive(item as JSONSchema | JSONSchemaProperty, basePath, cache)
        }
      }
    } else if (typeof obj.items === 'object') {
      await resolveRefsRecursive(obj.items as JSONSchema | JSONSchemaProperty, basePath, cache)
    }
  }

  for (const key of ['anyOf', 'oneOf', 'allOf']) {
    if (key in obj && Array.isArray(obj[key])) {
      const variants = obj[key] as unknown[]
      for (const variant of variants) {
        if (variant && typeof variant === 'object') {
          await resolveRefsRecursive(variant as JSONSchema | JSONSchemaProperty, basePath, cache)
        }
      }
    }
  }

  if ('definitions' in obj && obj.definitions && typeof obj.definitions === 'object') {
    const definitions = obj.definitions as Record<string, unknown>
    for (const key of Object.keys(definitions)) {
      const def = definitions[key]
      if (def && typeof def === 'object') {
        await resolveRefsRecursive(def as JSONSchema | JSONSchemaProperty, basePath, cache)
      }
    }
  }

  for (const key of Object.keys(obj)) {
    if (
      !['properties', 'items', 'anyOf', 'oneOf', 'allOf', 'definitions', '$ref'].includes(key) &&
      key in obj
    ) {
      const value = obj[key]
      if (value && typeof value === 'object') {
        await resolveRefsRecursive(value as JSONSchema | JSONSchemaProperty, basePath, cache)
      }
    }
  }
}

export function countAllProperties(schema: JSONSchema | JSONSchemaProperty): number {
  let count = 0

  if (typeof schema !== 'object' || schema === null) {
    return 0
  }

  if (schema.properties) {
    count += Object.keys(schema.properties).length

    for (const prop of Object.values(schema.properties)) {
      count += countAllProperties(prop)
    }
  }

  if (schema.items) {
    if (Array.isArray(schema.items)) {
      for (const item of schema.items) {
        count += countAllProperties(item)
      }
    } else if (typeof schema.items === 'object') {
      count += countAllProperties(schema.items as JSONSchemaProperty)
    }
  }

  if (schema.anyOf && Array.isArray(schema.anyOf)) {
    count += schema.anyOf.length
    for (const variant of schema.anyOf) {
      count += countAllProperties(variant)
    }
  }

  if (schema.oneOf && Array.isArray(schema.oneOf)) {
    count += schema.oneOf.length
    for (const variant of schema.oneOf) {
      count += countAllProperties(variant)
    }
  }

  if (schema.definitions) {
    for (const def of Object.values(schema.definitions)) {
      count += countAllProperties(def)
    }
  }

  return count
}
