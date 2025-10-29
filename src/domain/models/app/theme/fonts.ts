/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Font weight value (100-900 in increments of 100)
 *
 * Standard font weights as defined in CSS:
 * - 100: Thin
 * - 200: Extra Light
 * - 300: Light
 * - 400: Normal/Regular
 * - 500: Medium
 * - 600: Semi Bold
 * - 700: Bold
 * - 800: Extra Bold
 * - 900: Black
 *
 * @example
 * ```typescript
 * const regular = 400
 * const bold = 700
 * ```
 *
 * @see specs/app/theme/fonts/fonts.schema.json#/patternProperties/.../properties/weights
 */
export const FontWeightSchema = Schema.Literal(100, 200, 300, 400, 500, 600, 700, 800, 900).pipe(
  Schema.annotations({
    title: 'Font Weight',
    description: 'Font weight value (100-900 in increments of 100)',
  })
)

/**
 * Font style (normal, italic, oblique)
 *
 * @example
 * ```typescript
 * const normal = 'normal'  // Default, upright text
 * const italic = 'italic'  // Cursive or slanted design
 * ```
 *
 * @see specs/app/theme/fonts/fonts.schema.json#/patternProperties/.../properties/style
 */
export const FontStyleSchema = Schema.Literal('normal', 'italic', 'oblique').pipe(
  Schema.annotations({
    title: 'Font Style',
    description: 'Font style',
  })
)

/**
 * Text transformation (none, uppercase, lowercase, capitalize)
 *
 * Applied via CSS text-transform property:
 * - 'none': No transformation
 * - 'uppercase': ALL CAPS
 * - 'lowercase': all lowercase
 * - 'capitalize': First Letter Of Each Word
 *
 * @example
 * ```typescript
 * const transform = 'uppercase'  // "hello" → "HELLO"
 * ```
 *
 * @see specs/app/theme/fonts/fonts.schema.json#/patternProperties/.../properties/transform
 */
export const FontTransformSchema = Schema.Literal(
  'none',
  'uppercase',
  'lowercase',
  'capitalize'
).pipe(
  Schema.annotations({
    title: 'Text Transform',
    description: 'Text transformation',
  })
)

/**
 * Font category name (title, body, mono, etc.)
 *
 * Semantic font category keys for organizing typography:
 * - title: Display fonts for headings
 * - body: Body text fonts for readability
 * - mono: Monospace fonts for code
 *
 * Must be alphabetic characters only (a-zA-Z)
 *
 * @example
 * ```typescript
 * const key1 = 'title'
 * const key2 = 'body'
 * const key3 = 'mono'
 * ```
 *
 * @see specs/app/theme/fonts/fonts.schema.json#/patternProperties
 */
export const FontCategoryKeySchema = Schema.String.pipe(
  Schema.pattern(/^[a-zA-Z]+$/, {
    message: () => 'Font category key must contain only alphabetic characters (a-zA-Z)',
  }),
  Schema.annotations({
    title: 'Font Category Key',
    description: 'Semantic font category name (alphabetic characters only)',
    examples: ['title', 'body', 'mono', 'heading', 'label'],
  })
)

/**
 * Individual font configuration
 *
 * Defines a single font with:
 * - family: Primary font name (required)
 * - fallback: Fallback font stack (optional)
 * - weights: Available font weights (optional)
 * - style: Font style (optional, defaults to 'normal')
 * - size: Default font size (optional)
 * - lineHeight: Default line height (optional)
 * - letterSpacing: Letter spacing (optional)
 * - transform: Text transformation (optional)
 * - url: Font file URL (optional, for remote/Google Fonts)
 *
 * @example
 * ```typescript
 * // Minimal font (only family required)
 * const minimal = {
 *   family: 'Inter'
 * }
 *
 * // Complete body font configuration
 * const body = {
 *   family: 'Inter',
 *   fallback: 'system-ui, sans-serif',
 *   weights: [300, 400, 500, 600, 700],
 *   style: 'normal',
 *   size: '16px',
 *   lineHeight: '1.5',
 *   letterSpacing: '0',
 *   transform: 'none',
 *   url: 'https://fonts.googleapis.com/css2?family=Inter'
 * }
 *
 * // Display font with transformation
 * const title = {
 *   family: 'Bely Display',
 *   fallback: 'Georgia, serif',
 *   weights: [400, 700],
 *   transform: 'lowercase',
 *   letterSpacing: '0.05em'
 * }
 * ```
 *
 * @see specs/app/theme/fonts/fonts.schema.json#/patternProperties/...
 */
