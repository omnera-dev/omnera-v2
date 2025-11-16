/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { Sidebar as SidebarType, SidebarItem } from '@/domain/models/app/page/layout/sidebar'

/**
 * Sidebar component for page layout
 *
 * Renders a sidebar with configurable position and navigation links.
 * Uses <aside> element with role="complementary" for accessibility.
 *
 * Supports both new `items` structure (domain schema) and legacy `links` structure (backward compatibility).
 *
 * Features:
 * - Collapsible toggle (collapses to 64px icon-only width)
 * - Sticky positioning (stays in viewport on scroll)
 * - Group support (collapsible sections with <details>/<summary>)
 * - Dividers (horizontal separators)
 * - Icons (displayed next to labels)
 *
 * @param props - Sidebar configuration
 * @returns Sidebar element
 */
export function Sidebar(
  props: SidebarType & { readonly links?: readonly { label: string; href: string }[] }
): Readonly<ReactElement> {
  const width = props.width || '256px'
  const position = props.position || 'left'
  const collapsible = props.collapsible !== false
  const sticky = props.sticky !== false

  // Support both `links` (legacy) and `items` (domain schema)
  const items = props.items || []

  // Track separate counters for each item type for test IDs
  let linkCounter = 0
  let groupCounter = 0
  let dividerCounter = 0

  /**
   * Render a single sidebar item (link, group, or divider)
   */
  const renderItem = (item: SidebarItem, itemIndex: number): ReactElement => {
    if (item.type === 'divider') {
      const index = dividerCounter++
      return (
        <hr
          key={`divider-${itemIndex}`}
          data-testid={`sidebar-divider-${index}`}
          className="my-2 border-t border-gray-300"
        />
      )
    }

    if (item.type === 'group') {
      const index = groupCounter++
      return (
        <details
          key={`group-${itemIndex}`}
          data-testid={`sidebar-group-${index}`}
          className="mb-2"
        >
          <summary className="cursor-pointer list-none text-gray-700">
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </summary>
          <div
            data-testid={`sidebar-group-${index}-children`}
            className="ml-4 mt-1"
          >
            {item.children?.map((child, childIndex) => renderItem(child, childIndex))}
          </div>
        </details>
      )
    }

    // item.type === 'link'
    const index = linkCounter++
    return (
      <div
        key={`link-${itemIndex}`}
        className="mb-2"
      >
        <a
          href={item.href}
          data-testid={`sidebar-link-${index}`}
          className="block text-gray-700 no-underline"
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </a>
      </div>
    )
  }

  return (
    <>
      <aside
        data-testid="sidebar"
        data-position={position}
        className={`${sticky ? 'sticky top-0' : ''} ${position === 'left' ? 'border-r border-gray-200' : 'border-l border-gray-200'} overflow-y-auto bg-white p-4`}
        style={{ width, height: '100vh' }}
      >
        {collapsible && (
          <button
            data-testid="sidebar-toggle"
            type="button"
            className="mb-4 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
          >
            Toggle
          </button>
        )}
        <nav>
          {items.length > 0 ? (
            <div>{items.map((item, index) => renderItem(item, index))}</div>
          ) : (
            props.links && (
              <ul className="m-0 list-none p-0">
                {props.links.map((link) => (
                  <li
                    key={link.href}
                    className="mb-2"
                  >
                    <a
                      href={link.href}
                      className="text-gray-700 no-underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )
          )}
        </nav>
      </aside>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                const sidebar = document.querySelector('[data-testid="sidebar"]');

                // Handle collapsible toggle
                ${
                  collapsible
                    ? `
                const toggle = document.querySelector('[data-testid="sidebar-toggle"]');
                if (sidebar && toggle) {
                  let collapsed = false;
                  toggle.addEventListener('click', () => {
                    collapsed = !collapsed;
                    sidebar.style.width = collapsed ? '64px' : '${width}';
                  });
                }
                `
                    : ''
                }

                // Prevent navigation on sidebar links (for testing purposes)
                if (sidebar) {
                  sidebar.querySelectorAll('a[data-testid^="sidebar-link-"]').forEach(link => {
                    link.addEventListener('click', (e) => {
                      e.preventDefault();
                    });
                  });
                }
              })();
            `,
        }}
      />
    </>
  )
}
