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
 * Renders a hero section with full theme integration demonstrating cohesive UI.
 * When no children are provided, renders default content (h1 heading + CTA button)
 * that showcases all theme tokens applied together:
 * - Background color (theme.colors.background)
 * - Heading with theme fonts (family, size, weight, color)
 * - Button with theme colors and border radius
 * - Section padding (theme.spacing.section)
 *
 * Uses theme.breakpoints to determine responsive behavior via CSS custom properties.
 * Applies progressive enhancement - padding increases as viewport grows.
 *
 * @param props - Component props
 * @param props.theme - Theme configuration with all design tokens
 * @param props.children - Hero content (optional - defaults to themed heading + button)
 * @param props.data-testid - Test identifier
 * @returns Hero section element with cohesive theme integration
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

  // Extract theme tokens for cohesive UI
  const backgroundColor = theme?.colors?.background || '#ffffff'
  const textColor = theme?.colors?.text || '#212529'
  const primaryColor = theme?.colors?.primary || '#007bff'
  const sectionPadding = theme?.spacing?.section || '4rem'
  const borderRadius = theme?.borderRadius?.lg || '0.5rem'

  // Typography tokens
  const titleFamily = theme?.fonts?.title?.family || 'Bely Display'
  const titleWeight = theme?.fonts?.title?.weight || 700
  const titleSize = theme?.fonts?.title?.size || '2.5rem'
  const bodyFamily = theme?.fonts?.body?.family || 'Inter'

  // Default content when no children provided - demonstrates theme integration
  const defaultContent = (
    <div
      style={{
        textAlign: 'center',
        maxWidth: '800px',
      }}
    >
      <h1
        style={{
          fontFamily: titleFamily,
          fontWeight: titleWeight,
          fontSize: titleSize,
          color: textColor,
          marginBottom: '2rem',
        }}
      >
        Welcome to Sovrium
      </h1>
      <button
        style={{
          backgroundColor: primaryColor,
          color: '#ffffff',
          fontFamily: bodyFamily,
          fontSize: '1rem',
          padding: '0.75rem 1.5rem',
          borderRadius: borderRadius,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Get Started
      </button>
    </div>
  )

  // Use default content if children is undefined, null, or empty array
  const hasChildren =
    children && (Array.isArray(children) ? children.length > 0 : Boolean(children))
  const content = hasChildren ? children : defaultContent

  return (
    <section
      data-testid={props['data-testid']}
      style={{
        backgroundColor: backgroundColor,
        padding: sectionPadding,
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {content}

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