export const FontConfigItemSchema = Schema.Struct({
  family: Schema.String.pipe(
    Schema.annotations({
      title: 'Font Family',
      description: 'Primary font family name',
    })
  ),
  fallback: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        title: 'Fallback Font Stack',
        description: 'Fallback font stack',
        examples: ['system-ui, sans-serif', 'Georgia, serif', 'monospace'],
      })
    )
  ),
  weights: Schema.optional(
    Schema.Array(FontWeightSchema).pipe(
      Schema.annotations({
        title: 'Font Weights',
        description: 'Available font weights',
        examples: [
          [400, 700],
          [300, 400, 500, 600, 700],
        ],
      })
    )
  ),
  style: Schema.optional(
    FontStyleSchema.pipe(
      Schema.annotations({
        default: 'normal',
      })
    )
  ),
  size: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        title: 'Font Size',
        description: 'Default font size',
        examples: ['16px', '1rem', '14px'],
      })
    )
  ),
  lineHeight: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        title: 'Line Height',
        description: 'Default line height',
        examples: ['1.5', '1.75', '24px'],
      })
    )
  ),
  letterSpacing: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        title: 'Letter Spacing',
        description: 'Letter spacing',
        examples: ['0', '0.05em', '-0.01em'],
      })
    )
  ),
  transform: Schema.optional(FontTransformSchema),
  url: Schema.optional(
    Schema.String.pipe(
      Schema.annotations({
        title: 'Font URL',
        description: 'Font file URL or Google Fonts URL',
        examples: ['https://fonts.googleapis.com/css2?family=Inter', '/fonts/bely-display.woff2'],
      })
    )
  ),
}).pipe(
  Schema.annotations({
    title: 'Font Configuration Item',
    description: 'Individual font configuration with family and optional properties',
  })
)

/**
 * Font configuration (typography design tokens)
 *
 * Map of semantic font categories to font configurations.
 * Each key is a font category name (title, body, mono, etc.)
 * and each value is a font configuration object.
 *
 * This creates a semantic typography system where:
 * - title: Display fonts for headings
 * - body: Readable fonts for body text
 * - mono: Monospace fonts for code
 * - (custom categories as needed)
 *
 * Key behaviors:
 * - Only 'family' property is required per font
 * - Fallback fonts provide graceful degradation
 * - Multiple weights support font-weight variations
 * - Google Fonts and self-hosted fonts supported
 *
 * @example
 * ```typescript
 * // Multiple font categories
 * const fonts = {
 *   title: {
 *     family: 'Bely Display',
 *     fallback: 'Georgia, serif',
 *     weights: [400, 700],
 *     transform: 'lowercase',
 *     letterSpacing: '0.05em'
 *   },
 *   body: {
 *     family: 'Inter',
 *     fallback: 'system-ui, sans-serif',
 *     weights: [300, 400, 500, 600, 700],
 *     size: '16px',
 *     lineHeight: '1.5'
 *   },
 *   mono: {
 *     family: 'JetBrains Mono',
 *     fallback: 'monospace',
 *     weights: [400, 700]
 *   }
 * }
 * ```
 *
 * @see specs/app/theme/fonts/fonts.schema.json
 */
export const FontsConfigSchema = Schema.Record({
  key: FontCategoryKeySchema,
  value: FontConfigItemSchema,
}).pipe(
  Schema.annotations({
    title: 'Font Configuration',
    description: 'Typography design tokens for font families and styles',
  })
)

export type FontWeight = Schema.Schema.Type<typeof FontWeightSchema>
export type FontStyle = Schema.Schema.Type<typeof FontStyleSchema>
export type FontTransform = Schema.Schema.Type<typeof FontTransformSchema>
export type FontCategoryKey = Schema.Schema.Type<typeof FontCategoryKeySchema>
export type FontConfigItem = Schema.Schema.Type<typeof FontConfigItemSchema>
export type FontsConfig = Schema.Schema.Type<typeof FontsConfigSchema>
