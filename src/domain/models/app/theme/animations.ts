/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Animation configuration object
 *
 * Detailed animation config with duration, easing, delay, and keyframes.
 *
 * @example
 * ```typescript
 * const config = {
 *   enabled: true,
 *   duration: '300ms',
 *   easing: 'ease-in-out',
 *   delay: '0ms',
 * }
 * ```
 *
 * @see specs/app/theme/animations/animations.schema.json#/patternProperties/.../oneOf[2]
 */
export const AnimationConfigObjectSchema = Schema.Struct({
  enabled: Schema.optional(Schema.Boolean),
  duration: Schema.optional(Schema.String),
  easing: Schema.optional(Schema.String),
  delay: Schema.optional(Schema.String),
  keyframes: Schema.optional(Schema.Record({ key: Schema.String, value: Schema.Unknown })),
}).pipe(
  Schema.annotations({
    title: 'Animation Configuration Object',
    description: 'Detailed animation configuration',
  })
)

/**
 * Animation value (boolean, string, or object)
 *
 * Flexible animation configuration:
 * - Boolean: Simple enable/disable (true/false)
 * - String: CSS animation value or class name
 * - Object: Detailed config (duration, easing, delay, keyframes)
 *
 * @example
 * ```typescript
 * const simple = true
 * const className = 'animate-fade-in'
 * const detailed = {
 *   enabled: true,
 *   duration: '300ms',
 *   easing: 'ease-in-out',
 * }
 * ```
 *
 * @see specs/app/theme/animations/animations.schema.json#/patternProperties/.../oneOf
 */
export const AnimationValueSchema = Schema.Union(
  Schema.Boolean,
  Schema.String,
  AnimationConfigObjectSchema
).pipe(
  Schema.annotations({
    title: 'Animation Value',
    description: 'Animation configuration (boolean, string, or object)',
  })
)

/**
 * Animation configuration (animation and transition design tokens)
 *
 * Map of animation names to configuration values.
 * Supports multiple formats:
 * - Boolean for simple enable/disable
 * - String for CSS values or class names
 * - Object for detailed configuration
 *
 * @example
 * ```typescript
 * const animations = {
 *   fadeIn: true,
 *   slideUp: 'animate-slide-up',
 *   modalOpen: {
 *     enabled: true,
 *     duration: '300ms',
 *     easing: 'ease-in-out',
 *   },
 * }
 * ```
 *
 * @see specs/app/theme/animations/animations.schema.json
 */
export const AnimationsConfigSchema = Schema.Record({
  key: Schema.String.pipe(
    Schema.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/, {
      message: () =>
        'Animation key must start with a letter and contain only alphanumeric characters',
    }),
    Schema.annotations({
      title: 'Animation Key',
      description: 'Animation name (alphanumeric)',
      examples: ['fadeIn', 'slideUp', 'modalOpen'],
    })
  ),
  value: AnimationValueSchema,
}).pipe(
  Schema.annotations({
    title: 'Animation Configuration',
    description: 'Animation and transition design tokens',
  })
)

export type AnimationConfigObject = Schema.Schema.Type<typeof AnimationConfigObjectSchema>
export type AnimationValue = Schema.Schema.Type<typeof AnimationValueSchema>
export type AnimationsConfig = Schema.Schema.Type<typeof AnimationsConfigSchema>
