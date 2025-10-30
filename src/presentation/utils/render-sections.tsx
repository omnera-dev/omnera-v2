/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { App } from '@/domain/models/app'
import type { Component } from '@/domain/models/app/page/sections'

/**
 * Renders a single section component with theme spacing applied
 *
 * @param component - Section component definition
 * @param app - Application configuration with theme
 * @param index - Component index for React key
 * @returns React element
 */
function renderComponent(
  component: Component,
  app: App,
  index: number
): Readonly<ReactElement> | null {
  const { type, children, content, props } = component

  // Apply theme spacing if referenced
  const style: Record<string, string> = {}

  // Handle flex with gap spacing
  if (type === 'flex' && app.theme?.spacing?.gap) {
    style.display = 'flex'
    style.gap = app.theme.spacing.gap
  }

  // Handle section with vertical padding
  if (type === 'section' && app.theme?.spacing?.section) {
    const sectionSpacing = app.theme.spacing.section
    style.paddingTop = sectionSpacing
    style.paddingBottom = sectionSpacing
  }

  // Handle container with max-width
  if (type === 'container' && app.theme?.spacing?.container) {
    style.maxWidth = app.theme.spacing.container
  }

  // Merge with existing style from props
  const combinedStyle = { ...style, ...props?.style }

  // Build props with data-testid
  const elementProps = {
    key: index,
    'data-testid': type,
    style: Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined,
    className: props?.className,
    id: props?.id,
  }

  // Render children recursively
  const childElements = children?.map((child: Component, i: number) =>
    renderComponent(child, app, i)
  )

  // Map component types to HTML elements
  switch (type) {
    case 'section':
      return <section {...elementProps}>{childElements || content}</section>
    case 'container':
      return <div {...elementProps}>{childElements || content}</div>
    case 'flex':
      return <div {...elementProps}>{childElements || content}</div>
    case 'div':
      return <div {...elementProps}>{childElements || content}</div>
    case 'text':
      return <div {...elementProps}>{content}</div>
    default:
      return <div {...elementProps}>{childElements || content}</div>
  }
}

/**
 * Renders page sections array
 *
 * @param app - Application configuration
 * @returns Array of React elements
 */
export function renderSections(app: App): readonly ReactElement[] {
  if (!app.pages || app.pages.length === 0) {
    return []
  }

  const page = app.pages[0]
  const sections = page.sections || []

  return sections.map((section: Component, index: number) =>
    renderComponent(section, app, index)
  )
}
