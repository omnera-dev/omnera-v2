/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { BreakpointsConfig } from '@/domain/models/app/theme/breakpoints'
import type { ReactElement } from 'react'

/**
 * BreakpointsRenderer component - Exposes theme breakpoints to JavaScript
 *
 * This component renders a script tag that makes theme breakpoints accessible
 * via window.APP_THEME_BREAKPOINTS for use with window.matchMedia() in the browser.
 *
 * This enables consistency between theme.breakpoints and responsive variants,
 * allowing components to use the same breakpoint values defined in the theme.
 *
 * @param props - Component props
 * @param props.breakpoints - Breakpoints configuration from theme
 * @returns Script element that exposes breakpoints to window object
 */
export function BreakpointsRenderer({
  breakpoints,
}: {
  readonly breakpoints: BreakpointsConfig
}): Readonly<ReactElement> {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.APP_THEME_BREAKPOINTS = ${JSON.stringify(breakpoints)};`,
      }}
    />
  )
}
