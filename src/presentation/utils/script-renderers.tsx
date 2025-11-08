/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'

/**
 * Render a script tag with optional attributes
 * Unified helper for rendering external scripts (analytics, external scripts, etc.)
 *
 * @param props - Script configuration
 * @param props.src - Script source URL
 * @param props.async - Load asynchronously
 * @param props.defer - Defer execution
 * @param props.module - Load as ES module
 * @param props.integrity - Subresource integrity hash
 * @param props.crossOrigin - CORS setting ('anonymous' or 'use-credentials')
 * @param props.dataTestId - Test identifier
 * @param props.reactKey - React key for list rendering
 * @param props.hidden - Apply display: none style (for disabled analytics providers)
 * @returns Script element
 */
export function renderScriptTag({
  src,
  async: asyncProp,
  defer,
  module,
  integrity,
  crossOrigin,
  dataTestId,
  reactKey,
  hidden,
}: {
  readonly src: string
  readonly async?: boolean
  readonly defer?: boolean
  readonly module?: boolean
  readonly integrity?: string
  readonly crossOrigin?: 'anonymous' | 'use-credentials'
  readonly dataTestId?: string
  readonly reactKey: string | number
  readonly hidden?: boolean
}): Readonly<ReactElement> {
  return (
    <script
      key={reactKey}
      src={src}
      {...(asyncProp && { async: true })}
      {...(defer && { defer: true })}
      {...(module && { type: 'module' })}
      {...(integrity && { integrity })}
      {...(crossOrigin && { crossOrigin })}
      {...(dataTestId && { 'data-testid': dataTestId })}
      {...(hidden && { style: { display: 'none' } })}
    />
  )
}

/**
 * Render an inline script tag with JavaScript code
 * Wraps code in async IIFE if async property is true
 *
 * @param props - Inline script configuration
 * @param props.code - JavaScript code to execute
 * @param props.async - Wrap in async IIFE
 * @param props.reactKey - React key for list rendering
 * @returns Script element with inline code
 */
export function renderInlineScriptTag({
  code,
  async: asyncProp,
  reactKey,
}: {
  readonly code: string
  readonly async?: boolean
  readonly reactKey: string | number
}): Readonly<ReactElement> {
  const scriptContent = asyncProp ? `(async () => { ${code} })();` : code

  return (
    <script
      key={reactKey}
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  )
}
