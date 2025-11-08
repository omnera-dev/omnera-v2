/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import { getBlockInfo } from '@/presentation/utils/block-utils'
import { isCssValue, isTailwindClass } from '@/presentation/utils/style-utils'
import type {
  BlockReference,
  SimpleBlockReference,
} from '@/domain/models/app/block/common/block-reference'
import type { Blocks } from '@/domain/models/app/blocks'
import type { Languages } from '@/domain/models/app/languages'
import type { Component } from '@/domain/models/app/page/sections'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Props for the SectionRenderer component
 */
export interface SectionRendererProps {
  readonly sections: ReadonlyArray<Component | SimpleBlockReference | BlockReference>
  readonly theme?: Theme
  readonly blocks?: Blocks
  readonly languages?: Languages
  readonly currentLang: string
}

/**
 * Render sections with theme spacing
 * Handles section wrapping, container spacing, and block resolution
 *
 * @param props - Component props
 * @returns React element with sections
 */
export function SectionRenderer({
  sections,
  theme,
  blocks,
  languages,
  currentLang,
}: SectionRendererProps): Readonly<ReactElement> {
  // Helper to render sections with ComponentRenderer
  const renderSections = () =>
    sections.map((section, index) => {
      const blockInfo = getBlockInfo(section, index, sections)

      return (
        <ComponentRenderer
          key={index}
          component={section}
          blockName={blockInfo?.name}
          blockInstanceIndex={blockInfo?.instanceIndex}
          blocks={blocks}
          theme={theme}
          languages={languages}
          currentLang={currentLang}
        />
      )
    })

  // Helper to render container divs
  const renderContainer = (testId: string, value: string) => (
    <div
      data-testid={testId}
      {...(isTailwindClass(value) ? { className: value } : { style: { maxWidth: value } })}
    />
  )

  // No theme spacing - render sections directly
  if (!theme?.spacing?.section && !theme?.spacing?.container) {
    return <>{renderSections()}</>
  }

  // Theme spacing defined - apply wrappers and containers
  return (
    <>
      {/* Wrap in section if no section components exist and theme has section spacing */}
      {!sections.some((s) => 'type' in s && s.type === 'section') && theme?.spacing?.section ? (
        <section
          data-testid="section"
          {...(theme?.spacing?.section &&
            !isCssValue(theme.spacing.section) && { className: theme.spacing.section })}
          {...(theme?.spacing?.section &&
            isCssValue(theme.spacing.section) && {
              style: { padding: theme.spacing.section },
            })}
        >
          {renderSections()}
        </section>
      ) : (
        <>{renderSections()}</>
      )}

      {/* Container spacing elements */}
      {theme?.spacing?.container &&
        !sections.some((s) => 'type' in s && s.type === 'container') &&
        renderContainer('container', theme.spacing.container)}

      {(() => {
        const containerSmall = (theme?.spacing as Record<string, unknown>)?.['container-small']
        if (typeof containerSmall === 'string') {
          return renderContainer('container-small', containerSmall)
        }
        return undefined
      })()}

      {(() => {
        const containerXSmall = (theme?.spacing as Record<string, unknown>)?.['container-xsmall']
        if (typeof containerXSmall === 'string') {
          return renderContainer('container-xsmall', containerXSmall)
        }
        return undefined
      })()}
    </>
  )
}
