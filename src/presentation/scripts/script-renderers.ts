/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import React, { type ReactElement } from 'react'

/**
 * Render a script tag with optional attributes
 * Unified helper for rendering external scripts (analytics, external scripts, etc.)
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
  const props: Record<string, unknown> = {
    key: reactKey,
    src,
    ...(asyncProp && { async: true }),
    ...(defer && { defer: true }),
    ...(module && { type: 'module' }),
    ...(integrity && { integrity }),
    ...(crossOrigin && { crossOrigin }),
    ...(dataTestId && { 'data-testid': dataTestId }),
    ...(hidden && { style: { display: 'none' } }),
  }

  return React.createElement('script', props)
}

/**
 * Render an inline script tag with JavaScript code
 * Wraps code in async IIFE if async property is true
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

  return React.createElement('script', {
    key: reactKey,
    dangerouslySetInnerHTML: { __html: scriptContent },
  })
}
