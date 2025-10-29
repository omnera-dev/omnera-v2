/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { NameSchema as CommonNameSchema } from '../common/definitions'

/**
 * Page Name (internal name for the page)
 *
 * Re-exports the common Name schema from definitions.
 * See NameSchema in common/definitions for full documentation.
 *
 * @see specs/app/pages/name/name.schema.json
 * @see specs/app/common/definitions.schema.json#/definitions/name
 */
export const PageNameSchema = CommonNameSchema

export type PageName = typeof PageNameSchema.Type
