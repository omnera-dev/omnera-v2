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

/**
 * Common props for all rendered elements
 */
export interface ElementProps {
  readonly [key: string]: unknown
  readonly className?: string
  readonly 'data-block'?: string
}

/**
 * Renders HTML structural elements (div, span, section)
 *
 * If content starts with '<', it's treated as HTML and rendered via dangerouslySetInnerHTML.
 * Otherwise, content is rendered as plain text.
 *
 * Note: HTML content is rendered without sanitization since it comes from trusted
 * schema configuration. For user-generated content, use renderCustomHTML instead.
 */
export function renderHTMLElement(
  type: 'div' | 'span' | 'section',
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[]
): ReactElement {
  const Element = type

  // If content looks like HTML (starts with '<'), render as HTML
  // This is safe for schema-defined content but should NOT be used for user input
  if (content && content.trim().startsWith('<')) {
    return (
      <Element
        {...props}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  return <Element {...props}>{content || children}</Element>
}

/**
 * Renders heading elements (h1-h6)
 */
export function renderHeading(
  level: 1 | 2 | 3 | 4 | 5 | 6,
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[]
): ReactElement {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <HeadingTag {...props}>{content || children}</HeadingTag>
}

/**
 * Renders text element with dynamic level
 *
 * The text element supports a 'level' prop to determine the HTML tag.
 * If level is h1-h6, renders as heading.
 * If level is p, renders as paragraph.
 * Otherwise renders as span (inline text).
 */
export function renderTextElement(props: ElementProps, content: string | undefined): ReactElement {
  const { level } = props

  if (level === 'h1') return <h1 {...props}>{content}</h1>
  if (level === 'h2') return <h2 {...props}>{content}</h2>
  if (level === 'h3') return <h3 {...props}>{content}</h3>
  if (level === 'h4') return <h4 {...props}>{content}</h4>
  if (level === 'h5') return <h5 {...props}>{content}</h5>
  if (level === 'h6') return <h6 {...props}>{content}</h6>
  if (level === 'p') return <p {...props}>{content}</p>

  // Default to span for inline text (no level specified)
  return <span {...props}>{content}</span>
}

/**
 * Renders paragraph element
 */
export function renderParagraph(props: ElementProps, content: string | undefined): ReactElement {
  return <p {...props}>{content}</p>
}

/**
 * Renders image element
 */
export function renderImage(props: ElementProps): ReactElement {
  return (
    <img
      {...props}
      alt={(props.alt as string | undefined) || ''}
    />
  )
}

/**
 * Renders video element
 */
export function renderVideo(
  props: ElementProps,
  children: readonly React.ReactNode[]
): ReactElement {
  return <video {...props}>{children}</video>
}

/**
 * Renders audio element
 */
export function renderAudio(
  props: ElementProps,
  children: readonly React.ReactNode[]
): ReactElement {
  return <audio {...props}>{children}</audio>
}

/**
 * Renders iframe element
 */
export function renderIframe(
  props: ElementProps,
  children: readonly React.ReactNode[]
): ReactElement {
  return <iframe {...props}>{children}</iframe>
}

/**
 * Renders button element
 */
export function renderButton(
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[]
): ReactElement {
  return <button {...props}>{content || children}</button>
}

/**
 * Renders link (anchor) element
 */
export function renderLink(
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[]
): ReactElement {
  return <a {...props}>{content || children}</a>
}

/**
 * Renders form element
 */
export function renderForm(
  props: ElementProps,
  children: readonly React.ReactNode[]
): ReactElement {
  return <form {...props}>{children}</form>
}

/**
 * Renders input element
 */
export function renderInput(props: ElementProps): ReactElement {
  return <input {...props} />
}

/**
 * Renders badge (styled span) element
 */
export function renderBadge(props: ElementProps, content: string | undefined): ReactElement {
  return <span {...props}>{content}</span>
}

/**
 * Renders icon as SVG element
 * Uses 'name' prop to generate data-testid="icon-{name}"
 * Uses 'color' prop to add data-color attribute
 * Adds minimum dimensions to ensure visibility
 */
export function renderIcon(
  props: ElementProps,
  children: readonly React.ReactNode[]
): ReactElement {
  const iconName = props.name as string | undefined
  const iconColor = props.color as string | undefined
  const existingStyle = (props.style as Record<string, unknown> | undefined) || {}
  const iconProps = {
    ...props,
    ...(iconName && { 'data-testid': `icon-${iconName}` }),
    ...(iconColor && { 'data-color': iconColor }),
    style: {
      display: 'inline-block',
      minWidth: '1rem',
      minHeight: '1rem',
      ...existingStyle,
    },
  }
  return <svg {...iconProps}>{children}</svg>
}

/**
 * Renders custom HTML with DOMPurify sanitization
 *
 * SECURITY: This function sanitizes HTML to prevent XSS attacks.
 * DOMPurify removes malicious scripts, event handlers, and dangerous attributes.
 * Critical for user-generated content or external HTML sources.
 */
export function renderCustomHTML(props: ElementProps): ReactElement {
  const sanitizedHTML = DOMPurify.sanitize((props.html as string | undefined) || '')
  return (
    <div
      {...props}
      // Safe to use dangerouslySetInnerHTML after DOMPurify sanitization
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}

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

  // Build variant-specific styles using theme colors
  const variantStyles: Record<string, unknown> = {}

  if (variant === 'success' && theme?.colors) {
    const successColor = theme.colors.success as string | undefined
    const successLightColor = theme.colors['success-light'] as string | undefined

    if (successColor) {
      variantStyles.color = successColor
      variantStyles.borderColor = successColor
    }
    if (successLightColor) {
      variantStyles.backgroundColor = successLightColor
    }
  } else if (variant === 'danger' && theme?.colors) {
    const dangerColor = theme.colors.danger as string | undefined
    const dangerLightColor = theme.colors['danger-light'] as string | undefined

    if (dangerColor) {
      variantStyles.color = dangerColor
      variantStyles.borderColor = dangerColor
    }
    if (dangerLightColor) {
      variantStyles.backgroundColor = dangerLightColor
    }
  } else if (variant === 'warning' && theme?.colors) {
    const warningColor = theme.colors.warning as string | undefined
    const warningLightColor = theme.colors['warning-light'] as string | undefined

    if (warningColor) {
      variantStyles.color = warningColor
      variantStyles.borderColor = warningColor
    }
    if (warningLightColor) {
      variantStyles.backgroundColor = warningLightColor
    }
  } else if (variant === 'info' && theme?.colors) {
    const infoColor = theme.colors.info as string | undefined
    const infoLightColor = theme.colors['info-light'] as string | undefined

    if (infoColor) {
      variantStyles.color = infoColor
      variantStyles.borderColor = infoColor
    }
    if (infoLightColor) {
      variantStyles.backgroundColor = infoLightColor
    }
  }

  // Merge existing styles with variant styles
  const mergedStyle = {
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid',
    ...variantStyles,
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
  // If no content, return empty list
  if (!content) {
    return <ul {...props} />
  }

  // Sanitize HTML content for security
  const sanitizedContent = DOMPurify.sanitize(content)

  // Extract <li> items using simple regex matching
  // This approach works in both server and client environments
  const liMatches = sanitizedContent.match(/<li[^>]*>.*?<\/li>/gs) || []

  // Get animation config from theme with proper type narrowing
  // AnimationValue is union: boolean | string | AnimationConfigObject
  // Only AnimationConfigObject has duration/easing properties
  const fadeInConfig = theme?.animations?.fadeIn
  const animationConfig =
    fadeInConfig && typeof fadeInConfig === 'object' && !Array.isArray(fadeInConfig)
      ? fadeInConfig
      : undefined

  const duration = animationConfig?.duration || '400ms'
  const easing = animationConfig?.easing || 'ease-out'

  // Parse duration to number for delay calculation (remove 'ms' suffix)
  const durationMs = parseInt(duration.replace('ms', ''), 10)
  const staggerDelay = Math.max(50, durationMs / 4) // 25% of duration, min 50ms

  // Render list items with staggered animation delays
  const renderedItems = liMatches.map((liHtml, index) => {
    const delay = `${index * staggerDelay}ms`
    const animationValue = `fade-in ${duration} ${easing} ${delay} both`

    // Extract inner HTML (content between <li> and </li>)
    const innerHtml = liHtml.replace(/<li[^>]*>|<\/li>/g, '')

    return (
      <li
        key={index}
        style={{
          animation: animationValue,
        }}
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
    )
  })

  return <ul {...props}>{renderedItems}</ul>
}
