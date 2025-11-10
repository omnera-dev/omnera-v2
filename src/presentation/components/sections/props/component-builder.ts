/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { applySpacingStyles } from '../styling/spacing-resolver'
import { buildFinalClassName, processComponentStyle } from '../styling/style-processor'
import { substitutePropsThemeTokens } from '../styling/theme-tokens'
import {
  findFirstTranslationKey,
  getTranslationData,
  substitutePropsTranslationTokens,
} from '../translations/translation-handler'
import { buildElementProps } from './props-builder'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'
import type { ReactElement } from 'react'

/**
 * Configuration for building component props
 */
export type ComponentPropsConfig = {
  readonly type: string
  readonly props: Record<string, unknown> | undefined
  readonly children: ReadonlyArray<Component | string> | undefined
  readonly content: string | undefined
  readonly blockName: string | undefined
  readonly blockInstanceIndex: number | undefined
  readonly theme: Theme | undefined
  readonly languages: Languages | undefined
  readonly currentLang: string | undefined
  readonly childIndex: number | undefined
}

/**
 * Result of component props building
 */
export type ComponentPropsResult = {
  readonly elementProps: Record<string, unknown>
  readonly elementPropsWithSpacing: Record<string, unknown>
  readonly renderedChildren: ReadonlyArray<ReactElement | string | null>
}

/**
 * Props configuration for component rendering
 */
export type RenderPropsConfig = {
  readonly blocks?: unknown
  readonly theme?: Theme
  readonly languages?: Languages
  readonly currentLang?: string
  readonly blockInstanceIndex?: number
}

/**
 * Builds complete component props with all transformations applied
 *
 * This function orchestrates:
 * 1. Translation token substitution in props ($t:key)
 * 2. Theme token substitution in props ($theme.category.key)
 * 3. Translation key extraction
 * 4. Style processing (animations, shadows)
 * 5. ClassName finalization
 * 6. Element props building
 * 7. Spacing styles application
 *
 * @param config - Component props configuration
 * @returns Complete element props with spacing
 */
export function buildComponentProps(config: ComponentPropsConfig): {
  readonly substitutedProps: Record<string, unknown> | undefined
  readonly firstTranslationKey: string | undefined
  readonly translationData: Record<string, string> | undefined
  readonly styleWithShadow: Record<string, unknown> | undefined
  readonly finalClassName: string | undefined
  readonly elementProps: Record<string, unknown>
  readonly elementPropsWithSpacing: Record<string, unknown>
} {
  const {
    type,
    props,
    children,
    content,
    blockName,
    blockInstanceIndex,
    theme,
    languages,
    currentLang,
    childIndex,
  } = config

  // Translation token substitution (must happen before theme tokens)
  const translationSubstitutedProps = substitutePropsTranslationTokens(props, currentLang, languages)

  // Theme token substitution
  const substitutedProps = substitutePropsThemeTokens(translationSubstitutedProps, theme)

  // Translation handling
  const firstTranslationKey = findFirstTranslationKey(children)
  const translationData = getTranslationData(firstTranslationKey, config.languages)

  // Style processing with animations and shadows
  const styleWithShadow = processComponentStyle(type, substitutedProps?.style, theme)

  // Build final className based on component type
  const finalClassName = buildFinalClassName(
    type,
    substitutedProps?.className,
    theme,
    substitutedProps
  )

  // Build element props with all attributes
  const elementProps = buildElementProps({
    type,
    substitutedProps,
    finalClassName,
    styleWithShadow,
    blockName,
    blockInstanceIndex,
    firstTranslationKey,
    translationData,
    hasContent: Boolean(content || children?.length),
    hasChildren: Boolean(children?.length),
    theme,
    childIndex,
  })

  return {
    substitutedProps,
    firstTranslationKey,
    translationData,
    styleWithShadow,
    finalClassName,
    elementProps,
    elementPropsWithSpacing: applySpacingStyles(type, elementProps, theme),
  }
}
