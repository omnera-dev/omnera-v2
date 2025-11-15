/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

/**
 * Resolve a single design token reference (e.g., '$colors.primary' → '#007bff')
 * Supports nested token paths like $colors.primary, $easing.smooth
 */
function resolveToken(tokenRef: string, theme?: Theme): string {
  if (!tokenRef.startsWith('$')) return tokenRef

  const path = tokenRef.slice(1).split('.')
  const [category, key] = path

  if (!theme || !category || !key) return tokenRef

  // Type-safe token resolution
  if (category === 'colors' && theme.colors) {
    return theme.colors[key] ?? tokenRef
  }

  // Access nested animation tokens
  if (category === 'easing' && theme.animations) {
    const animations = theme.animations as Record<string, unknown>
    const easing = animations.easing as Record<string, string> | undefined
    return easing?.[key] ?? tokenRef
  }

  if (category === 'duration' && theme.animations) {
    const animations = theme.animations as Record<string, unknown>
    const duration = animations.duration as Record<string, string> | undefined
    return duration?.[key] ?? tokenRef
  }

  return tokenRef
}

/**
 * Resolve all token references in a CSS value string
 * Example: '0 0 0 10px $colors.success' → '0 0 0 10px #28a745'
 */
export function resolveCSSValue(value: string, theme?: Theme): string {
  return value.replace(/\$[a-zA-Z][a-zA-Z0-9.]*(?:\.[a-zA-Z][a-zA-Z0-9]*)?/g, (match) =>
    resolveToken(match, theme)
  )
}

/**
 * Resolve token references in a keyframe properties object
 * Returns new object with resolved values (immutable)
 */
export function resolveKeyframeProps(
  props: Record<string, unknown>,
  theme?: Theme
): Record<string, unknown> {
  return Object.entries(props).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (typeof value === 'string') {
      return { ...acc, [key]: resolveCSSValue(value, theme) }
    }
    return { ...acc, [key]: value }
  }, {})
}

/**
 * Resolve tokens in animation string
 * Example: 'colorPulse 2s $easing.smooth infinite' → 'colorPulse 2s cubic-bezier(...) infinite'
 */
export function resolveAnimationString(animation: string, theme?: Theme): string {
  return resolveCSSValue(animation, theme)
}
