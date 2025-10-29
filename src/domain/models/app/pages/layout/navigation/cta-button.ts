/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Button style variant
 *
 * 5 visual styles for different emphasis levels:
 * - primary: Highest emphasis (filled, brand color)
 * - secondary: Medium emphasis (filled, neutral color)
 * - outline: Low emphasis (bordered, transparent)
 * - ghost: Minimal emphasis (text only, transparent)
 * - link: Text-only link style (no button appearance)
 */
export const CtaButtonVariantSchema = Schema.Literal(
  'primary',
  'secondary',
  'outline',
  'ghost',
  'link'
).annotations({
  description: 'Button style variant',
})

/**
 * Button size
 *
 * 4 predefined sizes:
 * - sm: Small (compact, sidebars)
 * - md: Medium (default, most common)
 * - lg: Large (hero sections, CTAs)
 * - xl: Extra large (landing pages)
 */
export const CtaButtonSizeSchema = Schema.Literal('sm', 'md', 'lg', 'xl').annotations({
  description: 'Button size',
})

/**
 * Icon position relative to button text
 *
 * - left: Icon before text (default, most common)
 * - right: Icon after text (arrows, external links)
 */
export const CtaButtonIconPositionSchema = Schema.Literal('left', 'right').annotations({
  description: 'Icon position relative to text',
})

/**
 * Call-to-action button configuration
 *
 * Defines a clickable button for primary actions in navigation, sections, or layouts.
 *
 * Required properties:
 * - text: Button label
 * - href: Click destination URL
 *
 * Optional properties:
 * - variant: Visual style (primary, secondary, outline, ghost, link)
 * - size: Button size (sm, md, lg, xl)
 * - color: Theme color name (references theme colors)
 * - icon: Icon name to display
 * - iconPosition: Icon placement (left or right of text)
 *
 * Use cases:
 * - Navigation CTA: "Sign Up", "Get Started", "Try Free"
 * - Hero section: Large primary button for main conversion
 * - Section CTAs: Secondary actions within page sections
 *
 * @example
 * ```typescript
 * const primaryCta = {
 *   text: 'Get Started',
 *   href: '/signup',
 *   variant: 'primary',
 *   size: 'lg',
 *   color: 'orange'
 * }
 *
 * const downloadCta = {
 *   text: 'Download',
 *   href: '/download',
 *   variant: 'outline',
 *   icon: 'download',
 *   iconPosition: 'right'
 * }
 * ```
 *
 * @see specs/app/pages/layout/navigation/cta-button.schema.json
 */
export const CtaButtonSchema = Schema.Struct({
  text: Schema.String.annotations({
    description: 'Button text',
  }),
  href: Schema.String.annotations({
    description: 'Button link destination',
  }),
  variant: Schema.optional(CtaButtonVariantSchema),
  size: Schema.optional(CtaButtonSizeSchema),
  color: Schema.optional(
    Schema.String.annotations({
      description: 'Button color (references theme colors)',
    })
  ),
  icon: Schema.optional(
    Schema.String.annotations({
      description: 'Optional icon name',
    })
  ),
  iconPosition: Schema.optional(CtaButtonIconPositionSchema),
}).annotations({
  title: 'CTA Button',
  description: 'Call-to-action button configuration',
})

export type CtaButtonVariant = Schema.Schema.Type<typeof CtaButtonVariantSchema>
export type CtaButtonSize = Schema.Schema.Type<typeof CtaButtonSizeSchema>
export type CtaButtonIconPosition = Schema.Schema.Type<typeof CtaButtonIconPositionSchema>
export type CtaButton = Schema.Schema.Type<typeof CtaButtonSchema>
