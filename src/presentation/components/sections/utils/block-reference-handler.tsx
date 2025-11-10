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
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'
import type { ReactElement } from 'react'

/**
 * Props for rendering a block reference error
 */
interface BlockReferenceErrorProps {
  readonly refName: string
  readonly blocks: Blocks | undefined
}

/**
 * Render an error message for missing block references
 */
export function renderBlockReferenceError({
  refName,
  blocks,
}: BlockReferenceErrorProps): ReactElement {
  return (
    <div
      style={{
        padding: '1rem',
        border: '2px dashed red',
        color: 'red',
        fontFamily: 'monospace',
      }}
    >
      Block not found: &quot;{refName}&quot;
      <br />
      <small>Available blocks: {blocks?.map((b) => b.name).join(', ') || 'none'}</small>
    </div>
  )
}

/**
 * Extract reference name and vars from block reference
 */
export function extractBlockReference(component: SimpleBlockReference | BlockReference): {
  refName: string
  vars: Record<string, string> | undefined
} {
  const refName = 'block' in component ? component.block : component.$ref
  const vars = 'vars' in component ? component.vars : undefined
  return { refName, vars }
}

/**
 * Props for block reference rendering
 */
export interface BlockReferenceRenderProps {
  readonly component: Component
  readonly blockName: string
  readonly blockInstanceIndex: number | undefined
  readonly blocks: Blocks | undefined
  readonly theme: Theme | undefined
  readonly languages: Languages | undefined
  readonly currentLang: string | undefined
}
