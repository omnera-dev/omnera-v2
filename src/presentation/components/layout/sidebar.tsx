/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'

/**
 * Sidebar component props based on PageLayout schema
 */
interface SidebarProps {
  readonly position?: 'left' | 'right'
  readonly [key: string]: unknown
}

/**
 * Sidebar component for page layout
 *
 * Renders a sidebar with configurable position.
 * Uses <aside> element with role="complementary" for accessibility.
 *
 * @param props - Sidebar configuration
 * @returns Sidebar element
 */
export function Sidebar(props: SidebarProps): Readonly<ReactElement> {
  return (
    <aside
      data-testid="sidebar"
      data-position={props.position}
    >
      {/* Sidebar content will be rendered here */}
    </aside>
  )
}
