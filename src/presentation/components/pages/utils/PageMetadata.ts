/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Languages } from '@/domain/models/app/languages'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Metadata derived from page configuration
 */
export type PageMetadata = {
  readonly lang: string
  readonly direction: 'ltr' | 'rtl'
  readonly title: string
  readonly description: string
  readonly bodyStyle:
    | {
        readonly fontFamily?: string
        readonly fontSize?: string
        readonly lineHeight?: string
        readonly fontStyle?: 'normal' | 'italic' | 'oblique'
        readonly letterSpacing?: string
        readonly textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
      }
    | undefined
}

/**
 * Build body style object from theme fonts configuration
 */
function buildBodyStyle(theme: Theme | undefined): PageMetadata['bodyStyle'] {
  if (!theme?.fonts?.body) {
    return undefined
  }

  const { body } = theme.fonts

  return {
    ...(body.family && {
      fontFamily: body.fallback ? `${body.family}, ${body.fallback}` : body.family,
    }),
    ...(body.size && { fontSize: body.size }),
    ...(body.lineHeight && { lineHeight: body.lineHeight }),
    ...(body.style && {
      fontStyle: body.style as 'normal' | 'italic' | 'oblique',
    }),
    ...(body.letterSpacing && { letterSpacing: body.letterSpacing }),
    ...(body.transform && {
      textTransform: body.transform as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
    }),
  }
}

/**
 * Extracts and computes metadata from page configuration
 *
 * Determines language (page.meta.lang > detectedLanguage > default),
 * text direction from language config, title/description, and body styles from theme.
 *
 * @param page - Page configuration
 * @param theme - Optional theme configuration
 * @param languages - Optional languages configuration
 * @param detectedLanguage - Optional detected language from browser or URL
 * @returns Computed page metadata
 */
export function extractPageMetadata(
  page: Page,
  theme: Theme | undefined,
  languages: Languages | undefined,
  detectedLanguage: string | undefined
): Readonly<PageMetadata> {
  // Determine the language to use (priority: page.meta.lang > detectedLanguage > default)
  const lang = page.meta?.lang || detectedLanguage || languages?.default || 'en-US'

  // Determine text direction from language configuration
  const langConfig = languages?.supported.find((l) => l.code === lang)
  const direction = langConfig?.direction || 'ltr'

  const title = page.meta?.title || page.name || page.path
  const description = page.meta?.description || ''
  const bodyStyle = buildBodyStyle(theme)

  return {
    lang,
    direction,
    title,
    description,
    bodyStyle,
  }
}
