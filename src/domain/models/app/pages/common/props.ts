/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Generic component properties Record
 *
 * Flexible Record supporting various property types:
 * - String: className, id, text (may contain $variable references)
 * - Number: size, width, height, index
 * - Boolean: enabled, visible, disabled
 * - Object: style, config, nested properties
 * - Array: items, options, children data
 *
 * Property keys must be camelCase starting with a letter.
 * String values support $variable references for runtime substitution.
 *
 * @example
 * ```typescript
 * const props = {
 *   className: 'text-center mb-4',
 *   id: 'hero-section',
 *   maxWidth: 'max-w-7xl',
 *   size: 16,
 *   enabled: true,
 *   style: { padding: '1rem', margin: '2rem' },
 *   items: ['one', 'two', 'three']
 * }
 *
 * const propsWithVars = {
 *   color: '$primaryColor',
 *   text: 'Welcome to $siteName'
 * }
 * ```
 *
 * @see specs/app/pages/common/props.schema.json
 */
export const PropsSchema = Schema.Record({
  key: Schema.String.pipe(
    Schema.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/, {
      message: () =>
        'Property key must be camelCase starting with a letter (e.g., className, maxWidth, isEnabled)',
    })
  ),
  value: Schema.Union(
    Schema.String.annotations({
      description: 'String value (may contain $variable references)',
    }),
    Schema.Number.annotations({
      description: 'Numeric value',
    }),
    Schema.Boolean.annotations({
      description: 'Boolean value',
    }),
    Schema.Record({ key: Schema.String, value: Schema.Unknown }).annotations({
      description: 'Nested object value',
    }),
    Schema.Array(Schema.Unknown).annotations({
      description: 'Array value',
    })
  ),
}).annotations({
  title: 'Component Props',
  description:
    'Generic properties object for components, supporting both static values and variable references',
})

export type Props = Schema.Schema.Type<typeof PropsSchema>
