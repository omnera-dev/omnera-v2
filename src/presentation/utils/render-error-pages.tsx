import { renderToString } from 'react-dom/server'
import { ErrorPage } from '@/presentation/components/pages/ErrorPage'
import { NotFoundPage } from '@/presentation/components/pages/NotFoundPage'

/**
 * Renders NotFoundPage (404) to HTML string for server-side rendering
 *
 * @returns Complete HTML document as string with DOCTYPE
 */
export function renderNotFoundPage(): string {
  const html = renderToString(<NotFoundPage />)
  return `<!DOCTYPE html>\n${html}`
}

/**
 * Renders ErrorPage (500) to HTML string for server-side rendering
 *
 * @returns Complete HTML document as string with DOCTYPE
 */
export function renderErrorPage(): string {
  const html = renderToString(<ErrorPage />)
  return `<!DOCTYPE html>\n${html}`
}
