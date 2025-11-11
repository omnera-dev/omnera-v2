/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Footer link target
 *
 * - _self: Same window/tab (default for internal links)
 * - _blank: New window/tab (for external links)
 */
export const FooterLinkTargetSchema = Schema.Literal('_self', '_blank').annotations({
  description: 'Footer link target',
})

/**
 * Social media platform
 *
 * Supported platforms with auto icon mapping:
 * - facebook: Facebook 'f' logo (blue)
 * - twitter: Twitter/X bird logo (black)
 * - instagram: Instagram camera logo (gradient)
 * - linkedin: LinkedIn 'in' logo (blue)
 * - youtube: YouTube play button (red)
 * - github: GitHub octocat logo (black)
 * - tiktok: TikTok musical note (black/white)
 */
export const SocialPlatformSchema = Schema.Literal(
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'youtube',
  'github',
  'tiktok'
).annotations({
  description: 'Social media platform',
})

/**
 * Footer link item
 *
 * Clickable link in footer columns or legal section.
 *
 * Required properties:
 * - label: Link text
 * - href: Destination URL
 *
 * Optional properties:
 * - target: Link target (_self or _blank for external links)
 *
 * @example
 * ```typescript
 * const internalLink = {
 *   label: 'Features',
 *   href: '/features'
 * }
 *
 * const externalLink = {
 *   label: 'Documentation',
 *   href: 'https://docs.external.com',
 *   target: '_blank'
 * }
 * ```
 */
export const FooterLinkSchema = Schema.Struct({
  label: Schema.String,
  href: Schema.String,
  target: Schema.optional(FooterLinkTargetSchema),
}).annotations({
  description: 'Footer link',
})

/**
 * Footer column
 *
 * Vertical column of links in footer, typically grouped by category.
 *
 * Required properties:
 * - title: Column heading (e.g., "Product", "Company", "Resources")
 * - links: Array of footer links
 *
 * Common patterns:
 * - Product: Features, Pricing, Integrations
 * - Company: About, Blog, Careers, Press
 * - Resources: Documentation, API, Support
 * - Legal: Privacy, Terms, Cookies
 *
 * @example
 * ```typescript
 * const productColumn = {
 *   title: 'Product',
 *   links: [
 *     { label: 'Features', href: '/features' },
 *     { label: 'Pricing', href: '/pricing' },
 *     { label: 'Changelog', href: '/changelog' }
 *   ]
 * }
 * ```
 */
export const FooterColumnSchema = Schema.Struct({
  title: Schema.String.annotations({
    description: 'Column heading',
  }),
  links: Schema.Array(FooterLinkSchema),
}).annotations({
  description: 'Footer column',
})

/**
 * Social media link
 *
 * Link to social media profile with auto icon mapping.
 *
 * Required properties:
 * - platform: Social platform enum (facebook, twitter, etc.)
 * - url: Social profile URL (format: uri)
 *
 * Optional properties:
 * - icon: Custom icon name (overrides default platform icon)
 *
 * Icon mapping:
 * - Platform determines icon automatically (twitter → Twitter icon)
 * - Custom icon property overrides default
 * - Use custom icon for white-label or brand-specific designs
 *
 * @example
 * ```typescript
 * const defaultIcon = {
 *   platform: 'twitter',
 *   url: 'https://twitter.com/company'
 * }
 *
 * const customIcon = {
 *   platform: 'github',
 *   url: 'https://github.com/company',
 *   icon: 'custom-github-brand'
 * }
 * ```
 */
export const SocialLinkSchema = Schema.Struct({
  platform: SocialPlatformSchema,
  url: Schema.String.annotations({
    description: 'Social profile URL',
    format: 'uri',
  }),
  icon: Schema.optional(
    Schema.String.annotations({
      description: 'Custom icon name if different from platform',
    })
  ),
}).annotations({
  description: 'Social media link',
})

/**
 * Social media section configuration
 *
 * Footer section for social media links with optional heading.
 *
 * Optional properties:
 * - title: Section heading (default: "Follow Us")
 * - links: Array of social media links
 *
 * @example
 * ```typescript
 * const social = {
 *   title: 'Connect With Us',
 *   links: [
 *     { platform: 'twitter', url: 'https://twitter.com/company' },
 *     { platform: 'linkedin', url: 'https://linkedin.com/company/company' },
 *     { platform: 'github', url: 'https://github.com/company' }
 *   ]
 * }
 * ```
 */
export const SocialSectionSchema = Schema.Struct({
  title: Schema.optional(
    Schema.String.annotations({
      description: 'Social section title',
      default: 'Follow Us',
    })
  ),
  links: Schema.optional(Schema.Array(SocialLinkSchema)),
}).annotations({
  description: 'Social media section',
})

