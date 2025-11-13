/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { extractBlockReference, renderBlockReferenceError } from './blocks/block-reference-handler'
import { resolveBlock } from './blocks/block-resolution'
import { buildComponentProps } from './props/component-builder'
import { dispatchComponentType } from './rendering/component-type-dispatcher'
import { resolveChildTranslation } from './translations/translation-handler'
import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Component renderer props
 */
type ComponentRendererProps = {
  readonly component: Component | SimpleBlockReference | BlockReference
  readonly blockName?: string
  readonly blockInstanceIndex?: number
  readonly blocks?: Blocks
  readonly theme?: Theme
  readonly languages?: Languages
  readonly currentLang?: string
  readonly childIndex?: number
}

/**
 * Handles block reference resolution and rendering
 *
 * @param component - Block reference component
 * @param props - Component renderer props
 * @returns Rendered block reference or error
 */
function renderBlockReference(
  component: SimpleBlockReference | BlockReference,
  props: ComponentRendererProps
): ReactElement | null {
  const { refName, vars } = extractBlockReference(component)
  const resolved = resolveBlock(refName, props.blocks, vars)

  if (!resolved) {
    return renderBlockReferenceError({ refName, blocks: props.blocks })
  }

  return (
    <ComponentRenderer
      component={resolved.component}
      blockName={resolved.name}
      blockInstanceIndex={props.blockInstanceIndex}
      blocks={props.blocks}
      theme={props.theme}
      languages={props.languages}
      currentLang={props.currentLang}
    />
  )
}

/**
 * Renders direct component (non-block-reference)
 *
 * @param component - Direct component
 * @param props - Component renderer props
 * @returns Rendered component
 */
function renderDirectComponent(
  component: Component,
  props: ComponentRendererProps
): ReactElement | null {
  const { type, props: componentProps, children, content, interactions } = component

  // Build component props (theme tokens, styles, className, etc.)
  const { elementProps, elementPropsWithSpacing } = buildComponentProps({
    type,
    props: componentProps,
    children,
    content,
    blockName: props.blockName,
    blockInstanceIndex: props.blockInstanceIndex,
    theme: props.theme,
    languages: props.languages,
    currentLang: props.currentLang,
    childIndex: props.childIndex,
    interactions,
  })

  // Render children recursively
  const renderedChildren = children?.map((child: Component | string, index: number) =>
    typeof child === 'string' ? (
      resolveChildTranslation(child, props.currentLang, props.languages)
    ) : (
      <ComponentRenderer
        key={index}
        component={child}
        blocks={props.blocks}
        theme={props.theme}
        languages={props.languages}
        currentLang={props.currentLang}
        childIndex={index}
      />
    )
  )

  // Resolve content translation if content is a string with $t: pattern
  const resolvedContent = content
    ? resolveChildTranslation(content, props.currentLang, props.languages)
    : content

  // Dispatch rendering based on component type
  return dispatchComponentType({
    type,
    elementProps,
    elementPropsWithSpacing,
    content: resolvedContent,
    renderedChildren,
    theme: props.theme,
    languages: props.languages,
    interactions,
  })
}

/**
 * ComponentRenderer - Renders a dynamic component based on its type
 *
 * This component handles the recursive rendering of sections, converting
 * the declarative component configuration into React elements.
 * Supports block references for reusable components and theme token substitution.
 *
 * @param props - Component props
 * @param props.component - Component configuration from sections schema (can be a direct component or block reference)
 * @param props.blockName - Optional block name for data-block attribute
 * @param props.blockInstanceIndex - Optional instance index for blocks used multiple times (for unique data-testid)
 * @param props.blocks - Optional blocks array for resolving block references
 * @param props.theme - Optional theme configuration for token substitution
 * @param props.languages - Optional languages configuration for language-switcher blocks
 * @param props.currentLang - Current page language (defaults to languages.default)
 * @returns React element matching the component type
 */
export function ComponentRenderer(props: ComponentRendererProps): Readonly<ReactElement | null> {
  const { component } = props

  // Handle block references - supports both { block: 'name' } and { $ref: 'name' } syntaxes
  if ('block' in component || '$ref' in component) {
    return renderBlockReference(component, props)
  }

  // Direct component rendering
  return renderDirectComponent(component as Component, props)
}
