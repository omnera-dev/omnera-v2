/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { AnalyticsSchema } from './analytics'
import { CustomElementsSchema } from './custom-elements'
import { DnsPrefetchSchema } from './dns-prefetch'
import { FaviconSchema } from './favicon'
import { FaviconSetSchema } from './favicon-set'
import { OpenGraphSchema } from './open-graph'
import { PreloadSchema } from './preload'
import { StructuredDataSchema } from './structured-data'
import { TwitterCardSchema } from './twitter-card'

/**
 * Language code format
 *
 * ISO 639-1 language code with optional ISO 3166-1 country code.
 * - Pattern: ^[a-z]{2}(-[A-Z]{2})?$ (2 lowercase letters, optional hyphen + 2 uppercase)
 * - Examples: en, en-US, fr, fr-FR, es-ES, de, de-DE, ja, ja-JP
 * - Used in <html lang="..."> attribute
 */
export const LanguageCodeSchema = Schema.String.pipe(
  Schema.pattern(/^[a-z]{2}(-[A-Z]{2})?$/, {
    message: () =>
      'Language code must be ISO 639-1 format with optional country (e.g., en, en-US, fr-FR, es-ES)',
  })
).annotations({
  description: 'Page language code (ISO 639-1 with optional country)',
  examples: ['en-US', 'fr-FR', 'es-ES', 'de-DE'],
})

/**
 * Comprehensive page metadata
 *
 * Master orchestrator schema that combines all meta categories into a single configuration.
 * Provides comprehensive SEO, social media, structured data, performance, and analytics
 * capabilities for optimal web presence.
 *
 * Required properties:
 * - lang: Page language code (e.g., "en-US", "fr-FR")
 * - title: Page title for browser tab and SEO (max 60 chars)
 * - description: Page description for SEO and social sharing (max 160 chars)
 *
 * Optional SEO properties:
 * - keywords: Comma-separated keywords (limited SEO impact, mostly legacy)
 * - author: Page author or organization name
 * - canonical: Canonical URL to prevent duplicate content issues
 *
 * Optional resource properties:
 * - favicon: Simple single favicon path (e.g., "./favicon.ico")
 * - favicons: Complete favicon set for multi-device support
 * - stylesheet: Path to main stylesheet (e.g., "./output.css")
 * - googleFonts: Google Fonts API URL
 * - socialImage: Default image for social sharing (fallback)
 *
 * Optional social media properties:
 * - openGraph: Open Graph metadata for Facebook/LinkedIn
 * - twitter: Twitter Card metadata for Twitter/X
 *
 * Optional structured data:
 * - schema: Schema.org structured data for rich results
 *
 * Optional performance:
 * - preload: Resource preloading for faster page load
 * - dnsPrefetch: DNS prefetch hints for external domains
 *
 * Optional analytics:
 * - analytics: Analytics provider configuration (Google, Plausible, etc.)
 *
 * Optional custom:
 * - customElements: Arbitrary HTML elements for <head> (escape hatch)
 *
 * Metadata categories and their purposes:
 * 1. **SEO basics**: title, description, keywords, canonical, author
 * 2. **Branding**: favicon/favicons, stylesheet, socialImage
 * 3. **Social media**: openGraph (Facebook/LinkedIn), twitter (Twitter/X)
 * 4. **Rich results**: schema (Schema.org structured data)
 * 5. **Performance**: preload (critical resources), dnsPrefetch (external domains)
 * 6. **Analytics**: analytics (tracking providers)
 * 7. **Custom**: customElements (escape hatch for special cases)
 *
 * Common page patterns:
 * - **Homepage**: lang + title + description + openGraph + twitter + schema (organization) + analytics
 * - **Blog post**: + schema (article + breadcrumb + person) + canonical
 * - **Product page**: + schema (product + breadcrumb) + preload (hero image)
 * - **FAQ page**: + schema (faqPage + breadcrumb)
 * - **Event page**: + schema (educationEvent + breadcrumb)
 *
 * @example
 * ```typescript
 * const meta = {
 *   lang: "en-US",
 *   title: "Complete Page Metadata Example",
 *   description: "Comprehensive metadata with SEO, social, structured data, performance, and analytics.",
 *   keywords: "metadata, seo, social media, structured data",
 *   canonical: "https://example.com/complete",
 *   favicon: "./favicon.ico",
 *   stylesheet: "./output.css",
 *   openGraph: {
 *     title: "Complete Page Metadata Example",
 *     description: "Comprehensive metadata...",
 *     type: "website",
 *     url: "https://example.com/complete",
 *     image: "https://example.com/og-image.jpg"
 *   },
 *   twitter: {
 *     card: "summary_large_image",
 *     title: "Complete Page Metadata Example",
 *     image: "https://example.com/twitter-image.jpg"
 *   },
 *   schema: {
 *     organization: {
 *       "@context": "https://schema.org",
 *       "@type": "Organization",
 *       name: "Acme Inc"
 *     }
 *   },
 *   dnsPrefetch: ["https://fonts.googleapis.com"],
 *   analytics: {
 *     providers: [
 *       {
 *         name: "google",
 *         enabled: true,
 *         config: { trackingId: "G-XXXXXXXXXX" }
 *       }
 *     ]
 *   }
 * }
 * ```
 *
 * @see specs/app/pages/meta/meta.schema.json
 */
export const MetaSchema = Schema.Struct({
  lang: LanguageCodeSchema,
  title: Schema.String.pipe(Schema.maxLength(60)).annotations({
    description: 'Page title for browser tab and SEO (max 60 characters for optimal display)',
  }),
  description: Schema.String.pipe(Schema.maxLength(160)).annotations({
    description: 'Page description for SEO and social sharing (max 160 characters)',
  }),
  keywords: Schema.optional(
    Schema.String.annotations({
      description: 'Comma-separated keywords for SEO',
    })
  ),
  author: Schema.optional(
    Schema.String.annotations({
      description: 'Page author or organization name',
    })
  ),
  canonical: Schema.optional(
    Schema.String.annotations({
      description: 'Canonical URL to prevent duplicate content issues',
      format: 'uri',
    })
  ),
  favicon: Schema.optional(FaviconSchema),
  favicons: Schema.optional(FaviconSetSchema),
  stylesheet: Schema.optional(
    Schema.String.annotations({
      description: 'Path to the main stylesheet',
    })
  ),
  googleFonts: Schema.optional(
    Schema.String.annotations({
      description: 'Google Fonts URL',
      format: 'uri',
    })
  ),
  socialImage: Schema.optional(
    Schema.String.annotations({
      description: 'Default image for social media sharing',
      format: 'uri',
    })
  ),
  openGraph: Schema.optional(OpenGraphSchema),
  twitter: Schema.optional(TwitterCardSchema),
  schema: Schema.optional(StructuredDataSchema),
  preload: Schema.optional(PreloadSchema),
  dnsPrefetch: Schema.optional(DnsPrefetchSchema),
  analytics: Schema.optional(AnalyticsSchema),
  customElements: Schema.optional(CustomElementsSchema),
}).annotations({
  title: 'Page Metadata',
  description:
    'Comprehensive page metadata including SEO, social media, structured data, performance, and analytics',
})

export type LanguageCode = Schema.Schema.Type<typeof LanguageCodeSchema>
export type Meta = Schema.Schema.Type<typeof MetaSchema>

// Re-export all meta schemas for convenience
export * from './favicon'
export * from './favicon-set'
export * from './open-graph'
export * from './twitter-card'
export * from './structured-data'
export * from './preload'
export * from './dns-prefetch'
export * from './analytics'
export * from './custom-elements'
