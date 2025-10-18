/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { JSONSchema, JSONSchemaProperty } from '../types/roadmap'

export interface UserStory {
  propertyPath: string
  story: string
  index: number
}

export interface UserStoryStats {
  totalStories: number
  propertiesWithStories: number
  storiesByProperty: Map<string, number>
}

export function extractAllUserStories(schema: JSONSchema): UserStory[] {
  const stories: UserStory[] = []

  function traverse(prop: JSONSchemaProperty, path: string[]) {
    const fullPath = path.join('.')
    const userStories = prop['x-user-stories'] as string[] | undefined

    if (userStories && Array.isArray(userStories)) {
      for (let i = 0; i < userStories.length; i++) {
        stories.push({
          propertyPath: fullPath,
          story: userStories[i]!,
          index: i,
        })
      }
    }

    if (prop.properties) {
      for (const [propName, propSchema] of Object.entries(prop.properties)) {
        traverse(propSchema, [...path, propName])
      }
    }

    if (prop.items) {
      const items = Array.isArray(prop.items) ? prop.items : [prop.items]
      for (const item of items) {
        if (item.properties) {
          for (const [propName, propSchema] of Object.entries(item.properties)) {
            traverse(propSchema, [...path, 'items', propName])
          }
        }

        const variants = item.anyOf || item.oneOf
        if (variants) {
          for (const variant of variants) {
            if (variant.title) {
              traverse(variant, [...path, 'items', kebabCase(variant.title)])
            }
          }
        }
      }
    }

    const propVariants = prop.anyOf || prop.oneOf
    if (propVariants) {
      for (const variant of propVariants) {
        if (variant.title) {
          traverse(variant, [...path, kebabCase(variant.title)])
        }
      }
    }
  }

  const properties = schema.properties || {}
  for (const [name, prop] of Object.entries(properties)) {
    traverse(prop, [name])
  }

  const definitions = schema.definitions || {}
  for (const [name, def] of Object.entries(definitions)) {
    traverse(def, ['definitions', name])
  }

  return stories
}

export function calculateUserStoryStats(stories: UserStory[]): UserStoryStats {
  const storiesByProperty = new Map<string, number>()

  for (const story of stories) {
    const count = storiesByProperty.get(story.propertyPath) || 0
    storiesByProperty.set(story.propertyPath, count + 1)
  }

  return {
    totalStories: stories.length,
    propertiesWithStories: storiesByProperty.size,
    storiesByProperty,
  }
}

export function groupStoriesByProperty(stories: UserStory[]): Map<string, UserStory[]> {
  const groups = new Map<string, UserStory[]>()

  for (const story of stories) {
    const existing = groups.get(story.propertyPath) || []
    existing.push(story)
    groups.set(story.propertyPath, existing)
  }

  return groups
}

function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
