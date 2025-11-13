/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import DOMPurify from 'dompurify'
import { type ReactElement } from 'react'
import { type Languages } from '@/domain/models/app/languages'
import { type Theme } from '@/domain/models/app/theme'
import { LanguageSwitcher } from '@/presentation/components/languages/language-switcher'
import {
  getAnimationConfig,
  calculateStaggerDelay,
  buildAlertVariantStyles,
} from './html-element-helpers'
import type { ElementProps } from './element-renderers'

/**
 * Renders language switcher block
 *
 * This is a special block that requires languages configuration from app schema.
 * If languages is not provided, renders a warning message.
 *
 * Note: Languages are already validated at server startup via AppSchema validation.
 * No need to re-validate here since the data comes from the validated app config.
 *
 * Note: Props like variant, showFlags, and position are currently not used but may
 * be supported in future versions of the LanguageSwitcher component.
 */
export function renderLanguageSwitcher(_props: ElementProps, languages?: Languages): ReactElement {
  if (!languages) {
    console.warn('language-switcher block requires languages configuration')
    return (
      <div
        style={{
          padding: '1rem',
          border: '2px dashed orange',
          color: 'orange',
          fontFamily: 'monospace',
        }}
      >
        language-switcher: missing app.languages configuration
      </div>
    )
  }

  // Languages already validated at server startup (start-server.ts)
  return <LanguageSwitcher languages={languages} />
}

/**
 * Renders alert element with variant support
 *
 * Creates an alert component with semantic variants (success, danger, warning, info).
 * The variant prop determines the visual styling based on theme colors.
 * Uses inline styles derived from theme tokens for color variants.
 *
 * @param props - Element props including variant and data-testid
 * @param content - Alert message text
 * @param children - Optional child elements
 * @param theme - Theme configuration for color resolution
 * @returns React element for alert component
 */
export function renderAlert(
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[],
  theme?: Theme
): ReactElement {
  const variant = props.variant as string | undefined
  const existingStyle = (props.style as Record<string, unknown> | undefined) || {}

  // Merge existing styles with variant styles
  const mergedStyle = {
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid',
    ...buildAlertVariantStyles(variant, theme),
    ...existingStyle,
  }

  return (
    <div
      {...props}
      role="alert"
      style={mergedStyle}
    >
      {content || children}
    </div>
  )
}

/**
 * Renders list element with staggered fadeIn animations for items
 *
 * Parses HTML content to extract <li> elements and applies incremental
 * animation delays for a cascading appearance effect.
 *
 * @param props - Element props including data-testid
 * @param content - HTML string containing <li> elements
 * @param theme - Theme configuration for animation settings
 * @returns React element with list items animated with stagger effect
 */
export function renderList(
  props: ElementProps,
  content: string | undefined,
  theme?: Theme
): ReactElement {
  if (!content) {
    return <ul {...props} />
  }

  const sanitizedContent = DOMPurify.sanitize(content)
  const liMatches = sanitizedContent.match(/<li[^>]*>.*?<\/li>/gs) || []

  const animationConfig = getAnimationConfig(theme)
  const duration = (animationConfig?.duration as string | undefined) || '400ms'
  const easing = (animationConfig?.easing as string | undefined) || 'ease-out'
  const staggerDelay = calculateStaggerDelay(duration)

  const renderedItems = liMatches.map((liHtml, index) => {
    const delay = `${index * staggerDelay}ms`
    const animationValue = `fade-in ${duration} ${easing} ${delay} both`
    const innerHtml = liHtml.replace(/<li[^>]*>|<\/li>/g, '')

    return (
      <li
        key={index}
        style={{ animation: animationValue }}
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
    )
  })

  return <ul {...props}>{renderedItems}</ul>
}

/**
 * Renders unordered list element (ul)
 *
 * Supports recursive children rendering for nested lists.
 * Used by block system for component-based list structures.
 *
 * @param props - Element props including data-testid
 * @param content - Optional text content
 * @param children - Child elements (typically li elements)
 * @returns React element for unordered list
 */
export function renderUnorderedList(
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[]
): ReactElement {
  return <ul {...props}>{content || children}</ul>
}

/**
 * Renders list item element (li)
 *
 * Supports recursive children rendering for nested list structures.
 * Content and children can be combined - content appears first if both present.
 *
 * @param props - Element props including data-testid
 * @param content - Optional text content
 * @param children - Optional child elements (for nested lists)
 * @returns React element for list item
 */
export function renderListItem(
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[]
): ReactElement {
  // If both content and children exist, render both (content first)
  if (content && children && children.length > 0) {
    return (
      <li {...props}>
        {content}
        {children}
      </li>
    )
  }
  // Otherwise use content or children (whichever is present)
  return <li {...props}>{content || children}</li>
}
