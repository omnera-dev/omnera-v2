/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Layer } from 'effect'
import { PageRenderer } from '@/application/ports/page-renderer'
import { renderErrorPage, renderNotFoundPage } from '@/presentation/utils/render-error-pages'
import { renderHomePage, renderPage } from '@/presentation/utils/render-homepage'

/**
 * Live implementation of PageRenderer using React SSR
 *
 * This Layer provides production page rendering logic,
 * wrapping the presentation layer rendering functions in an
 * Effect Context service.
 *
 * Located in Presentation layer because it directly depends on
 * presentation utilities (render-homepage, render-error-pages).
 *
 * The implementation uses Layer.succeed because all rendering
 * functions are pure and synchronous (no async operations).
 *
 * @example
 * ```typescript
 * // Provide PageRendererLive to use cases
 * const program = startServer(appConfig).pipe(
 *   Effect.provide(PageRendererLive)
 * )
 * ```
 */
export const PageRendererLive = Layer.succeed(PageRenderer, {
  renderHome: renderHomePage,
  renderPage,
  renderNotFound: renderNotFoundPage,
  renderError: renderErrorPage,
})
