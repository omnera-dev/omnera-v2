/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Block reference name (kebab-case identifier)
 *
 * Name of the block to reference (must match a block name in the blocks array).
 * Uses kebab-case format for consistency with web standards.
 *
 * @example
 * ```typescript
 * const ref1 = 'icon-badge'
 * const ref2 = 'section-header'
 * const ref3 = 'call-to-action'
 * ```
 *
 * @see specs/app/blocks/common/block-reference.schema.json#/properties/$ref
 */
export const BlockReferenceNameSchema = Schema.String.pipe(
  Schema.pattern(/^[a-z][a-z0-9-]*$/, {
    message: () =>
      'Block reference name must start with lowercase letter and contain only lowercase letters, numbers, and hyphens (kebab-case)',
  }),
  Schema.annotations({
    title: 'Block Reference Name',
    description: 'Name of the block to reference (kebab-case)',
    examples: ['icon-badge', 'section-header', 'call-to-action'],
  })
)

/**
 * Block variables (for template substitution)
 *
 * Variables to substitute in the block template.
 * Keys are alphanumeric identifiers, values are strings, numbers, or booleans.
 *
 * @example
 * ```typescript
 * const vars = {
 *   color: 'orange',
 *   icon: 'users',
 *   text: '6 à 15 personnes',
 *   count: 10,
 *   enabled: true,
 * }
 * ```
 *
 * @see specs/app/blocks/common/block-reference.schema.json#/properties/vars
 */
export const BlockVarsSchema = Schema.Record({
  key: Schema.String.pipe(
    Schema.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/, {
      message: () =>
        'Block variable key must start with a letter and contain only alphanumeric characters',
    }),
    Schema.annotations({
      title: 'Block Variable Key',
      description: 'Variable name (alphanumeric)',
      examples: ['color', 'icon', 'text', 'titleColor'],
    })
  ),
  value: Schema.Union(Schema.String, Schema.Number, Schema.Boolean),
}).pipe(
  Schema.annotations({
    title: 'Block Variables',
    description: 'Variables to substitute in the block template',
  })
)

/**
 * Block Reference (reference to a reusable block template with variable substitution)
 *
 * Allows referencing and customizing predefined block templates.
 * The $ref property identifies the block, vars provides customization values.
 *
 * @example
 * ```typescript
 * const reference = {
 *   $ref: 'icon-badge',
 *   vars: {
 *     color: 'orange',
 *     icon: 'users',
 *     text: '6 à 15 personnes',
 *   },
 * }
 * ```
 *
 * @see specs/app/blocks/common/block-reference.schema.json
 */
export const BlockReferenceSchema = Schema.Struct({
  $ref: BlockReferenceNameSchema,
  vars: BlockVarsSchema,
}).pipe(
  Schema.annotations({
    title: 'Block Reference',
    description: 'Reference to a reusable block template with variable substitution',
  })
)

export type BlockReferenceName = Schema.Schema.Type<typeof BlockReferenceNameSchema>
export type BlockVars = Schema.Schema.Type<typeof BlockVarsSchema>
export type BlockReference = Schema.Schema.Type<typeof BlockReferenceSchema>
