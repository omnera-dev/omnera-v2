/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Footer as FooterProps } from '@/domain/models/app/page/layout/footer'
import type { ReactElement } from 'react'

/**
 * Footer Component
 *
 * Renders the page footer with logo, copyright, optional legal links, and contact email.
 *
 * @param props - Footer configuration
 * @returns Footer element or undefined if disabled
 */
export function Footer({
  enabled = true,
  logo,
  description,
  copyright,
  email,
}: Readonly<FooterProps>): Readonly<ReactElement | undefined> {
  if (!enabled) {
    return undefined
  }

  return (
    <footer
      data-testid="footer"
      style={{ display: 'block', minHeight: '1px' }}
    >
      {logo && (
        <img
          data-testid="footer-logo"
          src={logo}
          alt="Footer logo"
        />
      )}
      {description && (
        <div data-testid="footer-description">{description}</div>
      )}
      {copyright}
      {email && (
        <a href={`mailto:${email}`}>{email}</a>
      )}
    </footer>
  )
}
