/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Button } from '@/presentation/components/ui/button'
import type { Navigation as NavigationProps } from '@/domain/models/app/page/layout/navigation'
import type { ReactElement } from 'react'

/**
 * Navigation Component
 *
 * Renders the main navigation header with logo, links, and optional CTA button.
 *
 * @param props - Navigation configuration
 * @returns Navigation header element
 */
export function Navigation({ logo, cta }: Readonly<NavigationProps>): Readonly<ReactElement> {
  return (
    <nav data-testid="navigation">
      <img
        src={logo}
        alt="Logo"
      />
      {cta && (
        <Button
          asChild
          data-testid="nav-cta"
        >
          <a href={cta.href}>{cta.text}</a>
        </Button>
      )}
    </nav>
  )
}
