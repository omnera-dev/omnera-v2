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
 */
export function buildScriptElement(element: CustomElements[number], key: string): ReactElement {
  if (element.content) {
    return (
      <script
        key={key}
        {...element.attrs}
        dangerouslySetInnerHTML={{ __html: element.content }}
      />
    )
  }
  return (
    <script
      key={key}
      {...element.attrs}
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
