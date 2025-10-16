import { TypographyH1 } from '@/presentation/components/ui/typography'
import type { App } from '@/domain/models/app'
import type { ReactElement } from 'react'

/**
 * HomePage component - Displays application information
 *
 * @param props - Component props
 * @param props.app - Validated application data from AppSchema
 * @returns React element with app name
 */
export function HomePage({ app }: { readonly app: App }): Readonly<ReactElement> {
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
          href="/output.css"
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-page">
          <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="w-full max-w-2xl space-y-6 text-center">
              {/* App Name */}
              <TypographyH1 className="text-center">{app.name}</TypographyH1>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
