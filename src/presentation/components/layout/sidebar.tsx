/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { Sidebar as SidebarType } from '@/domain/models/app/page/layout/sidebar'

/**
 * Sidebar component for page layout
 *
 * Renders a sidebar with configurable position and navigation links.
 * Uses <aside> element with role="complementary" for accessibility.
 *
 * Supports both new `items` structure (domain schema) and legacy `links` structure (backward compatibility).
 *
 * @param props - Sidebar configuration
 * @returns Sidebar element
 */
export function Sidebar(props: SidebarType & { readonly links?: readonly { label: string; href: string }[] }): Readonly<ReactElement> {
  const width = props.width || '250px'
  const position = props.position || 'left'

  // Support both `links` (legacy) and `items` (domain schema)
  // Convert items to simple link format if items are provided
  const itemsAsLinks = props.items
    ?.filter((item) => item.type === 'link' && item.label && item.href)
    .map((item) => ({ label: item.label!, href: item.href! }))

  const navigationLinks = props.links || itemsAsLinks

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
      {navigationLinks && navigationLinks.length > 0 && (
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navigationLinks.map((link) => (
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
