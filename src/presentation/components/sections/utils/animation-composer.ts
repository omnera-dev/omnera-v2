/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { composeAnimation } from '@/presentation/utils/animation-composer'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Apply component-specific animations based on type
 */
export function applyComponentAnimations(
  type: string,
  baseStyle: Record<string, unknown> | undefined,
  theme?: Theme
): Record<string, unknown> | undefined {
  if (!baseStyle) {
    return baseStyle
  }

  // Compose fadeOut animation for toast components
  const styleWithFadeOut =
    type === 'toast'
      ? composeAnimation({
          baseStyle,
          animationName: 'fadeOut',
          theme,
          defaultDuration: '300ms',
          defaultEasing: 'ease-out',
        })
      : baseStyle

  // Compose scaleUp animation for card components with scroll trigger
  const styleWithScaleUp =
    type === 'card'
      ? composeAnimation({
          baseStyle: styleWithFadeOut,
          animationName: 'scaleUp',
          theme,
          defaultDuration: '500ms',
          defaultEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          options: {
            animationPlayState: 'paused',
            animationFillMode: 'forwards',
            opacity: 0,
          },
        })
      : styleWithFadeOut

  // Compose float animation for fab components (continuous floating effect)
  const finalStyle =
    type === 'fab'
      ? composeAnimation({
          baseStyle: styleWithScaleUp,
          animationName: 'float',
          theme,
          defaultDuration: '3s',
          defaultEasing: 'ease-in-out',
          options: {
            infinite: true,
          },
        })
      : styleWithScaleUp

  return finalStyle
}
