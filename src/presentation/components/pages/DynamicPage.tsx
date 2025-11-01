/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import type { Component } from '@/domain/models/app/page/sections'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS from theme colors
 * Applies theme colors to semantic HTML elements for visual hierarchy
 *
 * @param theme - Theme configuration from app schema
 * @returns CSS string with theme-based styles
 */
function generateThemeStyles(theme?: Theme): string {
  if (!theme?.colors) {
    return ''
  }

  // Apply gray-900 to headings (h1-h6) for strong hierarchy
  // Apply gray-500 to text elements (p) for secondary/placeholder content
  const { colors } = theme
  const gray900 = colors['gray-900']
  const gray500 = colors['gray-500']

  const headingStyles = gray900 ? `h1, h2, h3, h4, h5, h6 { color: ${gray900}; }\n` : ''
  const textStyles = gray500 ? `p { color: ${gray500}; }\n` : ''

  return headingStyles + textStyles
}

/**
 * DynamicPage component - Renders a custom page from configuration
 *
 * This component takes a page configuration and renders it as a complete HTML document
 * with all sections, metadata, and layout components.
 *
 * @param props - Component props
 * @param props.page - Page configuration from app schema
 * @param props.theme - Optional theme configuration for styling
 * @returns React element with complete page structure
 */
export function DynamicPage({
  page,
  theme,
}: {
  readonly page: Page
  readonly theme?: Theme
}): Readonly<ReactElement> {
  const themeStyles = generateThemeStyles(theme)

  return (
    <html lang={page.meta.lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{page.meta.title}</title>
        <meta
          name="description"
          content={page.meta.description}
        />
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
        {themeStyles && <style dangerouslySetInnerHTML={{ __html: themeStyles }} />}
      </head>
      <body>
        <main>
          {page.sections.map((section, index) => (
            <ComponentRenderer
              key={index}
              component={section as Component}
            />
          ))}
        </main>
      </body>
    </html>
  )
}
