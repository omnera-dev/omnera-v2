/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Spacing configuration (design tokens for consistent layout)
 *
 * Map of semantic spacing names to values (Tailwind classes or CSS values).
 * Supports:
 * - Tailwind utility classes (py-16, px-4, gap-6)
 * - Responsive variants (py-16 sm:py-20)
 * - Container constraints (max-w-7xl mx-auto px-4)
 * - Raw CSS values (2rem, 16px, 1.5em)
 *
 * @example
 * ```typescript
 * const spacing = {
 *   section: 'py-16 sm:py-20',
 *   container: 'max-w-7xl mx-auto px-4',
 *   gap: 'gap-6',
 *   padding: 'p-6',
 * }
 * ```
 *
 * @see specs/app/theme/spacing/spacing.schema.json
 */
export const SpacingConfigSchema = Schema.Record({
  key: Schema.String.pipe(
    Schema.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/, {
      message: () =>
        'Spacing key must start with a letter and contain only alphanumeric characters',
    }),
    Schema.annotations({
      title: 'Spacing Key',
      description: 'Semantic spacing name (alphanumeric)',
      examples: ['section', 'container', 'gap', 'padding'],
    })
  ),
  value: Schema.String.pipe(
    Schema.annotations({
      title: 'Spacing Value',
      description: 'Spacing value (Tailwind classes or CSS values)',
      examples: ['py-16 sm:py-20', 'max-w-7xl mx-auto px-4', '2rem', '16px'],
    })
  ),
}).pipe(
  Schema.annotations({
    title: 'Spacing Configuration',
    description: 'Spacing design tokens for consistent layout',
  })
)

export type SpacingConfig = Schema.Schema.Type<typeof SpacingConfigSchema>
