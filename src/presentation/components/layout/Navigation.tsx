/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { ReactElement } from 'react'
import type { Navigation as NavigationProps } from '@/domain/models/app/page/layout/navigation'

/**
 * Navigation Component
 *
 * Renders the main navigation header with logo, links, and optional CTA button.
 *
 * @param props - Navigation configuration
 * @returns Navigation header element
 */
export function Navigation({ logo }: Readonly<NavigationProps>): Readonly<ReactElement> {
  return (
    <nav data-testid="navigation">
      <img
        src={logo}
        alt="Logo"
      />
    </nav>
  )
}
