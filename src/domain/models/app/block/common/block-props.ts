/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Block property value (string, number, boolean, object, or array)
 *
 * Flexible property values supporting:
 * - String: May contain $variable references for template substitution
 * - Number: Numeric values
 * - Boolean: True/false flags
 * - Object: Nested property objects
 * - Array: Lists of values
 *
 * @example
 * ```typescript
 * const stringProp = 'text-$color bg-$bgColor'
 * const numberProp = 100
 * const booleanProp = true
 * const objectProp = { nested: 'value' }
 * const arrayProp = [1, 2, 3]
 * ```
 *
 * @see specs/app/blocks/common/block-props.schema.json#/patternProperties/.../oneOf
 */
export const BlockPropValueSchema: Schema.Schema<
  string | number | boolean | Record<string, unknown> | readonly unknown[]
> = Schema.Union(
  Schema.String,
  Schema.Number,
  Schema.Boolean,
  Schema.Record({ key: Schema.String, value: Schema.Unknown }),
  Schema.Array(Schema.Unknown)
)

/**
 * Block Props (properties for block templates with variable references)
 *
 * Dynamic object supporting any valid JavaScript property name.
 * Properties can be strings (with $variable), numbers, booleans, objects, or arrays.
 *
 * Used for template customization and variable substitution.
 *
 * @example
 * ```typescript
 * const props = {
 *   className: 'text-$color bg-$bgColor',
 *   size: '$size',
 *   enabled: true,
 *   maxWidth: 'max-w-$width',
 *   count: 10,
 * }
 * ```
 *
 * @see specs/app/blocks/common/block-props.schema.json
 */
export const BlockPropsSchema = Schema.Record({
  key: Schema.String.pipe(
    Schema.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/, {
      message: () =>
        'Block prop key must start with a letter and contain only alphanumeric characters',
    }),
    Schema.annotations({
      title: 'Block Prop Key',
      description: 'Valid JavaScript property name (alphanumeric)',
      examples: ['className', 'size', 'enabled', 'maxWidth'],
    })
  ),
  value: BlockPropValueSchema,
}).pipe(
  Schema.annotations({
    title: 'Block Props',
    description: 'Properties for block templates, supporting variable references',
  })
)

export type BlockPropValue = Schema.Schema.Type<typeof BlockPropValueSchema>
export type BlockProps = Schema.Schema.Type<typeof BlockPropsSchema>
