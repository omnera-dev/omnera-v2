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

async function resolveRefsRecursive(obj: any, basePath: string, cache: SchemaCache): Promise<void> {
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

          processingSet.delete(absolutePath)
        } catch (error) {
          processingSet.delete(absolutePath)
          return
        }
      }

      const referencedSchema = cache[absolutePath]

      if (pointer && pointer.startsWith('/')) {
        const parts = pointer.substring(1).split('/')
        let target: any = referencedSchema
        for (const part of parts) {
          target = target?.[part]
          if (!target) {
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

  if (obj.properties) {
    for (const key of Object.keys(obj.properties)) {
      await resolveRefsRecursive(obj.properties[key], basePath, cache)
    }
  }

  if (obj.items) {
    if (Array.isArray(obj.items)) {
      for (const item of obj.items) {
        await resolveRefsRecursive(item, basePath, cache)
      }
    } else {
      await resolveRefsRecursive(obj.items, basePath, cache)
    }
  }

  for (const key of ['anyOf', 'oneOf', 'allOf']) {
    if (Array.isArray(obj[key])) {
      for (const variant of obj[key]) {
        await resolveRefsRecursive(variant, basePath, cache)
      }
    }
  }

  if (obj.definitions) {
    for (const key of Object.keys(obj.definitions)) {
      await resolveRefsRecursive(obj.definitions[key], basePath, cache)
    }
  }

  for (const key of Object.keys(obj)) {
    if (
      typeof obj[key] === 'object' &&
      obj[key] !== null &&
      !['properties', 'items', 'anyOf', 'oneOf', 'allOf', 'definitions'].includes(key)
    ) {
      await resolveRefsRecursive(obj[key], basePath, cache)
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
    } else {
      count += countAllProperties(schema.items)
    }
  }

  if (schema.anyOf) {
    count += schema.anyOf.length
    for (const variant of schema.anyOf) {
      count += countAllProperties(variant)
    }
  }

  if (schema.oneOf) {
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
