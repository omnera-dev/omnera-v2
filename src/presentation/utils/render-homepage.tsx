/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { renderToString } from 'react-dom/server'
import { DefaultHomePage } from '@/presentation/components/pages/DefaultHomePage'
import { DynamicPage } from '@/presentation/components/pages/DynamicPage'
import type { App } from '@/domain/models/app'

/**
 * Renders a page by path to HTML string for server-side rendering
 *
 * @param app - Validated application data from AppSchema
 * @param path - Page path to render (e.g., '/', '/about')
 * @returns Complete HTML document as string with DOCTYPE, or null if page not found
 */
function renderPageByPath(app: App, path: string): string | undefined {
  const page = app.pages?.find((p) => p.path === path)
  if (!page) {
    return undefined
  }

  const html = renderToString(
    <DynamicPage
      page={page}
      blocks={app.blocks}
    />
  )

  return `<!DOCTYPE html>\n${html}`
}

/**
 * Renders homepage to HTML string for server-side rendering
 *
 * If the app has custom pages configured, renders the page with path '/'
 * Otherwise, renders the default homepage
 *
 * @param app - Validated application data from AppSchema
 * @returns Complete HTML document as string with DOCTYPE
 */
// @knip-ignore - Used via dynamic import in StartServer.ts
export function renderHomePage(app: App): string {
  // Try to render custom homepage first
  const customHomePage = renderPageByPath(app, '/')
  if (customHomePage) {
    return customHomePage
  }
  
  // Check if app has custom pages configured
  const homePage = app.pages?.find((page) => page.path === '/')

  // Render custom page if it exists, otherwise render default homepage
  const html = homePage
    ? renderToString(
        <DynamicPage
          page={homePage}
          theme={app.theme}
        />
      )
    : renderToString(<DefaultHomePage app={app} />)

  // Fallback to default homepage
  const html = renderToString(<DefaultHomePage app={app} />)
  return `<!DOCTYPE html>\n${html}`
}

/**
 * Renders any page by path to HTML string for server-side rendering
 *
 * @param app - Validated application data from AppSchema
 * @param path - Page path to render (e.g., '/', '/about')
 * @returns Complete HTML document as string with DOCTYPE, or undefined if page not found
 */
// @knip-ignore - Used via dynamic import in server.ts
export function renderPage(app: App, path: string): string | undefined {
  return renderPageByPath(app, path)
}
