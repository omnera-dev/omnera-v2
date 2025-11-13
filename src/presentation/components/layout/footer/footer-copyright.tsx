/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { ReactElement } from 'react'

interface FooterCopyrightProps {
  readonly copyright?: string
}

export function FooterCopyright({ copyright }: FooterCopyrightProps): ReactElement | undefined {
  if (!copyright) {
    return undefined
  }

  return <div data-testid="footer-copyright">{copyright}</div>
}
