/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Page } from '@/domain/models/app/pages'

/**
 * DynamicPage component - Renders a custom page from configuration
 *
 * This component takes a page configuration and renders it as a complete HTML document
 * with all sections, metadata, and layout components.
 *
 * @param props - Component props
 * @param props.page - Page configuration from app schema
 * @param props.blocks - Optional blocks array for resolving block references
 * @returns React element with complete page structure
 */
export function DynamicPage({
  page,
  blocks,
}: {
  readonly page: Page
  readonly blocks?: Blocks
}): Readonly<ReactElement> {
  // Use default metadata if not provided
  const lang = page.meta?.lang || 'en-US'
  const title = page.meta?.title || page.name || page.path
  const description = page.meta?.description || ''

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{title}</title>
        {description && (
          <meta
            name="description"
            content={description}
          />
        )}
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
      </head>
      <body>
        <main>
          {page.sections.map((section, index) => (
            <ComponentRenderer
              key={index}
              component={section}
              blocks={blocks}
            />
          ))}
        </main>
      </body>
    </html>
  )
}
