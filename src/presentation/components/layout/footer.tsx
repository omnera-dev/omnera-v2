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
 * Renders the page footer with copyright and optional legal links.
 *
 * @param props - Footer configuration
 * @returns Footer element
 */
export function Footer({ copyright }: Readonly<FooterProps>): Readonly<ReactElement> {
  return (
    <footer data-testid="footer">
      {copyright && <span>{copyright}</span>}
    </footer>
  )
}
