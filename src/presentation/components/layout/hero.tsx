/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'
import type { ReactElement, ReactNode } from 'react'

/**
 * Hero Section Component
 *
 * Renders a hero section with responsive padding based on breakpoints:
 * - Mobile (default): Base padding (1rem)
 * - sm breakpoint (640px): Medium padding (2rem)
 * - md breakpoint (768px): Large padding (3rem)
 * - lg breakpoint (1024px): Extra large padding (4rem)
 *
 * Uses theme.breakpoints to determine responsive behavior via CSS custom properties.
 * Applies progressive enhancement - padding increases as viewport grows.
 *
 * @param props - Component props
 * @param props.theme - Theme configuration with breakpoints
 * @param props.children - Hero content
 * @param props.data-testid - Test identifier
 * @returns Hero section element
 */
export function Hero({
  theme,
  children,
  ...props
}: Readonly<{
  readonly theme?: Theme
  readonly children?: ReactNode
  readonly 'data-testid'?: string
}>): Readonly<ReactElement> {
  // Extract breakpoints from theme (with defaults)
  const smBreakpoint = parseInt(theme?.breakpoints?.sm || '640px', 10)
  const mdBreakpoint = parseInt(theme?.breakpoints?.md || '768px', 10)
  const lgBreakpoint = parseInt(theme?.breakpoints?.lg || '1024px', 10)

  return (
    <section
      data-testid={props['data-testid']}
      className="bg-gradient-to-br from-blue-50 to-indigo-100"
      style={{
        padding: '1rem',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}

      {/* Runtime CSS using theme breakpoint values */}
      <style>{`
        @media (min-width: ${smBreakpoint}px) {
          section[data-testid="${props['data-testid']}"] {
            padding: 2rem;
          }
        }
        @media (min-width: ${mdBreakpoint}px) {
          section[data-testid="${props['data-testid']}"] {
            padding: 3rem;
          }
        }
        @media (min-width: ${lgBreakpoint}px) {
          section[data-testid="${props['data-testid']}"] {
            padding: 4rem;
          }
        }
      `}</style>
    </section>
  )
}
