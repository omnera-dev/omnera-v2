/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { App } from '@/domain/models/app'
import type { Page } from '@/domain/models/app/pages'

/**
 * Component section type (simplified for Phase 0 implementation)
 */
type ComponentSection = {
  readonly type: string
  readonly children?: readonly ComponentSection[]
  readonly content?: string
}

/**
 * Section component renderer
 *
 * Renders a single section from the page configuration
 */
function Section({
  section,
  theme,
}: {
  readonly section: ComponentSection
  readonly theme: App['theme']
}): ReactElement | undefined {
  if (section.type === 'flex') {
    // Apply theme.spacing.gap to flex containers
    const gapValue = theme?.spacing?.gap
    const style = gapValue ? { gap: gapValue } : undefined

    return (
      <div
        data-testid="flex"
        style={style}
        className="flex"
      >
        {section.children?.map((child, index) => (
          <Section
            key={index}
            section={child}
            theme={theme}
          />
        ))}
      </div>
    )
  }

  if (section.type === 'text') {
    return <div>{section.content}</div>
  }

  return undefined
}

/**
 * DynamicPage component - Renders pages with custom sections
 *
 * @param props - Component props
 * @param props.app - Validated application data from AppSchema
 * @param props.page - Page configuration with sections
 * @returns React element with custom page content
 */
export function DynamicPage({
  app,
  page,
}: {
  readonly app: App
  readonly page: Page
}): Readonly<ReactElement> {
  return (
    <html lang={page.meta.lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{page.meta.title}</title>
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
      </head>
      <body>
        {page.sections.map((section, index) => (
          <Section
            key={index}
            section={section}
            theme={app.theme}
          />
        ))}
      </body>
    </html>
  )
}
