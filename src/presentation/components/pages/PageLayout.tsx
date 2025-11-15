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
import { mergeLayouts } from '@/domain/models/app/page/layout-merge'
import type { Layout } from '@/domain/models/app/page/layout'
import type { Page } from '@/domain/models/app/pages'

/**
 * Props for PageLayout component
 */
type PageLayoutProps = {
  readonly page: Page
  readonly defaultLayout?: Layout
  readonly children: ReactNode
}

/**
 * Renders optional layout components (banner, navigation, sidebar, footer)
 *
 * Always renders layout component wrappers to ensure they exist in the DOM.
 * Components are hidden when not configured to support .toBeHidden() test assertions.
 * Uses <template> element for hidden placeholders to avoid DOM pollution.
 *
 * Merges page layout with default layout:
 * - page.layout = undefined: Use defaultLayout
 * - page.layout = null: No layout (all components hidden)
 * - page.layout = object: Merge with defaultLayout (extends/overrides)
 *
 * @param props - Component props
 * @returns Layout wrapper with conditional components
 */
export function PageLayout({
  page,
  defaultLayout,
  children,
}: PageLayoutProps): Readonly<ReactElement> {
  const layout = mergeLayouts(defaultLayout, page.layout)

  return (
    <>
      {layout?.banner ? (
        <Banner {...layout.banner} />
      ) : (
        <span
          data-testid="banner"
          hidden
        />
      )}
      {layout?.navigation ? (
        <Navigation {...layout.navigation} />
      ) : (
        <span
          data-testid="navigation"
          hidden
        />
      )}
      {layout?.sidebar ? (
        <Sidebar {...layout.sidebar} />
      ) : (
        <span
          data-testid="sidebar"
          hidden
        />
      )}
      {children}
      {layout?.footer ? (
        <Footer {...layout.footer} />
      ) : (
        <span
          data-testid="footer"
          hidden
        />
      )}
    </>
  )
}
