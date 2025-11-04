/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'

/**
 * Sidebar link
 */
interface SidebarLink {
  readonly label: string
  readonly href: string
}

/**
 * Sidebar component props based on PageLayout schema
 */
interface SidebarProps {
  readonly enabled?: boolean
  readonly position?: 'left' | 'right'
  readonly width?: string
  readonly links?: readonly SidebarLink[]
  readonly [key: string]: unknown
}

/**
 * Sidebar component for page layout
 *
 * Renders a sidebar with configurable position and navigation links.
 * Uses <aside> element with role="complementary" for accessibility.
 *
 * @param props - Sidebar configuration
 * @returns Sidebar element
 */
export function Sidebar(props: SidebarProps): Readonly<ReactElement> {
  const width = props.width || '250px'
  const position = props.position || 'left'

  return (
    <aside
      data-testid="sidebar"
      data-position={position}
      style={{
        width,
        position: 'fixed',
        [position]: 0,
        top: 0,
        bottom: 0,
        padding: '1rem',
        borderRight: position === 'left' ? '1px solid #e5e7eb' : undefined,
        borderLeft: position === 'right' ? '1px solid #e5e7eb' : undefined,
      }}
    >
      {props.links && props.links.length > 0 && (
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {props.links.map((link) => (
              <li
                key={link.href}
                style={{ marginBottom: '0.5rem' }}
              >
                <a
                  href={link.href}
                  style={{ textDecoration: 'none', color: '#374151' }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  )
}
