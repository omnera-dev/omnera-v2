/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { Badge } from '@/presentation/components/ui/badge'
import { TypographyH1, TypographyLead } from '@/presentation/components/ui/typography'
import type { App } from '@/domain/models/app'

/**
 * DefaultHomePage component - Default home page displaying application information
 *
 * This is the fallback home page shown when no custom page configuration is provided.
 * Displays the app name, optional version badge, and optional description in a centered layout.
 *
 * @param props - Component props
 * @param props.app - Validated application data from AppSchema
 * @returns React element with app information
 */
export function DefaultHomePage({ app }: { readonly app: App }): Readonly<ReactElement> {
  return (
    <html
      lang="en"
      dir="ltr"
    >
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
      <body className="h-screen overflow-hidden bg-linear-to-br from-gray-50 to-gray-100">
        <div className="container-page h-full">
          <div className="flex h-full flex-col items-center justify-center">
            <div className="w-full max-w-2xl space-y-6 text-center">
              {/* Version Badge */}
              {app.version && <Badge data-testid="app-version-badge">{app.version}</Badge>}
              {/* App Name */}
              <TypographyH1
                className="text-center"
                data-testid="app-name-heading"
              >
                {app.name}
              </TypographyH1>
              {/* App Description */}
              {app.description && (
                <TypographyLead
                  data-testid="app-description"
                  className="text-center"
                >
                  {app.description}
                </TypographyLead>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
