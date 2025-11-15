/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import type { CustomElements } from '@/domain/models/app/page/meta/custom-elements'

/**
 * Build meta element
 */
export function buildMetaElement(element: CustomElements[number], key: string): ReactElement {
  return (
    <meta
      key={key}
      {...element.attrs}
    />
  )
}

/**
 * Build link element
 */
export function buildLinkElement(element: CustomElements[number], key: string): ReactElement {
  return (
    <link
      key={key}
      {...element.attrs}
    />
  )
}

/**
 * Process boolean HTML attributes for script elements
 * Converts string 'true'/'false' to boolean/undefined
 */
function processBooleanAttributes(
  attrs: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!attrs) return {}

  const booleanAttrs = ['async', 'defer', 'noModule'] as const

  // First, copy all non-boolean attributes
  const result = Object.entries(attrs).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (!booleanAttrs.includes(key as (typeof booleanAttrs)[number])) {
      return { ...acc, [key]: value }
    }
    return acc
  }, {})

  // Then process boolean attributes
  return booleanAttrs.reduce<Record<string, unknown>>((acc, attr) => {
    if (!(attr in attrs)) return acc

    const value = attrs[attr]
    if (value === 'true') {
      return { ...acc, [attr]: true }
    }
    // Remove false/empty values (omit from result)
    return acc
  }, result)
}

/**
 * Build script element
 * Handles boolean attributes (async, defer) - converts string 'true'/'false' to boolean
 */
export function buildScriptElement(element: CustomElements[number], key: string): ReactElement {
  const processedAttrs = processBooleanAttributes(element.attrs)

  if (element.content) {
    return (
      <script
        key={key}
        {...processedAttrs}
        dangerouslySetInnerHTML={{ __html: element.content }}
      />
    )
  }
  return (
    <script
      key={key}
      {...processedAttrs}
    />
  )
}

/**
 * Build style element
 */
export function buildStyleElement(element: CustomElements[number], key: string): ReactElement {
  return (
    <style
      key={key}
      {...element.attrs}
      dangerouslySetInnerHTML={{ __html: element.content || '' }}
    />
  )
}

/**
 * Build base element
 */
export function buildBaseElement(element: CustomElements[number], key: string): ReactElement {
  return (
    <base
      key={key}
      {...element.attrs}
    />
  )
}

/**
 * Build custom element based on type
 */
export function buildCustomElement(
  element: CustomElements[number],
  index: number
): ReactElement | undefined {
  const key = `custom-${element.type}-${index}`

  switch (element.type) {
    case 'meta':
      return buildMetaElement(element, key)
    case 'link':
      return buildLinkElement(element, key)
    case 'script':
      return buildScriptElement(element, key)
    case 'style':
      return buildStyleElement(element, key)
    case 'base':
      return buildBaseElement(element, key)
    default:
      return undefined
  }
}
