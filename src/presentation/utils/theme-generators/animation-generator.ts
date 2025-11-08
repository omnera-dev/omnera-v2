/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { toKebabCase } from '@/presentation/utils/string-utils'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Generate CSS keyframes for theme animations
 * Creates @keyframes rules for animations defined in theme
 *
 * @param animations - Animation configuration from theme
 * @returns Array of CSS keyframe strings
 */
export function generateAnimationKeyframes(
  animations?: Theme['animations']
): ReadonlyArray<string> {
  if (!animations) {
    return []
  }

  return Object.entries(animations).flatMap<string>(([name, config]) => {
    // Skip disabled animations
    if (typeof config === 'object' && 'enabled' in config && config.enabled === false) {
      return []
    }

    const kebabName = toKebabCase(name)

    // Generate default keyframes for common animations
    const defaultKeyframes: Record<string, string> = {
      'fade-in': `
        @keyframes ${kebabName} {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
      'slide-in': `
        @keyframes ${kebabName} {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `,
      pulse: `
        @keyframes ${kebabName} {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `,
    }

    // Use default keyframes if available
    const defaultKeyframe = defaultKeyframes[kebabName]
    if (defaultKeyframe) {
      return [defaultKeyframe]
    }

    // If config has custom keyframes, generate them
    if (typeof config === 'object' && config.keyframes) {
      const frames = Object.entries(config.keyframes)
        .map(([percent, styles]) => {
          const cssProps = Object.entries(styles as Record<string, unknown>)
            .map(([prop, value]) => `${toKebabCase(prop)}: ${value};`)
            .join(' ')
          return `${percent} { ${cssProps} }`
        })
        .join('\n          ')

      return [
        `
        @keyframes ${kebabName} {
          ${frames}
        }
      `,
      ]
    }

    return []
  })
}

/**
 * Generate CSS styles for theme animations
 * Creates transition, parallax, and typewriter animation styles
 *
 * @param animations - Animation configuration from theme
 * @returns CSS string with animation styles
 */
export function generateAnimationStyles(animations?: Theme['animations']): string {
  if (!animations) {
    return ''
  }

  // Build animation keyframes
  const animationKeyframes = generateAnimationKeyframes(animations)

  // Build transition styles for interactive elements
  const transitionConfig = animations.transition
  const transitionStyles: ReadonlyArray<string> =
    transitionConfig && typeof transitionConfig === 'object'
      ? [
          [
            'button {',
            `  transition: all ${transitionConfig.duration || '200ms'} ${transitionConfig.easing || 'ease-in-out'};`,
            '}',
          ].join('\n'),
        ]
      : []

  // Build parallax styles for hero sections with parallax animation
  const parallaxConfig = animations.parallax
  const parallaxStyles: ReadonlyArray<string> = parallaxConfig
    ? [
        [
          '[data-testid="hero-background"] {',
          '  display: block;',
          '  min-height: 200px;',
          '  min-width: 100%;',
          '}',
        ].join('\n'),
      ]
    : []

  // Build typewriter styles for heading elements with typewriter animation
  const typewriterConfig = animations.typewriter
  const typewriterStyles: ReadonlyArray<string> =
    typewriterConfig && typeof typewriterConfig === 'object'
      ? [
          [
            '[data-testid="hero-heading"] {',
            `  animation: typewriter ${typewriterConfig.duration || '4s'} ${typewriterConfig.easing || 'steps(40, end)'};`,
            '  overflow: hidden;',
            '  white-space: nowrap;',
            '  border-right: 2px solid;',
            '}',
          ].join('\n'),
        ]
      : []

  return [...animationKeyframes, ...transitionStyles, ...parallaxStyles, ...typewriterStyles]
    .filter(Boolean)
    .join('\n')
}
