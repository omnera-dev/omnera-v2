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
 * Build script element
 * Handles boolean attributes (async, defer) - converts string 'true'/'false' to boolean
 */
export function buildScriptElement(element: CustomElements[number], key: string): ReactElement {
  // Process attributes to handle boolean HTML attributes correctly
  const processedAttrs = element.attrs ? { ...element.attrs } : {}

  // Convert boolean attribute strings to actual booleans
  // HTML boolean attributes: async, defer, noModule, etc.
  const booleanAttrs = ['async', 'defer', 'noModule'] as const
  for (const attr of booleanAttrs) {
    if (attr in processedAttrs) {
      const value = processedAttrs[attr]
      if (value === 'true') {
        processedAttrs[attr] = true as any
      } else if (value === 'false' || value === '') {
        delete processedAttrs[attr]
      }
    }
  }

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
