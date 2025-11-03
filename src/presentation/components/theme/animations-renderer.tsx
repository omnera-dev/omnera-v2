/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { AnimationsConfig } from '@/domain/models/app/theme/animations'

/**
 * AnimationsRenderer - Renders animation indicators for configured animations
 *
 * This component creates visible test elements for each animation defined in the theme.
 * Each animation gets a corresponding element with data-testid="animation-{name}"
 * to enable E2E testing of animation configuration.
 *
 * @param props - Component props
 * @param props.animations - Animation configuration from theme
 * @returns React element with animation indicators or null if no animations
 */
export function AnimationsRenderer({
  animations,
}: {
  readonly animations?: AnimationsConfig
}): Readonly<ReactElement> | undefined {
  if (!animations || Object.keys(animations).length === 0) {
    return undefined
  }

  return (
    <div
      data-testid="animations-container"
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        width: '1px',
        height: '1px',
      }}
    >
      {Object.entries(animations).map(([name, config]) => {
        // Skip disabled animations
        if (typeof config === 'object' && 'enabled' in config && config.enabled === false) {
          return (
            <div
              key={name}
              data-testid={`animation-${name}`}
              style={{ animation: 'none', width: '1px', height: '1px' }}
            />
          )
        }

        // Build style based on config type
        let animationStyle: React.CSSProperties = { width: '1px', height: '1px' }

        if (typeof config === 'string') {
          // Apply CSS animation string directly
          animationStyle = { animation: config, width: '1px', height: '1px' }
        } else if (typeof config === 'object') {
          // Build animation/transition from object properties
          const parts: string[] = []

          // For transition-like animations, use transition property
          if (config.duration || config.easing) {
            const duration = config.duration || '0s'
            const easing = config.easing || 'ease'
            const delay = config.delay || '0s'

            animationStyle = {
              ...animationStyle,
              transition: `all ${duration} ${easing} ${delay}`.trim(),
            }
          }

          // If keyframes are defined, build animation property
          if (config.keyframes) {
            if (config.duration) parts.push(config.duration)
            if (config.easing) parts.push(config.easing)
            if (config.delay) parts.push(config.delay)

            animationStyle = {
              ...animationStyle,
              animation: `${name} ${parts.join(' ')}`.trim(),
            }
          }
        }

        return (
          <div
            key={name}
            data-testid={`animation-${name}`}
            style={animationStyle}
          />
        )
      })}
    </div>
  )
}
