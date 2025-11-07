/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'
import type { ReactElement } from 'react'

/**
 * Responsive Navigation Component
 *
 * Renders a navigation that adapts based on viewport width:
 * - Below breakpoint (default 1024px): Hamburger menu icon
 * - At/above breakpoint: Full navigation menu
 *
 * Uses theme.breakpoints.lg to determine responsive behavior via CSS custom properties.
 * Leverages Tailwind's responsive utilities for styling, with runtime breakpoint
 * customization through CSS variables.
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
  readonly theme?: Theme
  readonly 'data-testid'?: string
}>): Readonly<ReactElement> {
  // Extract lg breakpoint from theme (default to 1024px if not provided)
  const lgBreakpoint = theme?.breakpoints?.lg || '1024px'
  const breakpointValue = parseInt(lgBreakpoint, 10)

  return (
    <nav
      data-testid={props['data-testid']}
      className="flex items-center p-4"
      style={
        {
          '--breakpoint-lg': `${breakpointValue}px`,
        } as React.CSSProperties
      }
    >
      {/* Mobile: Hamburger menu (hidden on desktop) */}
      <button
        type="button"
        className="cursor-pointer text-2xl"
        style={{
          display: 'block',
        }}
        data-testid="hamburger-menu"
        aria-label="Open navigation menu"
      >
        ☰
      </button>

      {/* Desktop: Full menu (hidden on mobile) */}
      <div
        className="gap-4"
        style={{
          display: 'none',
        }}
        data-testid="full-menu"
      >
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </div>

      {/* Runtime CSS using theme breakpoint value */}
      <style>{`
        @media (min-width: ${breakpointValue}px) {
          nav[data-testid="${props['data-testid']}"] [data-testid="hamburger-menu"] {
            display: none;
          }
          nav[data-testid="${props['data-testid']}"] [data-testid="full-menu"] {
            display: flex;
          }
        }
      `}</style>
    </nav>
  )
}
