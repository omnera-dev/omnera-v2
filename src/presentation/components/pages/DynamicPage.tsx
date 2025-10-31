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

/**
 * DynamicPage component - Renders a custom page from configuration
 *
 * This component takes a page configuration and renders it as a complete HTML document
 * with all sections, metadata, and layout components.
 *
 * @param props - Component props
 * @param props.page - Page configuration from app schema
 * @returns React element with complete page structure
 */
export function DynamicPage({ page }: { readonly page: Page }): Readonly<ReactElement> {
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
