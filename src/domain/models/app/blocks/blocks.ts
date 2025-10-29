/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { BlockSchema } from './block'

/**
 * Array of reusable UI component templates
 *
 * Blocks provide a component library that can be referenced across pages
 * using the $ref pattern. Each block defines a template with variable
 * placeholders ($variable) that are substituted when the block is instantiated.
 *
 * Benefits:
 * - DRY: Define once, reuse multiple times
 * - Consistency: Centralized updates affect all instances
 * - Maintainability: Single source of truth for UI patterns
 *
 * @example
 * ```typescript
 * const blocks = [
 *   {
 *     name: 'icon-badge',
 *     type: 'badge',
 *     props: { color: '$color' },
 *     children: [
 *       { type: 'icon', props: { name: '$icon' } },
 *       { type: 'text', content: '$text' }
 *     ]
 *   },
 *   {
 *     name: 'section-header',
 *     type: 'container',
 *     props: { className: 'text-center mb-12' },
 *     children: [
 *       { type: 'text', props: { level: 'h2' }, content: '$title' },
 *       { type: 'text', props: { level: 'p' }, content: '$subtitle' }
 *     ]
 *   }
 * ]
 * ```
 *
 * @see specs/app/blocks/blocks.schema.json
 */
export const BlocksSchema = Schema.Array(BlockSchema).annotations({
  title: 'Reusable Blocks',
  description:
    'Array of reusable UI component templates with variable substitution for use across pages',
})

export type Blocks = Schema.Schema.Type<typeof BlocksSchema>
