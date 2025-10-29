/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Hex color pattern (6-digit hex code)
 *
 * Validates hex color format: #RRGGBB
 * - Starts with #
 * - Followed by exactly 6 hex digits (0-9, A-F, case-insensitive)
 *
 * @example
 * Valid: #FF5733, #ffffff, #1A2B3C
 * Invalid: #FFF (too short), #GGGGGG (invalid chars), FF5733 (missing #)
 */
export const HexColorSchema = Schema.String.pipe(
  Schema.pattern(/^#[0-9A-Fa-f]{6}$/, {
    message: () => 'Color must be a 6-digit hex code (e.g., #FF5733, #1A2B3C)',
  })
).annotations({
  description: 'Hex color code (#RRGGBB)',
})

/**
 * Banner link configuration
 *
 * Optional clickable link within banner for call-to-action.
 *
 * Required properties:
 * - href: Link destination URL
 * - label: Link text displayed to user
 *
 * @example
 * ```typescript
 * const link = {
 *   href: '/features',
 *   label: 'Learn more'
 * }
 * ```
 */
export const BannerLinkSchema = Schema.Struct({
  href: Schema.String.annotations({
    description: 'Link URL',
  }),
  label: Schema.String.annotations({
    description: 'Link text',
  }),
}).annotations({
  description: 'Banner link',
})

/**
 * Top banner/announcement bar configuration
 *
 * Displays a prominent message at the very top of the page (above navigation).
 * Common use cases: promotions, announcements, cookie consent, urgent alerts.
 *
 * Required properties:
 * - enabled: Whether to show the banner (default: false, opt-in)
 *
 * Optional properties:
 * - text: Banner message content
 * - link: Call-to-action link { href, label }
 * - gradient: CSS gradient background (takes precedence over backgroundColor)
 * - backgroundColor: Solid background color (#RRGGBB hex)
 * - textColor: Text color (#RRGGBB hex)
 * - dismissible: Allow users to close banner permanently
 * - sticky: Banner sticks to top on scroll
 *
 * Visual styling:
 * - gradient vs backgroundColor: gradient takes precedence if both set
 * - textColor: Ensure WCAG contrast (4.5:1 minimum)
 * - sticky: position: sticky, z-index: 50
 *
 * Dismissible behavior:
 * - Adds close button (×) in top-right
 * - Stores dismissal in localStorage
 * - Banner stays hidden on future visits
 *
 * @example
 * ```typescript
 * const promoBanner = {
 *   enabled: true,
 *   text: '🎉 New feature available!',
 *   link: {
 *     href: '/features',
 *     label: 'Learn more'
 *   },
 *   gradient: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
 *   dismissible: true
 * }
 *
 * const alertBanner = {
 *   enabled: true,
 *   text: '⚠️ Scheduled maintenance tonight 11 PM - 2 AM PST',
 *   backgroundColor: '#DC2626',
 *   textColor: '#FFFFFF',
 *   sticky: true
 * }
 * ```
 *
 * @see specs/app/pages/layout/banner/banner.schema.json
 */
export const BannerSchema = Schema.Struct({
  enabled: Schema.Boolean.annotations({
    description: 'Whether to show the banner',
    default: false,
  }),
  text: Schema.optional(
    Schema.String.annotations({
      description: 'Banner text content',
    })
  ),
  link: Schema.optional(BannerLinkSchema),
  gradient: Schema.optional(
    Schema.String.annotations({
      description: 'CSS gradient background',
    })
  ),
  backgroundColor: Schema.optional(HexColorSchema),
  textColor: Schema.optional(HexColorSchema),
  dismissible: Schema.optional(
    Schema.Boolean.annotations({
      description: 'Whether users can dismiss the banner',
      default: false,
    })
  ),
  sticky: Schema.optional(
    Schema.Boolean.annotations({
      description: 'Whether the banner sticks to the top on scroll',
      default: false,
    })
  ),
}).annotations({
  title: 'Banner Configuration',
  description: 'Top banner/announcement bar configuration',
})

export type HexColor = Schema.Schema.Type<typeof HexColorSchema>
export type BannerLink = Schema.Schema.Type<typeof BannerLinkSchema>
export type Banner = Schema.Schema.Type<typeof BannerSchema>
