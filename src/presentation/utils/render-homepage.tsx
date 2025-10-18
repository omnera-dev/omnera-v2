/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { renderToString } from 'react-dom/server'
import { DefaultHomePage } from '@/presentation/components/pages/DefaultHomePage'
import type { App } from '@/domain/models/app'

/**
 * Renders DefaultHomePage to HTML string for server-side rendering
 *
 * @param app - Validated application data from AppSchema
 * @returns Complete HTML document as string with DOCTYPE
 */
// @knip-ignore - Used via dynamic import in StartServer.ts
export function renderHomePage(app: App): string {
  const html = renderToString(<DefaultHomePage app={app} />)
  return `<!DOCTYPE html>\n${html}`
}
