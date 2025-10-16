import { renderToString } from 'react-dom/server'
import { DefaultHomePage } from '@/presentation/components/DefaultHomePage'
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
