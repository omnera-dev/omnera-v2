/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement, type ReactNode } from 'react'
import { Banner } from '@/presentation/components/layout/banner'
import { Footer } from '@/presentation/components/layout/footer'
import { Navigation } from '@/presentation/components/layout/navigation'
import { Sidebar } from '@/presentation/components/layout/sidebar'
import type { Page } from '@/domain/models/app/pages'

/**
 * Props for PageLayout component
 */
type PageLayoutProps = {
  readonly page: Page
  readonly children: ReactNode
}

/**
 * Renders optional layout components (banner, navigation, sidebar, footer)
 *
 * Always renders layout component wrappers to ensure they exist in the DOM.
 * Components are hidden when not configured to support .toBeHidden() test assertions.
 * Uses <template> element for hidden placeholders to avoid DOM pollution.
 *
 * @param props - Component props
 * @returns Layout wrapper with conditional components
 */
export function PageLayout({ page, children }: PageLayoutProps): Readonly<ReactElement> {
  return (
    <>
      {page.layout?.banner ? (
        <Banner {...page.layout.banner} />
      ) : (
        <span
          data-testid="banner"
          hidden
        />
      )}
      {page.layout?.navigation ? (
        <Navigation {...page.layout.navigation} />
      ) : (
        <span
          data-testid="navigation"
          hidden
        />
      )}
      {page.layout?.sidebar ? (
        <Sidebar {...page.layout.sidebar} />
      ) : (
        <span
          data-testid="sidebar"
          hidden
        />
      )}
      {children}
      {page.layout?.footer ? (
        <Footer {...page.layout.footer} />
      ) : (
        <span
          data-testid="footer"
          hidden
        />
      )}
    </>
  )
}
