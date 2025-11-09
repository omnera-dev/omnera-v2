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
        <Button
          asChild
          variant={cta.variant}
          data-testid="nav-cta"
        >
          <a href={cta.href}>{cta.text}</a>
        </Button>
      )}
    </nav>
  )
}
