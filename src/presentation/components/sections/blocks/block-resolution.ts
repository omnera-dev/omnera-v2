/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import {
  substituteBlockVariables,
  substituteChildrenVariables,
  substitutePropsVariables,
} from '../translations/variable-substitution'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Component } from '@/domain/models/app/page/sections'

/**
 * Resolves a block reference to a component with optional variable substitution
 *
 * Pure function that finds a block by name, converts it to a Component,
 * and applies variable substitution if vars are provided.
 *
 * @param blockName - Name of the block to resolve
 * @param blocks - Array of available blocks
 * @param vars - Optional variables for substitution
 * @returns Resolved component and block name, or undefined if not found
 *
 * @example
 * ```typescript
 * const blocks = [
 *   { name: 'hero', type: 'section', content: '$title' }
 * ]
 * const resolved = resolveBlock('hero', blocks, { title: 'Welcome' })
 * // { component: { type: 'section', content: 'Welcome' }, name: 'hero' }
 * ```
 */
export function resolveBlock(
  blockName: string,
  blocks?: Blocks,
  vars?: Record<string, string | number | boolean>
): { readonly component: Component; readonly name: string } | undefined {
  const block = blocks?.find((b) => b.name === blockName)
  if (!block) {
    // DEVELOPMENT WARNING: Keep console.warn for development debugging
    // This warning alerts developers when a referenced block doesn't exist
    // Helps identify typos or missing block definitions during development
    // Safe to keep - provides helpful feedback for configuration errors
    console.warn(`Block not found: ${blockName}`)
    return undefined
  }

  // Cast block.children to Component children type for type compatibility
  const blockChildren = block.children as ReadonlyArray<Component | string> | undefined

  const component: Component = {
    type: block.type,
    props: substitutePropsVariables(block.props, vars),
    children: substituteChildrenVariables(blockChildren, vars),
    content:
      typeof block.content === 'string'
        ? (substituteBlockVariables(block.content, vars) as string)
        : block.content,
  }

  return { component, name: block.name }
}
