/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'
import { BannerSchema } from './layout/banner'
import { FooterSchema } from './layout/footer'
import { NavigationSchema } from './layout/navigation'
import { SidebarSchema } from './layout/sidebar'

/**
 * Global page layout configuration
 *
 * Orchestrates 4 layout components:
 * 1. Banner: Top announcement bar (promotions, alerts, cookie consent)
 * 2. Navigation: Header with logo, links, CTA, search, user menu
 * 3. Sidebar: Left/right persistent navigation (docs, dashboards, admin panels)
 * 4. Footer: Bottom section (logo, columns, social, newsletter, legal)
 *
 * All components are optional, enabling flexible layout patterns:
 * - Minimal: Navigation only (header-only pages)
 * - Standard: Navigation + Footer (most websites, 95%)
 * - Sidebar: Navigation + Sidebar + Footer (docs, dashboards)
 * - Full: Banner + Navigation + Sidebar + Footer (enterprise sites)
 * - Blank: No layout (full-screen apps, landing pages)
 *
 * Layout hierarchy (top to bottom):
 * ```
 * ┌─────────────────────────────────────┐
 * │ Banner (optional)                   │ ← Announcement bar
 * ├─────────────────────────────────────┤
 * │ Navigation                          │ ← Header with logo + links
 * ├─────────┬───────────────────────────┤
 * │ Sidebar │ Main Content              │ ← Optional left/right panel
 * │ (opt.)  │                           │
 * │         │                           │
 * ├─────────┴───────────────────────────┤
 * │ Footer (optional)                   │ ← Bottom section
 * └─────────────────────────────────────┘
 * ```
 *
 * Common layout patterns:
 *
 * 1. **Landing Page** (navigation + footer):
 * ```typescript
 * {
 *   navigation: { logo: './logo.svg', links: {...}, cta: {...} },
 *   footer: { enabled: true }
 * }
 * ```
 *
 * 2. **Documentation Site** (sticky nav + left sidebar + footer):
 * ```typescript
 * {
 *   navigation: { logo: './logo.svg', sticky: true },
 *   sidebar: { enabled: true, position: 'left', items: [...] },
 *   footer: { enabled: true }
 * }
 * ```
 *
 * 3. **Dashboard** (sticky nav + collapsible sidebar, no footer):
 * ```typescript
 * {
 *   navigation: { logo: './logo.svg', sticky: true, user: { enabled: true } },
 *   sidebar: { enabled: true, collapsible: true, items: [...] }
 * }
 * ```
 *
 * 4. **Promotion Campaign** (banner + navigation + footer):
 * ```typescript
 * {
 *   banner: { enabled: true, text: '50% off sale!', link: {...}, sticky: true },
 *   navigation: { logo: './logo.svg', links: {...}, cta: {...} },
 *   footer: { enabled: true }
 * }
 * ```
 *
 * 5. **Enterprise Site** (all components):
 * ```typescript
 * {
 *   banner: { enabled: true, text: 'New feature launch', gradient: '...' },
 *   navigation: { logo: './logo.svg', sticky: true, links: {...}, cta: {...} },
 *   sidebar: { enabled: true, position: 'right', items: [...] },
 *   footer: { enabled: true, logo: '...', columns: [...], social: {...}, newsletter: {...} }
 * }
 * ```
 *
 * 6. **Blank Page** (no layout, full control):
 * ```typescript
 * {}
 * ```
 *
 * Per-page layout customization:
 * - Default layout applied to all pages
 * - Page-level layout overrides default
 * - layout=null disables all layout components
 * - Partial override extends default (e.g., add sidebar to specific pages)
 *
 * @example
 * ```typescript
 * // Minimal layout (navigation only)
 * const minimalLayout = {
 *   navigation: {
 *     logo: './public/logo.svg'
 *   }
 * }
 *
 * // Standard website layout
 * const standardLayout = {
 *   navigation: {
 *     logo: './public/logo.svg',
 *     sticky: true,
 *     links: {
 *       desktop: [
 *         { label: 'Home', href: '/' },
 *         { label: 'About', href: '/about' }
 *       ]
 *     },
 *     cta: {
 *       text: 'Get Started',
 *       href: '/signup',
 *       variant: 'primary'
 *     }
 *   },
 *   footer: {
 *     enabled: true,
 *     copyright: '© 2024 Company Inc. All rights reserved.',
 *     legal: [
 *       { label: 'Privacy Policy', href: '/privacy' },
 *       { label: 'Terms of Service', href: '/terms' }
 *     ]
 *   }
 * }
 *
 * // Documentation layout with sidebar
 * const docsLayout = {
 *   navigation: {
 *     logo: './public/logo.svg',
 *     sticky: true,
 *     search: {
 *       enabled: true,
 *       placeholder: 'Search documentation...'
 *     }
 *   },
 *   sidebar: {
 *     enabled: true,
 *     position: 'left',
 *     sticky: true,
 *     items: [
 *       { type: 'link', label: 'Introduction', href: '/docs/intro' },
 *       {
 *         type: 'group',
 *         label: 'Getting Started',
 *         children: [
 *           { type: 'link', label: 'Installation', href: '/docs/installation' },
 *           { type: 'link', label: 'Quick Start', href: '/docs/quick-start' }
 *         ]
 *       }
 *     ]
 *   },
 *   footer: {
 *     enabled: true
 *   }
 * }
 * ```
 *
 * @see specs/app/pages/layout/layout.schema.json
 */
export const LayoutSchema = Schema.Struct({
  banner: Schema.optional(BannerSchema),
  navigation: Schema.optional(NavigationSchema),
  footer: Schema.optional(FooterSchema),
  sidebar: Schema.optional(SidebarSchema),
}).annotations({
  title: 'Page Layout',
  description: 'Global layout configuration including banner, navigation, footer, and sidebar',
})

export type Layout = Schema.Schema.Type<typeof LayoutSchema>
