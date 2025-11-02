/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { Schema } from 'effect'

/**
 * Page ID (unique identifier for the page)
 *
 * Unlike database entity IDs (integers), page IDs are string-based identifiers
 * that can be:
 * - Descriptive slugs: 'home-page-123', 'about-us'
 * - UUIDs: '550e8400-e29b-41d4-a716-446655440000'
 * - Numeric strings: '12345'
 *
 * Page IDs are optional - if omitted, the system can auto-generate them.
 * They must be unique within the pages array.
 *
 * @example "homepage"
 * @example "home-page-123"
 * @example "550e8400-e29b-41d4-a716-446655440000"
 *
 * @see specs/app/pages/id/id.schema.json
 */
export const PageIdSchema = Schema.String.pipe(
  Schema.minLength(1),
  Schema.annotations({
    identifier: 'PageId',
    title: 'Page ID',
    description: 'Unique identifier for the page',
  })
)

export type PageId = typeof PageIdSchema.Type
