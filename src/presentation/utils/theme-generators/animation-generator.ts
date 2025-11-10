/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { toKebabCase } from '@/presentation/utils/string-utils'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Default keyframes for common animations
 */
const DEFAULT_KEYFRAMES: Record<string, (name: string) => string> = {
  'fade-in': (name) => `
    @keyframes ${name} {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  'slide-in': (name) => `
    @keyframes ${name} {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  pulse: (name) => `
    @keyframes ${name} {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
}

/**
 * Generate custom keyframes from config
 */
function generateCustomKeyframes(kebabName: string, keyframes: Record<string, unknown>): string {
  const frames = Object.entries(keyframes)
    .map(([percent, styles]) => {
      const cssProps = Object.entries(styles as Record<string, unknown>)
        .map(([prop, value]) => `${toKebabCase(prop)}: ${value};`)
        .join(' ')
      return `${percent} { ${cssProps} }`
    })
    .join('\n          ')

  return `
    @keyframes ${kebabName} {
      ${frames}
    }
  `
}

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
    if (typeof config === 'object' && 'enabled' in config && config.enabled === false) {
      return []
    }

    const kebabName = toKebabCase(name)
    const defaultGenerator = DEFAULT_KEYFRAMES[kebabName]

    if (defaultGenerator) {
      return [defaultGenerator(kebabName)]
    }

    if (typeof config === 'object' && config.keyframes) {
      return [generateCustomKeyframes(kebabName, config.keyframes as Record<string, unknown>)]
    }

    return []
  })
}

/**
 * Build transition styles
 */
function buildTransitionStyles(transitionConfig: unknown): readonly string[] {
  if (!transitionConfig || typeof transitionConfig !== 'object') {
    return []
  }
  const config = transitionConfig as { duration?: string; easing?: string }
  return [
    [
      'button {',
      `  transition: all ${config.duration || '200ms'} ${config.easing || 'ease-in-out'};`,
      '}',
    ].join('\n'),
  ]
}

/**
 * Build parallax styles
 */
function buildParallaxStyles(parallaxConfig: unknown): readonly string[] {
  if (!parallaxConfig) {
    return []
  }
  return [
    [
      '[data-testid="hero-background"] {',
      '  display: block;',
      '  min-height: 200px;',
      '  min-width: 100%;',
      '}',
    ].join('\n'),
  ]
}

/**
 * Build typewriter styles
 */
function buildTypewriterStyles(typewriterConfig: unknown): readonly string[] {
  if (!typewriterConfig || typeof typewriterConfig !== 'object') {
    return []
  }
  const config = typewriterConfig as { duration?: string; easing?: string }
  return [
    [
      '[data-testid="hero-heading"] {',
      `  animation: typewriter ${config.duration || '4s'} ${config.easing || 'steps(40, end)'};`,
      '  overflow: hidden;',
      '  white-space: nowrap;',
      '  border-right: 2px solid;',
      '}',
    ].join('\n'),
  ]
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

  const animationKeyframes = generateAnimationKeyframes(animations)
  const transitionStyles = buildTransitionStyles(animations.transition)
  const parallaxStyles = buildParallaxStyles(animations.parallax)
  const typewriterStyles = buildTypewriterStyles(animations.typewriter)

  return [...animationKeyframes, ...transitionStyles, ...parallaxStyles, ...typewriterStyles]
    .filter(Boolean)
    .join('\n')
}
