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
 * Conditionally renders layout components based on page configuration.
 * Wraps main content with these layout elements.
 *
 * @param props - Component props
 * @returns Layout wrapper with conditional components
 */
export function PageLayout({ page, children }: PageLayoutProps): Readonly<ReactElement> {
  return (
    <>
      {page.layout?.banner && <Banner {...page.layout.banner} />}
      {page.layout?.navigation && <Navigation {...page.layout.navigation} />}
      {page.layout?.sidebar && <Sidebar {...page.layout.sidebar} />}
      {children}
      {page.layout?.footer && <Footer {...page.layout.footer} />}
    </>
  )
}
