/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { BlockChildrenSchema } from './common/block-children'
import { BlockPropsSchema } from './common/block-props'
import { BlockReferenceNameSchema } from './common/block-reference'

/**
 * Block name identifier (same pattern as block reference name)
 *
 * Must be in kebab-case:
 * - Start with lowercase letter
 * - Contain only lowercase letters, numbers, and hyphens
 * - Used for data-testid generation: data-testid="block-{name}"
 *
 * @example
 * ```typescript
 * const names = ['icon-badge', 'section-header', 'feature-card', 'cta-button-2']
 * ```
 */
export const BlockNameSchema = BlockReferenceNameSchema.annotations({
  title: 'Block Name',
  description: 'Unique block identifier in kebab-case',
  examples: ['icon-badge', 'section-header', 'feature-card', 'cta-button-2'],
})

/**
 * Reusable UI component template with variable placeholders
 *
 * A block defines the structure of a reusable component that can be
 * instantiated multiple times with different data via block references.
 *
 * Required properties:
 * - name: Unique identifier (kebab-case)
 * - type: Component type (container, flex, grid, card, text, button, etc.)
 *
 * Optional properties:
 * - props: Component properties (may contain $variable placeholders)
 * - children: Nested child components
 * - content: Text content (may contain $variable placeholders)
 *
 * @example
 * ```typescript
 * const block = {
 *   name: 'icon-badge',
 *   type: 'badge',
 *   props: { color: '$color' },
 *   children: [
 *     { type: 'icon', props: { name: '$icon', size: 4 } },
 *     { type: 'text', props: { level: 'span' }, content: '$text' }
 *   ]
 * }
 * ```
 *
 * @see specs/app/blocks/block/block.schema.json
 */
export const BlockSchema = Schema.Struct({
  name: BlockNameSchema,
  type: Schema.String.annotations({
    description: 'Component type',
    examples: ['container', 'flex', 'grid', 'card', 'text', 'button'],
  }),
  props: Schema.optional(BlockPropsSchema),
  children: Schema.optional(BlockChildrenSchema),
  content: Schema.optional(
    Schema.String.annotations({
      description: 'Text content (may contain $variable references)',
    })
  ),
}).annotations({
  title: 'Block Template',
  description: 'A reusable UI component template with variable placeholders',
})

export type BlockName = Schema.Schema.Type<typeof BlockNameSchema>
export type Block = Schema.Schema.Type<typeof BlockSchema>
