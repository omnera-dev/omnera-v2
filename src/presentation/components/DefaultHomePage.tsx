import { TypographyH1 } from '@/presentation/components/ui/typography'
import type { App } from '@/domain/models/app'
import type { ReactElement } from 'react'

/**
 * DefaultHomePage component - Default home page displaying application information
 *
 * This is the default home page shown when no custom page configuration is provided.
 * It displays the app name in a centered layout with gradient background.
 *
 * @param props - Component props
 * @param props.app - Validated application data from AppSchema
 * @returns React element with app name
 */
export function DefaultHomePage({ app }: { readonly app: App }): Readonly<ReactElement> {
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
      <body className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-page h-full">
          <div className="flex h-full flex-col items-center justify-center">
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
