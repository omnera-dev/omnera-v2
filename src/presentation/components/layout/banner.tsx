/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Banner as BannerProps } from '@/domain/models/app/page/layout/banner'
import type { ReactElement } from 'react'

/**
 * Banner Component
 *
 * Renders a top announcement banner with optional message and link.
 *
 * @param props - Banner configuration
 * @returns Banner element or null if disabled
 */
export function Banner({
  enabled,
  message,
  text,
  link,
  gradient,
}: Readonly<BannerProps>): Readonly<ReactElement | undefined> {
  // Don't render if explicitly disabled
  if (enabled === false) {
    return undefined
  }

  const content = message || text

  return (
    <div
      role="banner"
      data-testid="banner"
      className="py-3"
      style={gradient ? { background: gradient } : undefined}
    >
      <div className="container flex items-center justify-center gap-4">
        <p
          data-testid="banner-text"
          className="font-medium"
        >
          {content}
        </p>
        {link && (
          <a
            data-testid="banner-link"
            href={link.href}
            className="font-semibold underline hover:opacity-80"
          >
            {link.label}
          </a>
        )}
      </div>
    </div>
  )
}
