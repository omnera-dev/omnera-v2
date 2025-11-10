/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Navigation as NavigationProps } from '@/domain/models/app/page/layout/navigation'
import type { ReactElement } from 'react'

/**
 * Maps CTA button variant to Tailwind CSS classes
 */
function getButtonVariantClasses(variant?: string): string {
  switch (variant) {
    case 'primary':
      return 'btn-primary bg-primary text-primary-foreground hover:bg-primary/90'
    case 'secondary':
      return 'btn-secondary bg-secondary text-secondary-foreground hover:bg-secondary/80'
    case 'outline':
      return 'btn-outline border border-input bg-background hover:bg-accent hover:text-accent-foreground'
    case 'ghost':
      return 'btn-ghost hover:bg-accent hover:text-accent-foreground'
    case 'link':
      return 'btn-link text-primary underline-offset-4 hover:underline'
    default:
      return 'btn-primary bg-primary text-primary-foreground hover:bg-primary/90'
  }
}

/**
 * Maps CTA button size to Tailwind CSS classes
 */
function getButtonSizeClasses(size?: string): string {
  switch (size) {
    case 'sm':
      return 'btn-sm h-9 rounded-md px-3 text-xs'
    case 'md':
      return 'btn-md h-10 px-4 py-2'
    case 'lg':
      return 'btn-lg h-11 rounded-md px-8'
    case 'xl':
      return 'btn-xl h-12 rounded-md px-10 text-lg'
    default:
      return 'btn-md h-10 px-4 py-2'
  }
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
}: Readonly<NavigationProps>): Readonly<ReactElement> {
  return (
    <nav data-testid="navigation">
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
            <a
              key={link.href}
              href={link.href}
              data-testid="nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      {cta && (
        <a
          href={cta.href}
          data-testid="nav-cta"
          className={`ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 ${getButtonVariantClasses(cta.variant)} ${getButtonSizeClasses(cta.size)}`}
        >
          {cta.text}
        </a>
      )}
    </nav>
  )
}