/**
 * Newsletter subscription configuration
 *
 * Email capture form in footer for growing mailing list.
 *
 * All properties optional:
 * - enabled: Show newsletter form (default: false)
 * - title: Form heading (default: "Subscribe to our newsletter")
 * - description: Value proposition text
 * - placeholder: Email input placeholder (default: "Enter your email")
 * - buttonText: Submit button text (default: "Subscribe")
 *
 * Integration:
 * - Form submits to POST /api/newsletter
 * - Validates email format client-side
 * - Shows success/error feedback
 *
 * @example
 * ```typescript
 * const newsletter = {
 *   enabled: true,
 *   title: 'Stay in the loop',
 *   description: 'Get weekly updates on new features and best practices',
 *   placeholder: 'your@email.com',
 *   buttonText: 'Subscribe'
 * }
 * ```
 */
export const NewsletterSchema = Schema.Struct({
  enabled: Schema.optional(
    Schema.Boolean.annotations({
      description: 'Whether to show newsletter form',
      default: false,
    })
  ),
  title: Schema.optional(
    Schema.String.annotations({
      description: 'Newsletter title',
      default: 'Subscribe to our newsletter',
    })
  ),
  description: Schema.optional(
    Schema.String.annotations({
      description: 'Newsletter description',
    })
  ),
  placeholder: Schema.optional(
    Schema.String.annotations({
      description: 'Email input placeholder',
      default: 'Enter your email',
    })
  ),
  buttonText: Schema.optional(
    Schema.String.annotations({
      description: 'Submit button text',
      default: 'Subscribe',
    })
  ),
}).annotations({
  description: 'Newsletter subscription',
})

/**
 * Footer layout and content configuration
 *
 * Comprehensive footer with up to 5 sections:
 * 1. Logo + description (branding)
 * 2. Link columns (navigation)
 * 3. Social links (community)
 * 4. Newsletter (email capture)
 * 5. Copyright + legal (compliance)
 *
 * Required properties:
 * - enabled: Whether to show footer (default: true, most sites have footers)
 *
 * Optional properties:
 * - logo: Footer logo path (often monochrome version)
 * - description: Company description or tagline
 * - columns: Array of link columns (Product, Company, Resources, etc.)
 * - social: Social media links section
 * - newsletter: Email subscription form
 * - copyright: Copyright text (© 2024 Company Inc. All rights reserved.)
 * - legal: Array of legal links (Privacy Policy, Terms, Cookies)
 *
 * Common layouts:
 * - Minimal: copyright only
 * - Standard: logo + columns + copyright + legal
 * - Enterprise: all 5 sections (logo, columns, social, newsletter, legal)
 *
 * @example
 * ```typescript
 * const minimalFooter = {
 *   enabled: true,
 *   copyright: '© 2024 Company Inc. All rights reserved.'
 * }
 *
 * const standardFooter = {
 *   enabled: true,
 *   logo: './logo-footer.svg',
 *   description: 'Building the future of web applications',
 *   columns: [
 *     {
 *       title: 'Product',
 *       links: [
 *         { label: 'Features', href: '/features' },
 *         { label: 'Pricing', href: '/pricing' }
 *       ]
 *     },
 *     {
 *       title: 'Company',
 *       links: [
 *         { label: 'About', href: '/about' },
 *         { label: 'Blog', href: '/blog' }
 *       ]
 *     }
 *   ],
 *   copyright: '© 2024 Company Inc. All rights reserved.',
 *   legal: [
 *     { label: 'Privacy Policy', href: '/privacy' },
 *     { label: 'Terms of Service', href: '/terms' }
 *   ]
 * }
 * ```
 *
 * @see specs/app/pages/layout/footer/footer.schema.json
 */
export const FooterSchema = Schema.Struct({
  enabled: Schema.optional(
    Schema.Boolean.annotations({
      description: 'Whether to show the footer',
      default: true,
    })
  ),
  logo: Schema.optional(
    Schema.String.annotations({
      description: 'Footer logo path',
    })
  ),
  description: Schema.optional(
    Schema.String.annotations({
      description: 'Company description or tagline',
    })
  ),
  columns: Schema.optional(Schema.Array(FooterColumnSchema)),
  social: Schema.optional(SocialSectionSchema),
  newsletter: Schema.optional(NewsletterSchema),
  copyright: Schema.optional(
    Schema.String.annotations({
      description: 'Copyright text',
    })
  ),
  legal: Schema.optional(Schema.Array(FooterLinkSchema)),
  email: Schema.optional(
    Schema.String.annotations({
      description: 'Contact email address',
      format: 'email',
    })
  ),
}).annotations({
  title: 'Footer Configuration',
  description: 'Footer layout and content configuration',
})

export type FooterLinkTarget = Schema.Schema.Type<typeof FooterLinkTargetSchema>
export type SocialPlatform = Schema.Schema.Type<typeof SocialPlatformSchema>
export type FooterLink = Schema.Schema.Type<typeof FooterLinkSchema>
export type FooterColumn = Schema.Schema.Type<typeof FooterColumnSchema>
export type SocialLink = Schema.Schema.Type<typeof SocialLinkSchema>
export type SocialSection = Schema.Schema.Type<typeof SocialSectionSchema>
export type Newsletter = Schema.Schema.Type<typeof NewsletterSchema>
export type Footer = Schema.Schema.Type<typeof FooterSchema>
