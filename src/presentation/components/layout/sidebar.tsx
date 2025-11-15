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
      className={`fixed top-0 bottom-0 p-4 ${position === 'left' ? 'left-0 border-r border-gray-200' : 'right-0 border-l border-gray-200'}`}
      style={{ width }}
    >
      {navigationLinks && navigationLinks.length > 0 && (
        <nav>
          <ul className="list-none p-0 m-0">
            {navigationLinks.map((link) => (
              <li
                key={link.href}
                className="mb-2"
              >
                <a
                  href={link.href}
                  className="no-underline text-gray-700"
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
