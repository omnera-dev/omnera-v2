/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { useCallback, useState } from 'react'
import type { ClickInteraction } from '@/domain/models/app/page/common/interactions/click-interaction'

/**
 * Hook for handling click interactions on components
 *
 * Provides click handler and animation class name based on click interaction configuration.
 * Supports animations, navigation, scrolling, and other click actions.
 *
 * @param interaction - Click interaction configuration
 * @returns Object with onClick handler and className for animations
 */
export function useClickInteraction(interaction?: ClickInteraction): {
  readonly onClick: (event: React.MouseEvent<HTMLElement>) => void
  readonly className: string
} {
  const [isAnimating, setIsAnimating] = useState(false)

  const onClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!interaction) return

      // Handle animation
      if (interaction.animation && interaction.animation !== 'none') {
        setIsAnimating(true)
        // Reset animation after it completes (typical animation duration ~1s for pulse)
        setTimeout(() => setIsAnimating(false), 1000)
      }

      // Handle navigation
      if (interaction.navigate) {
        if (interaction.navigate.startsWith('#')) {
          // Anchor navigation
          window.location.hash = interaction.navigate
        } else {
          // Internal routing
          window.location.href = interaction.navigate
        }
      }

      // Handle openUrl
      if (interaction.openUrl) {
        if (interaction.openInNewTab) {
          window.open(interaction.openUrl, '_blank')
        } else {
          window.location.href = interaction.openUrl
        }
      }

      // Handle scrollTo
      if (interaction.scrollTo) {
        const targetElement = document.querySelector(interaction.scrollTo)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }

      // Handle toggleElement
      if (interaction.toggleElement) {
        const targetElement = document.querySelector(interaction.toggleElement)
        if (targetElement instanceof HTMLElement) {
          if (targetElement.style.display === 'none') {
            targetElement.style.display = ''
          } else {
            targetElement.style.display = 'none'
          }
        }
      }

      // Handle submitForm
      if (interaction.submitForm) {
        event.preventDefault()
        const form = document.querySelector(interaction.submitForm)
        if (form instanceof HTMLFormElement) {
          form.submit()
        }
      }
    },
    [interaction]
  )

  const animationClass = isAnimating && interaction?.animation
    ? `animate-${interaction.animation}`
    : ''

  return {
    onClick,
    className: animationClass,
  }
}
