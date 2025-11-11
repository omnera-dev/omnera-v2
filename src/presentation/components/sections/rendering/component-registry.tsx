/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Hero } from '@/presentation/components/layout/hero'
import { ResponsiveNavigation } from '@/presentation/components/layout/responsive-navigation'
import * as Renderers from '../renderers/element-renderers'
import type { ComponentRenderer } from './component-dispatch-config'
import type { Component } from '@/domain/models/app/page/sections'

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
 * Component registry mapping component types to their renderer functions
 */
export const COMPONENT_REGISTRY: Partial<Record<Component['type'], ComponentRenderer>> = {
  // HTML structural elements
  section: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('section', elementPropsWithSpacing, content, renderedChildren),

  header: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('header', elementPropsWithSpacing, content, renderedChildren),

  footer: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('footer', elementPropsWithSpacing, content, renderedChildren),

  main: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('main', elementPropsWithSpacing, content, renderedChildren),

  article: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('article', elementPropsWithSpacing, content, renderedChildren),

  aside: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('aside', elementPropsWithSpacing, content, renderedChildren),

  nav: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('nav', elementPropsWithSpacing, content, renderedChildren),

  div: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren),

  container: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren),

  flex: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren),

  grid: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren),

  card: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren),

  timeline: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren),

  accordion: ({ elementPropsWithSpacing, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren),

  span: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('span', elementProps, content, renderedChildren),

  badge: ({ elementProps, content, renderedChildren }) => {
    const badgeProps = convertBadgeProps(elementProps)
    return Renderers.renderHTMLElement('span', badgeProps, content, renderedChildren)
  },

  icon: ({ elementProps, renderedChildren }) =>
    Renderers.renderIcon(elementProps, renderedChildren),

  // Heading elements
  h1: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHeading(1, elementProps, content, renderedChildren),

  h2: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHeading(2, elementProps, content, renderedChildren),

  h3: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHeading(3, elementProps, content, renderedChildren),

  h4: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHeading(4, elementProps, content, renderedChildren),

  h5: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHeading(5, elementProps, content, renderedChildren),

  h6: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHeading(6, elementProps, content, renderedChildren),

  heading: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHeading(1, elementProps, content, renderedChildren),

  // Content elements
  text: ({ elementProps, content }) => Renderers.renderTextElement(elementProps, content),

  paragraph: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderParagraph(elementProps, content, renderedChildren),

  p: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderParagraph(elementProps, content, renderedChildren),

  code: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderCode(elementProps, content, renderedChildren),

  pre: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderPre(elementProps, content, renderedChildren),

  // Media elements
  image: ({ elementProps }) => Renderers.renderImage(elementProps),

  video: ({ elementProps, renderedChildren }) =>
    Renderers.renderVideo(elementProps, renderedChildren),

  audio: ({ elementProps, renderedChildren }) =>
    Renderers.renderAudio(elementProps, renderedChildren),

  iframe: ({ elementProps, renderedChildren }) =>
    Renderers.renderIframe(elementProps, renderedChildren),

  // Interactive elements
  button: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderButton(elementProps, content, renderedChildren),

  link: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderLink(elementProps, content, renderedChildren),

  a: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderLink(elementProps, content, renderedChildren),

  alert: ({ elementProps, content, renderedChildren, theme }) =>
    Renderers.renderAlert(elementProps, content, renderedChildren, theme),

  form: ({ elementProps, renderedChildren }) =>
    Renderers.renderForm(elementProps, renderedChildren),

  input: ({ elementProps }) => Renderers.renderInput(elementProps),

  // Custom blocks
  customHTML: ({ elementProps }) => Renderers.renderCustomHTML(elementProps),

  'language-switcher': ({ elementProps, languages }) =>
    Renderers.renderLanguageSwitcher(elementProps, languages),

  // Layout components
  modal: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren),

  sidebar: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren),

  toast: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren),

  fab: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren),

  spinner: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren),

  'list-item': ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren),

  dropdown: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren),

  hero: ({ elementProps, theme, renderedChildren }) => (
    <Hero
      theme={theme}
      data-testid={elementProps['data-testid'] as string | undefined}
    >
      {renderedChildren}
    </Hero>
  ),

  list: ({ elementProps, content, theme }) => Renderers.renderList(elementProps, content, theme),

  navigation: ({ elementProps, theme }) => (
    <ResponsiveNavigation
      theme={theme}
      data-testid={elementProps['data-testid'] as string | undefined}
    />
  ),

  ul: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderUnorderedList(elementProps, content, renderedChildren),

  li: ({ elementProps, content, renderedChildren }) =>
    Renderers.renderListItem(elementProps, content, renderedChildren),
}
