import type { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import type { App } from '@/schema'
import { TypographyH1, TypographyLead, TypographyMuted } from '@/components/ui/typography'

/**
 * HomePage component - Displays application information
 *
 * @param props - Component props
 * @param props.app - Validated application data from AppSchema
 * @returns React element with app name and description
 */
export function HomePage({ app }: { app: App }): ReactElement {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          name="description"
          content={app.description}
        />
        <title>{`${app.name} - Powered by Omnera`}</title>
        <link
          rel="stylesheet"
          href="/output.css"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-page">
          <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="card w-full max-w-2xl space-y-6 text-center">
              {/* App Name */}
              <TypographyH1 className="text-center">{app.name}</TypographyH1>

              {/* App Description */}
              <TypographyLead className="text-center">{app.description}</TypographyLead>

              {/* Powered by badge */}
              <div className="flex items-center justify-center space-x-2 pt-4">
                <TypographyMuted>Powered by</TypographyMuted>
                <span className="font-bold text-blue-600">Omnera</span>
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                  Bun
                </span>
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                  Effect
                </span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                  Hono
                </span>
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium text-cyan-800">
                  React
                </span>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
                  Tailwind CSS
                </span>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

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
