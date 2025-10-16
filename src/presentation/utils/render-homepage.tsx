import { renderToString } from 'react-dom/server'
import { HomePage } from '@/presentation/components/HomePage'
import type { App } from '@/domain/models'

/**
 * Renders HomePage to HTML string for server-side rendering
 *
 * @param app - Validated application data from AppSchema
 * @returns Complete HTML document as string with DOCTYPE
 */
export function renderHomePage(app: App): string {
  const html = renderToString(<HomePage app={app} />)
  return `<!DOCTYPE html>\n${html}`
}