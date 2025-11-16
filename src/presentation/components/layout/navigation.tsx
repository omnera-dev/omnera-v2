/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { useEffect, useState } from 'react'
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
          {link.children?.map((child: NavLink) => (
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
 * Supports sticky positioning, transparent background with scroll detection,
 * search input, and user authentication menu.
 *
 * @param props - Navigation configuration
 * @returns Navigation header element
 */
export function Navigation({
  logo,
  logoAlt,
  sticky,
  transparent,
  links,
  cta,
  search,
  user,
  backgroundColor,
  textColor,
}: Readonly<NavigationProps>): Readonly<ReactElement> {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (!transparent) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [transparent])

  const navStyle = buildColorStyles(backgroundColor, textColor)
  const navClasses = [
    sticky && 'sticky top-0 z-50',
    transparent && !isScrolled && 'bg-transparent',
    transparent && isScrolled && 'bg-white shadow-md',
  ]
    .filter(Boolean)
    .join(' ')

  const altText = logoAlt ?? 'Logo'

  return (
    <nav
      data-testid="navigation"
      aria-label="Main navigation"
      style={{
        ...navStyle,
        ...(sticky && { position: 'sticky', top: 0, zIndex: 50 }),
        ...(transparent && !isScrolled && { backgroundColor: 'transparent' }),
        ...(transparent && isScrolled && { backgroundColor: 'white' }),
      }}
      className={navClasses}
    >
      <a
        href="/"
        aria-label=""
      >
        <img
          data-testid="nav-logo"
          src={logo}
          alt={altText}
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
        >
          <a
            href={cta.href}
            data-testid="nav-cta"
            role="button"
          >
            {cta.text}
          </a>
        </Button>
      )}
      {search?.enabled && (
        <div data-testid="nav-search">
          <input
            type="search"
            placeholder={search.placeholder ?? 'Search...'}
            aria-label={search.placeholder ?? 'Search...'}
            className="search-input"
          />
        </div>
      )}
      {user?.enabled && (
        <div data-testid="user-menu">
          <a
            href={user.loginUrl}
            data-testid="login-link"
          >
            Login
          </a>
          <a
            href={user.signupUrl}
            data-testid="signup-link"
          >
            Sign Up
          </a>
        </div>
      )}
    </nav>
  )
}
