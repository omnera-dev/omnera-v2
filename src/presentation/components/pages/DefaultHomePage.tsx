/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { Badge } from '@/presentation/components/ui/badge'
import { TypographyH1, TypographyLead } from '@/presentation/components/ui/typography'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import type { App } from '@/domain/models/app'
import type { Component } from '@/domain/models/app/page/sections'

/**
 * DefaultHomePage component - Default home page displaying application information
 *
 * This is the default home page shown when no custom page configuration is provided.
 * It displays the app name, optional version badge, and optional description in a centered layout with gradient background.
 *
 * @param props - Component props
 * @param props.app - Validated application data from AppSchema
 * @returns React element with app information
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
          href="/assets/output.css"
        />
      </head>
      <body
        className={
          app.blocks
            ? 'min-h-screen bg-linear-to-br from-gray-50 to-gray-100'
            : 'h-screen overflow-hidden bg-linear-to-br from-gray-50 to-gray-100'
        }
      >
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
              {/* Blocks - Render reusable UI components with data-block attributes */}
              <div className="w-full space-y-4">
                {app.blocks?.map((block) => (
                  <ComponentRenderer
                    key={block.name}
                    // SAFETY: Block and Component have compatible structures (type, props, children, content)
                    // Type assertion is required until domain models are unified or renderer supports both types
                    component={block as unknown as Component}
                    blockName={block.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
