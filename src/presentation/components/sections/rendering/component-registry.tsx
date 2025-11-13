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
  section: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('section', elementPropsWithSpacing, content, renderedChildren, interactions),

  header: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('header', elementPropsWithSpacing, content, renderedChildren, interactions),

  footer: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('footer', elementPropsWithSpacing, content, renderedChildren, interactions),

  main: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('main', elementPropsWithSpacing, content, renderedChildren, interactions),

  article: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('article', elementPropsWithSpacing, content, renderedChildren, interactions),

  aside: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('aside', elementPropsWithSpacing, content, renderedChildren, interactions),

  nav: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('nav', elementPropsWithSpacing, content, renderedChildren, interactions),

  div: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren, interactions),

  container: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren, interactions),

  flex: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren, interactions),

  grid: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren, interactions),

  card: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren, interactions),

  timeline: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren, interactions),

  accordion: ({ elementPropsWithSpacing, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementPropsWithSpacing, content, renderedChildren, interactions),

  span: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('span', elementProps, content, renderedChildren, interactions),

  badge: ({ elementProps, content, renderedChildren, interactions }) => {
    const badgeProps = convertBadgeProps(elementProps)
    return Renderers.renderHTMLElement('span', badgeProps, content, renderedChildren, interactions)
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
  button: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderButton(elementProps, content, renderedChildren, interactions),

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
  modal: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren, interactions),

  sidebar: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren, interactions),

  toast: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren, interactions),

  fab: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren, interactions),

  spinner: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren, interactions),

  'list-item': ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren, interactions),

  dropdown: ({ elementProps, content, renderedChildren, interactions }) =>
    Renderers.renderHTMLElement('div', elementProps, content, renderedChildren, interactions),

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
