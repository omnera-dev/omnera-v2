/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { ReactElement } from 'react'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Responsive Navigation Component
 *
 * Renders a navigation that adapts based on viewport width:
 * - Below breakpoint (default 1024px): Hamburger menu icon
 * - At/above breakpoint: Full navigation menu
 *
 * @param props - Component props
 * @param props.theme - Theme configuration with breakpoints
 * @param props.data-testid - Test identifier
 * @returns Responsive navigation element
 */
export function ResponsiveNavigation({
  theme,
  ...props
}: Readonly<{
  theme?: Theme
  'data-testid'?: string
}>): Readonly<ReactElement> {
  // Extract lg breakpoint from theme (default to 1024px if not provided)
  const lgBreakpoint = theme?.breakpoints?.lg || '1024px'
  const breakpointValue = parseInt(lgBreakpoint, 10)

  return (
    <nav
      data-testid={props['data-testid']}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
      }}
    >
      {/* Mobile: Hamburger menu (hidden on desktop) */}
      <div
        className={`lg:hidden`}
        style={{
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
        data-testid="hamburger-menu"
      >
        ☰
      </div>

      {/* Desktop: Full menu (hidden on mobile) */}
      <div
        className={`hidden lg:flex`}
        style={{
          gap: '1rem',
        }}
        data-testid="full-menu"
      >
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>

      {/* CSS for responsive behavior based on theme breakpoint */}
      <style>{`
        @media (min-width: ${breakpointValue}px) {
          .lg\\:hidden {
            display: none !important;
          }
          .lg\\:flex {
            display: flex !important;
          }
        }
        @media (max-width: ${breakpointValue - 1}px) {
          .lg\\:hidden {
            display: block !important;
          }
          .lg\\:flex {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}
