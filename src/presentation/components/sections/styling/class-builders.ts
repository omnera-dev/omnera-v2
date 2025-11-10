/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Theme } from '@/domain/models/app/theme'

/**
 * Build flex-specific classes based on props
 */
export function buildFlexClasses(props?: Record<string, unknown>): string {
  const baseClasses = ['flex']
  const alignmentClass =
    props?.align === 'start'
      ? 'items-start'
      : props?.align === 'center'
        ? 'items-center'
        : props?.align === 'end'
          ? 'items-end'
          : undefined
  const gapClass = typeof props?.gap === 'number' ? `gap-${props.gap}` : undefined

  return [...baseClasses, alignmentClass, gapClass].filter(Boolean).join(' ')
}

/**
 * Build grid-specific classes based on theme breakpoints
 */
export function buildGridClasses(theme?: Theme): string | undefined {
  const baseClasses = ['grid']
  const breakpointClass = theme?.breakpoints?.md ? 'md:grid-cols-2' : undefined

  return [...baseClasses, breakpointClass].filter(Boolean).join(' ')
}
