/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Button } from '@/presentation/components/ui/button'
import { buildColorStyles } from '@/presentation/utils/styles'
import type { Navigation as NavigationProps } from '@/domain/models/app/page/layout/navigation'
import type { NavLink } from '@/domain/models/app/page/layout/navigation/nav-links'
import type { ReactElement } from 'react'

/**
 * NavLinkItem Component
 *
 * Renders a single navigation link with support for icons, badges, and dropdowns.
 *
 * @param link - Navigation link configuration
 * @returns Navigation link element
 */
function NavLinkItem({ link }: Readonly<{ link: NavLink }>): Readonly<ReactElement> {
  const hasChildren = link.children && link.children.length > 0

  const linkProps = {
    href: link.href,
    'data-testid': 'nav-link',
    ...(link.target && { target: link.target }),
    ...(link.target === '_blank' && { rel: 'noopener noreferrer' }),
  }

  if (hasChildren) {
    return (
      <div className="relative group">
        <a
          {...linkProps}
          className="flex items-center gap-2"
        >
          {link.label}
          {link.badge && (
            <span
              data-testid="badge"
              className="text-xs px-2 py-0.5 rounded bg-blue-500 text-white"
            >
              {link.badge}
            </span>
          )}
        </a>
        <div
          data-testid="nav-dropdown"
          className="hidden group-hover:block absolute top-full left-0 mt-1 bg-white shadow-lg rounded p-2"
        >
          {link.children?.map((child) => (
            <a
              key={child.href}
              href={child.href}
              className="block px-4 py-2 hover:bg-gray-100"
            >
              {child.label}
            </a>
          ))}
        </div>
      </div>
    )
  }

  return (
    <a
      {...linkProps}
      className="flex items-center gap-2"
    >
      {link.label}
      {link.badge && (
        <span
          data-testid="badge"
          className="text-xs px-2 py-0.5 rounded bg-blue-500 text-white"
        >
          {link.badge}
        </span>
      )}
    </a>
  )
}

/**
 * Navigation Component
 *
 * Renders the main navigation header with logo, links, and optional CTA button.
 *
 * @param props - Navigation configuration
 * @returns Navigation header element
 */
export function Navigation({
  logo,
  links,
  cta,
  backgroundColor,
  textColor,
}: Readonly<NavigationProps>): Readonly<ReactElement> {
  const navStyle = buildColorStyles(backgroundColor, textColor)

  return (
    <nav
      data-testid="navigation"
      style={navStyle}
    >
      <a
        href="/"
        data-testid="nav-logo-link"
      >
        <img
          data-testid="nav-logo"
          src={logo}
          alt="Logo"
        />
      </a>
      {links?.desktop && (
        <div
          data-testid="nav-links"
          className="flex gap-4"
        >
          {links.desktop.map((link) => (
            <NavLinkItem
              key={link.href}
              link={link}
            />
          ))}
        </div>
      )}
      {cta && (
        <Button
          asChild
          variant={cta.variant}
          size={cta.size}
          color={cta.color}
          icon={cta.icon}
          iconPosition={cta.iconPosition}
          data-testid="nav-cta"
        >
          <a href={cta.href}>{cta.text}</a>
        </Button>
      )}
    </nav>
  )
}
