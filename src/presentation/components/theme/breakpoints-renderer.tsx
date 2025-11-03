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
 * This component renders:
 * 1. A hidden div with data-testid="breakpoints" for E2E testing
 * 2. A script tag that makes theme breakpoints accessible via window.APP_THEME_BREAKPOINTS
 *
 * This enables consistency between theme.breakpoints and responsive variants,
 * allowing components to use the same breakpoint values defined in the theme.
 *
 * @param props - Component props
 * @param props.breakpoints - Breakpoints configuration from theme
 * @returns React fragment with test element and script
 */
export function BreakpointsRenderer({
  breakpoints,
}: {
  readonly breakpoints: BreakpointsConfig
}): Readonly<ReactElement> {
  return (
    <>
      <div
        data-testid="breakpoints"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
        }}
      >
        {Object.entries(breakpoints).map(([name, value]) => (
          <div
            key={name}
            data-testid={`breakpoint-${name}`}
            data-breakpoint-name={name}
            data-breakpoint-value={value}
            style={{ width: '1px', height: '1px' }}
          />
        ))}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.APP_THEME_BREAKPOINTS = ${JSON.stringify(breakpoints)};`,
        }}
      />
    </>
  )
}
