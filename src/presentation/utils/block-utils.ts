/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Component } from '@/domain/models/app/page/sections'

/**
 * Get block information for a section
 *
 * Determines if a section is a block reference and calculates its instance index
 * when multiple instances of the same block exist.
 *
 * @param section - Section to analyze (Component, SimpleBlockReference, or BlockReference)
 * @param index - Position of this section in the sections array
 * @param sections - Complete array of sections for counting occurrences
 * @returns Block info with name and optional instanceIndex, or undefined if not a block reference
 */
export function getBlockInfo(
  section: Component | SimpleBlockReference | BlockReference,
  index: number,
  sections: ReadonlyArray<Component | SimpleBlockReference | BlockReference>
): { name: string; instanceIndex?: number } | undefined {
  if (!('block' in section || '$ref' in section)) {
    return undefined
  }

  const blockName = 'block' in section ? section.block : section.$ref

  // Count total occurrences of this block name in all sections
  const totalOccurrences = sections.filter((s) => {
    const sBlockName = 'block' in s ? s.block : '$ref' in s ? s.$ref : undefined
    return sBlockName === blockName
  }).length

  // Only set instanceIndex if there are multiple instances
  if (totalOccurrences <= 1) {
    return { name: blockName }
  }

  // Count previous occurrences of the same block name
  const previousOccurrences = sections.slice(0, index).filter((s) => {
    const sBlockName = 'block' in s ? s.block : '$ref' in s ? s.$ref : undefined
    return sBlockName === blockName
  })

  return { name: blockName, instanceIndex: previousOccurrences.length }
}
