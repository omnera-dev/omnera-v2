/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { getFallbackRenderer, getRendererForType } from './component-renderer-registry'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Render component based on type using specialized renderers
 *
 * Uses a registry-based approach to map component types to renderers.
 * Falls back to a div wrapper for unknown types.
 *
 * @param params - Render parameters
 * @param params.component - Component configuration
 * @param params.elementPropsWithSpacing - Element props with spacing applied
 * @param params.content - Optional text content
 * @param params.renderedChildren - Optional pre-rendered children
 * @param params.theme - Optional theme configuration
 * @param params.languages - Optional languages configuration
 * @returns Rendered React element or null
 */
export function renderComponentByType({
  component,
  elementPropsWithSpacing,
  content,
  renderedChildren = [],
  theme,
  languages,
}: {
  readonly component: Component
  readonly elementPropsWithSpacing: Record<string, unknown>
  readonly content?: string
  readonly renderedChildren?: readonly ReactElement[]
  readonly theme?: Theme
  readonly languages?: Languages
}): Readonly<ReactElement | null> {
  const renderer = getRendererForType(component.type) ?? getFallbackRenderer()
  return renderer({ elementPropsWithSpacing, content, renderedChildren, theme, languages })
}
