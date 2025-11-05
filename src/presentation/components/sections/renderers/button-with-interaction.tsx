/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ClickInteraction } from '@/domain/models/app/page/common/interactions/click-interaction'

interface ButtonWithInteractionProps {
  readonly clickInteraction?: ClickInteraction
  readonly [key: string]: unknown
  readonly className?: string
  readonly children: React.ReactNode
}

/**
 * Button component with click interaction support
 *
 * Stores interaction configuration in data attribute for client-side handling.
 * The client-side script (click-interactions.js) reads this data and handles the interactions.
 */
export function ButtonWithInteraction({
  clickInteraction,
  className,
  children,
  ...props
}: ButtonWithInteractionProps) {
  return (
    <button
      {...props}
      className={className}
      {...(clickInteraction && {
        'data-click-interaction': JSON.stringify(clickInteraction),
      })}
    >
      {children}
    </button>
  )
}
