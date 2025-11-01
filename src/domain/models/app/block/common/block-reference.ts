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
 * Simple Block Reference (reference to a block by name without variables)
 *
 * Simplified syntax for referencing blocks that don't require variable substitution.
 * Uses the `block` property to identify the block by name.
 *
 * @example
 * ```typescript
 * const simpleReference = {
 *   block: 'shared-block'
 * }
 * ```
 */
export const SimpleBlockReferenceSchema = Schema.Struct({
  block: BlockReferenceNameSchema,
}).pipe(
  Schema.annotations({
    title: 'Simple Block Reference',
    description: 'Reference to a block by name without variable substitution',
  })
)

/**
 * Block Reference (reference to a reusable block template with variable substitution)
 *
 * Allows referencing and customizing predefined block templates.
 * Supports two syntaxes:
 * 1. Full syntax: { $ref: 'block-name', vars: {...} }
 * 2. Shorthand syntax: { block: 'block-name' } (vars default to empty object)
 *
 * @example
 * ```typescript
 * // Full syntax
 * const reference1 = {
 *   $ref: 'icon-badge',
 *   vars: {
 *     color: 'orange',
 *     icon: 'users',
 *     text: '6 à 15 personnes',
 *   },
 * }
 *
 * // Shorthand syntax
 * const reference2 = {
 *   block: 'shared-block',
 * }
 * ```
 *
 * @see specs/app/blocks/common/block-reference.schema.json
 */
const FullBlockReferenceSchema = Schema.Struct({
  $ref: BlockReferenceNameSchema,
  vars: BlockVarsSchema,
}).pipe(
  Schema.annotations({
    title: 'Block Reference (Full Syntax)',
    description: 'Reference to a reusable block template with variable substitution',
  })
)

const ShorthandBlockReferenceSchema = Schema.Struct({
  block: BlockReferenceNameSchema,
}).pipe(
  Schema.annotations({
    title: 'Block Reference (Shorthand)',
    description: 'Shorthand reference to a reusable block without variables',
  })
)

export const BlockReferenceSchema = Schema.Union(
  FullBlockReferenceSchema,
  ShorthandBlockReferenceSchema
).pipe(
  Schema.annotations({
    title: 'Block Reference',
    description:
      'Reference to a reusable block template. Supports full syntax ($ref + vars) or shorthand (block name only).',
  })
)

export type BlockReferenceName = Schema.Schema.Type<typeof BlockReferenceNameSchema>
export type BlockVars = Schema.Schema.Type<typeof BlockVarsSchema>
export type SimpleBlockReference = Schema.Schema.Type<typeof SimpleBlockReferenceSchema>
export type BlockReference = Schema.Schema.Type<typeof BlockReferenceSchema>
