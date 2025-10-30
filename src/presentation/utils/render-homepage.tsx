/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { renderToString } from 'react-dom/server'
import { DefaultHomePage } from '@/presentation/components/pages/DefaultHomePage'
import { renderSections } from './render-sections'
import type { App } from '@/domain/models/app'

/**
 * CustomPage component - Renders custom page with sections
 *
 * @param props - Component props
 * @param props.app - Application configuration
 * @returns React element
 */
function CustomPage({ app }: { readonly app: App }) {
  const sections = renderSections(app)

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{`${app.name} - Powered by Omnera`}</title>
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
      </head>
      <body>{sections}</body>
    </html>
  )
}

/**
 * Renders homepage to HTML string for server-side rendering
 *
 * If app.pages exists, renders the first page with custom sections.
 * Otherwise, renders DefaultHomePage with app name/version/description.
 *
 * @param app - Validated application data from AppSchema
 * @returns Complete HTML document as string with DOCTYPE
 */
// @knip-ignore - Used via dynamic import in StartServer.ts
export function renderHomePage(app: App): string {
  const html =
    app.pages && app.pages.length > 0 ? (
      renderToString(<CustomPage app={app} />)
    ) : (
      renderToString(<DefaultHomePage app={app} />)
    )
  return `<!DOCTYPE html>\n${html}`
}
