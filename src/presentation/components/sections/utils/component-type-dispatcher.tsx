/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Hero } from '@/presentation/components/layout/hero'
import { ResponsiveNavigation } from '@/presentation/components/layout/responsive-navigation'
import * as Renderers from '../renderers/element-renderers'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'
import type { ReactElement } from 'react'

/**
 * Standard HTML attributes for badge components
 */
const STANDARD_HTML_ATTRS = new Set([
  'className',
  'style',
  'id',
  'role',
  'data-testid',
  'data-block',
  'data-type',
  'data-translation-key',
  'data-translations',
])

/**
 * Convert custom props to data-* attributes for badge components
 */
function convertBadgeProps(elementProps: Record<string, unknown>): Record<string, unknown> {
  return Object.entries(elementProps).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (STANDARD_HTML_ATTRS.has(key) || key.startsWith('data-') || key.startsWith('aria-')) {
      return { ...acc, [key]: value }
    }
    return { ...acc, [`data-${key}`]: value }
  }, {})
}

/**
 * Dispatch component rendering based on type
 */
export function dispatchComponentType(
  type: Component['type'],
  elementProps: Record<string, unknown>,
  elementPropsWithSpacing: Record<string, unknown>,
  content: string | undefined,
  renderedChildren: readonly ReactElement[],
  theme: Theme | undefined,
  languages: Languages | undefined
): ReactElement | null {
  // HTML structural elements
  if (type === 'section') {
    return Renderers.renderHTMLElement(
      'section',
      elementPropsWithSpacing,
      content,
      renderedChildren
    )
  }

  if (
    type === 'div' ||
    type === 'container' ||
    type === 'flex' ||
    type === 'grid' ||
    type === 'card' ||
    type === 'timeline' ||
    type === 'accordion'
  ) {
    return Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren)
  }

  if (type === 'span') {
    return Renderers.renderHTMLElement('span', elementProps, content, renderedChildren)
  }

  if (type === 'badge') {
    const badgeProps = convertBadgeProps(elementProps)
    return Renderers.renderHTMLElement('span', badgeProps, content, renderedChildren)
  }

  if (type === 'icon') {
    return Renderers.renderIcon(elementProps, renderedChildren)
  }

  // Heading elements
  if (type === 'h1') return Renderers.renderHeading(1, elementProps, content, renderedChildren)
  if (type === 'h2') return Renderers.renderHeading(2, elementProps, content, renderedChildren)
  if (type === 'h3') return Renderers.renderHeading(3, elementProps, content, renderedChildren)
  if (type === 'h4') return Renderers.renderHeading(4, elementProps, content, renderedChildren)
  if (type === 'h5') return Renderers.renderHeading(5, elementProps, content, renderedChildren)
  if (type === 'h6') return Renderers.renderHeading(6, elementProps, content, renderedChildren)
  if (type === 'heading') return Renderers.renderHeading(1, elementProps, content, renderedChildren)

  // Content elements
  if (type === 'text') return Renderers.renderTextElement(elementProps, content)
  if (type === 'paragraph' || type === 'p') {
    return Renderers.renderParagraph(elementProps, content, renderedChildren)
  }
  if (type === 'code') return Renderers.renderCode(elementProps, content, renderedChildren)
  if (type === 'pre') return Renderers.renderPre(elementProps, content, renderedChildren)

  // Media elements
  if (type === 'image') return Renderers.renderImage(elementProps)
  if (type === 'video') return Renderers.renderVideo(elementProps, renderedChildren)
  if (type === 'audio') return Renderers.renderAudio(elementProps, renderedChildren)
  if (type === 'iframe') return Renderers.renderIframe(elementProps, renderedChildren)

  // Interactive elements
  if (type === 'button') return Renderers.renderButton(elementProps, content, renderedChildren)
  if (type === 'link') return Renderers.renderLink(elementProps, content, renderedChildren)
  if (type === 'alert') return Renderers.renderAlert(elementProps, content, renderedChildren, theme)
  if (type === 'form') return Renderers.renderForm(elementProps, renderedChildren)
  if (type === 'input') return Renderers.renderInput(elementProps)

  // Custom blocks
  if (type === 'customHTML') return Renderers.renderCustomHTML(elementProps)
  if (type === 'language-switcher') {
    return Renderers.renderLanguageSwitcher(elementProps, languages)
  }

  // Layout components
  if (
    type === 'modal' ||
    type === 'sidebar' ||
    type === 'toast' ||
    type === 'fab' ||
    type === 'spinner' ||
    type === 'list-item' ||
    type === 'dropdown'
  ) {
    return Renderers.renderHTMLElement('div', elementProps, content, renderedChildren)
  }

  if (type === 'hero') {
    return (
      <Hero
        theme={theme}
        data-testid={elementProps['data-testid'] as string | undefined}
      >
        {renderedChildren}
      </Hero>
    )
  }

  if (type === 'list') return Renderers.renderList(elementProps, content, theme)

  if (type === 'navigation') {
    return (
      <ResponsiveNavigation
        theme={theme}
        data-testid={elementProps['data-testid'] as string | undefined}
      />
    )
  }

  if (type === 'ul') return Renderers.renderUnorderedList(elementProps, content, renderedChildren)
  if (type === 'li') return Renderers.renderListItem(elementProps, content, renderedChildren)

  // Fallback for unknown types
  return Renderers.renderHTMLElement('div', elementProps, content, renderedChildren)
}
