/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Component } from '@/domain/models/app/page/sections'

/**
 * Substitutes block variables in a value
 *
 * Replaces `$variableName` patterns with actual variable values.
 * Example: `$title` → `'Welcome to Our Platform'`
 *
 * @param value - Value that may contain variable placeholders
 * @param vars - Block variables for substitution
 * @returns Value with variables replaced
 *
 * @example
 * ```typescript
 * substituteBlockVariables('$title', { title: 'Hello' }) // 'Hello'
 * substituteBlockVariables('static', { title: 'Hello' }) // 'static'
 * substituteBlockVariables(123, { title: 'Hello' })       // 123
 * ```
 */
export function substituteBlockVariables(
  value: unknown,
  vars?: Record<string, string | number | boolean>
): unknown {
  if (typeof value !== 'string') {
    return value
  }

  if (!vars || !value.startsWith('$')) {
    return value
  }

  // Extract variable name: $title → 'title'
  const varName = value.slice(1)

  // Look up the variable in the vars object
  const result = vars[varName]

  // If variable not found, return original value
  return result !== undefined ? result : value
}

/**
 * Substitutes variables in component children recursively
 *
 * Pure function that walks through the children tree and replaces $variable
 * placeholders with actual values from the vars object.
 *
 * @param children - Array of children (can be strings or components)
 * @param vars - Variables for substitution
 * @returns Children with variables substituted
 *
 * @example
 * ```typescript
 * substituteChildrenVariables(
 *   [
 *     '$greeting',
 *     { type: 'span', content: '$name' }
 *   ],
 *   { greeting: 'Hello', name: 'World' }
 * )
 * // ['Hello', { type: 'span', content: 'World' }]
 * ```
 */
export function substituteChildrenVariables(
  children: ReadonlyArray<Component | string> | undefined,
  vars?: Record<string, string | number | boolean>
): ReadonlyArray<Component | string> | undefined {
  if (!children || !vars) {
    return children
  }

  return children.map((child) => {
    // If child is a string, apply variable substitution
    if (typeof child === 'string') {
      const substituted = substituteBlockVariables(child, vars)
      return substituted as string
    }

    // If child is a component, recursively substitute in its children and content
    const substitutedChildren = substituteChildrenVariables(child.children, vars)
    const substitutedContent =
      typeof child.content === 'string'
        ? (substituteBlockVariables(child.content, vars) as string)
        : child.content

    return {
      ...child,
      children: substitutedChildren,
      content: substitutedContent,
    }
  })
}
