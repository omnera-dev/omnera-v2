/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { IdSchema as CommonIdSchema } from '../common/definitions'

/**
 * Page ID (unique identifier for the page)
 *
 * Re-exports the common ID schema from definitions.
 * See IdSchema in common/definitions for full documentation.
 *
 * @see specs/app/pages/id/id.schema.json
 * @see specs/app/common/definitions.schema.json#/definitions/id
 */
export const PageIdSchema = CommonIdSchema

export type PageId = typeof PageIdSchema.Type
