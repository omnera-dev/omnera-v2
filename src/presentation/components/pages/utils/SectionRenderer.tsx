/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { renderSectionWithSpacing } from '@/presentation/components/pages/utils/SectionSpacing'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import { getBlockInfo } from '@/presentation/utils/block-utils'
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
  const renderedSections = sections.map((section, index) => {
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

  return renderSectionWithSpacing(theme, sections, renderedSections)
}
