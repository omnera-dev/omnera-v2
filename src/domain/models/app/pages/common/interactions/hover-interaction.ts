/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Transition easing function types
 *
 * Standard CSS easing functions for smooth transitions:
 * - linear: Constant speed
 * - ease: Slow start, fast middle, slow end (default)
 * - ease-in: Slow start, fast end
 * - ease-out: Fast start, slow end
 * - ease-in-out: Slow start and end, fast middle
 */
export const EasingFunctionSchema = Schema.Literal(
  'linear',
  'ease',
  'ease-in',
  'ease-out',
  'ease-in-out'
).annotations({
  description: 'Transition timing function',
})

/**
 * CSS duration pattern (ms or s)
 *
 * Must be a number followed by 'ms' (milliseconds) or 's' (seconds).
 *
 * @example
 * ```typescript
 * const durations = ['200ms', '0.5s', '1s', '1500ms']
 * ```
 */
export const DurationSchema = Schema.String.pipe(
  Schema.pattern(/^[0-9]+(ms|s)$/, {
    message: () => 'Duration must be a number followed by ms or s (e.g., 200ms, 0.5s)',
  })
)

/**
 * Visual changes when user hovers over component
 *
 * Supports CSS properties for hover effects (all optional):
 * - transform: CSS transforms (scale, rotate, translate)
 * - opacity: Opacity value (0-1)
 * - backgroundColor: Background color
 * - color: Text color
 * - borderColor: Border color
 * - shadow: Box shadow
 * - duration: Transition duration (default: 200ms)
 * - easing: Transition easing (default: ease-out)
 *
 * All properties are animated smoothly using CSS transitions.
 *
 * @example
 * ```typescript
 * const hoverEffect = {
 *   transform: 'scale(1.05)',
 *   shadow: '0 10px 25px rgba(0,0,0,0.15)',
 *   duration: '200ms',
 *   easing: 'ease-out'
 * }
 *
 * const colorChange = {
 *   opacity: 0.8,
 *   backgroundColor: '#007bff',
 *   color: '#ffffff'
 * }
 * ```
 *
 * @see specs/app/pages/common/interactions/hover-interaction.schema.json
 */
export const HoverInteractionSchema = Schema.Struct({
  transform: Schema.optional(
    Schema.String.annotations({
      description: 'CSS transform (scale, rotate, translate)',
      examples: ['scale(1.05)', 'translateY(-4px)', 'rotate(5deg)'],
    })
  ),
  opacity: Schema.optional(
    Schema.Number.pipe(Schema.between(0, 1)).annotations({
      description: 'Opacity value (0-1)',
    })
  ),
  backgroundColor: Schema.optional(
    Schema.String.annotations({
      description: 'Background color on hover',
    })
  ),
  color: Schema.optional(
    Schema.String.annotations({
      description: 'Text color on hover',
    })
  ),
  borderColor: Schema.optional(
    Schema.String.annotations({
      description: 'Border color on hover',
    })
  ),
  shadow: Schema.optional(
    Schema.String.annotations({
      description: 'Box shadow on hover',
      examples: ['0 10px 25px rgba(0,0,0,0.1)'],
    })
  ),
  duration: Schema.optional(DurationSchema),
  easing: Schema.optional(EasingFunctionSchema),
}).annotations({
  title: 'Hover Interaction',
  description: 'Visual changes when user hovers over component',
})

export type EasingFunction = Schema.Schema.Type<typeof EasingFunctionSchema>
export type Duration = Schema.Schema.Type<typeof DurationSchema>
export type HoverInteraction = Schema.Schema.Type<typeof HoverInteractionSchema>
