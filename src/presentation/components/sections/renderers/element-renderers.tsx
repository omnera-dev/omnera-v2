/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import DOMPurify from 'dompurify'
import { type ReactElement } from 'react'
import { LanguageSwitcher } from '@/presentation/components/languages/language-switcher'
import type { Languages } from '@/domain/models/app/languages'

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
 */
export function renderHTMLElement(
  type: 'div' | 'span' | 'section',
  props: ElementProps,
  content: string | undefined,
  children: readonly React.ReactNode[]
): ReactElement {
  const Element = type
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
 * If level is h1-h6, renders as heading. Otherwise renders as paragraph.
 */
export function renderTextElement(
  props: ElementProps,
  content: string | undefined
): ReactElement {
  const level = props.level

  if (level === 'h1') return <h1 {...props}>{content}</h1>
  if (level === 'h2') return <h2 {...props}>{content}</h2>
  if (level === 'h3') return <h3 {...props}>{content}</h3>
  if (level === 'h4') return <h4 {...props}>{content}</h4>
  if (level === 'h5') return <h5 {...props}>{content}</h5>
  if (level === 'h6') return <h6 {...props}>{content}</h6>

  // Default to paragraph
  return <p {...props}>{content}</p>
}

/**
 * Renders paragraph element
 */
export function renderParagraph(
  props: ElementProps,
  content: string | undefined
): ReactElement {
  return <p {...props}>{content}</p>
}

/**
 * Renders image element
 */
export function renderImage(
  props: ElementProps
): ReactElement {
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
export function renderInput(
  props: ElementProps
): ReactElement {
  return <input {...props} />
}

/**
 * Renders badge (styled span) element
 */
export function renderBadge(
  props: ElementProps,
  content: string | undefined
): ReactElement {
  return <span {...props}>{content}</span>
}

/**
 * Renders icon (span container) element
 */
export function renderIcon(
  props: ElementProps,
  children: readonly React.ReactNode[]
): ReactElement {
  return <span {...props}>{children}</span>
}

/**
 * Renders custom HTML with DOMPurify sanitization
 *
 * SECURITY: This function sanitizes HTML to prevent XSS attacks.
 * DOMPurify removes malicious scripts, event handlers, and dangerous attributes.
 * Critical for user-generated content or external HTML sources.
 */
export function renderCustomHTML(
  props: ElementProps
): ReactElement {
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
 * Note: Props like variant, showFlags, and position are currently not used but may
 * be supported in future versions of the LanguageSwitcher component.
 */
export function renderLanguageSwitcher(
  _props: ElementProps,
  languages?: Languages
): ReactElement {
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

  return <LanguageSwitcher languages={languages} />
}
