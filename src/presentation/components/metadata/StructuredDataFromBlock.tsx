/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'

/**
 * Block meta property type for structured data
 */
export type BlockMeta = {
  readonly title?: string
  readonly description?: string
  readonly image?: string
  readonly price?: string
  readonly currency?: string
  readonly structuredData?: {
    readonly type: string
    readonly fields: readonly string[]
  }
}

/**
 * Generates Schema.org structured data JSON-LD from block meta
 *
 * @param meta - Block meta configuration
 * @returns JSON-LD object following Schema.org format
 */
function generateStructuredData(meta: BlockMeta): Record<string, unknown> {
  const { structuredData, title, description, image, price, currency } = meta

  if (!structuredData) {
    return {}
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': structuredData.type,
  }

  // Map block meta fields to Schema.org properties
  if (structuredData.fields.includes('name') && title) {
    jsonLd.name = title
  }

  if (structuredData.fields.includes('description') && description) {
    jsonLd.description = description
  }

  if (structuredData.fields.includes('image') && image) {
    jsonLd.image = image
  }

  if (structuredData.fields.includes('offers') && price && currency) {
    jsonLd.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
    }
  }

  return jsonLd
}

/**
 * Renders structured data script from block meta
 *
 * @param props - Component props
 * @param props.meta - Block meta configuration
 * @returns Script element with JSON-LD structured data, or null if no structured data
 */
export function StructuredDataFromBlock({
  meta,
}: {
  readonly meta: BlockMeta | undefined
}): Readonly<ReactElement | null> {
  if (!meta?.structuredData) {
    return null
  }

  const jsonLd = generateStructuredData(meta)

  if (Object.keys(jsonLd).length === 0) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd, null, 2),
      }}
    />
  )
}
