/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { ReactElement } from 'react'

interface FooterLogoProps {
  readonly logo?: string
}

export function FooterLogo({ logo }: FooterLogoProps): ReactElement | undefined {
  if (!logo) {
    return undefined
  }

  return (
    <img
      data-testid="footer-logo"
      src={logo}
      alt="Footer logo"
    />
  )
}
