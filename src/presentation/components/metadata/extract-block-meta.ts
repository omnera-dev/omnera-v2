/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { BlockMeta } from './structured-data-from-block'
import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Blocks } from '@/domain/models/app/blocks'
import type { OpenGraph } from '@/domain/models/app/page/meta/open-graph'
import type { Component } from '@/domain/models/app/page/sections'

/**
 * Substitutes variables in a string value
 *
 * @param value - String value with potential $variable placeholders
 * @param vars - Variables map
 * @returns String with variables substituted
 */
function substituteVariables(
  value: string | undefined,
  vars: Record<string, string | number | boolean> | undefined
): string | undefined {
  if (!value || !vars) return value

  // Use reduce for functional approach instead of loop with mutation
  return Object.entries(vars).reduce(
    (result, [key, varValue]) =>
      result.replace(new RegExp(`\\$${key}`, 'g'), String(varValue)),
    value
  )
}

/**
 * Extracts Open Graph meta from a block's meta configuration
 *
 * @param meta - Block meta configuration
 * @param vars - Variables for substitution
 * @returns Partial Open Graph configuration
 */
function extractOpenGraphFromBlockMeta(
  meta: BlockMeta | undefined,
  vars: Record<string, string | number | boolean> | undefined
): Partial<OpenGraph> | undefined {
  if (!meta) return undefined

  // Build immutably without mutation
  const withImage = meta.image
    ? { image: substituteVariables(meta.image, vars) }
    : {}

  const withTitle = meta.title
    ? { title: substituteVariables(meta.title, vars) }
    : {}

  const withDescription = meta.description
    ? { description: substituteVariables(meta.description, vars) }
    : {}

  const openGraph = {
    ...withImage,
    ...withTitle,
    ...withDescription,
  }

  return Object.keys(openGraph).length > 0 ? openGraph : undefined
}

/**
 * Extracts block meta from page sections
 *
 * Processes all sections to find block references, resolves them, and extracts
 * meta information that should be included in the page's Open Graph meta tags.
 *
 * @param sections - Page sections
 * @param blocks - Available blocks
 * @returns Merged Open Graph configuration from all blocks
 */
export function extractBlockMetaFromSections(
  sections: ReadonlyArray<Component | SimpleBlockReference | BlockReference>,
  blocks?: Blocks
): Partial<OpenGraph> | undefined {
  if (!sections || !blocks) return undefined

  // Use functional map/filter instead of loop with mutation
  const openGraphParts = sections
    .filter((section): section is SimpleBlockReference | BlockReference =>
      'block' in section || '$ref' in section
    )
    .map((section) => {
      const blockName = 'block' in section ? section.block : section.$ref
      const vars = 'vars' in section ? section.vars : undefined

      // Find the block definition
      const block = blocks.find((b) => b.name === blockName)
      if (!block?.props?.meta) return undefined

      // Extract Open Graph meta from block meta
      const meta = block.props.meta as BlockMeta | undefined
      return extractOpenGraphFromBlockMeta(meta, vars)
    })
    .filter((og): og is Partial<OpenGraph> => og !== undefined)

  if (openGraphParts.length === 0) return undefined

  // Merge all Open Graph parts (last one wins for duplicate keys)
  return openGraphParts.reduce((acc, part) => ({ ...acc, ...part }), {})
}
