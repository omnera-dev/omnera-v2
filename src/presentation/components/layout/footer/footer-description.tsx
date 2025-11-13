/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { ReactElement } from 'react'

interface FooterDescriptionProps {
  readonly description?: string
}

export function FooterDescription({
  description,
}: FooterDescriptionProps): ReactElement | undefined {
  if (!description) {
    return undefined
  }

  return <div data-testid="footer-description">{description}</div>
}
