/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { drizzle } from 'drizzle-orm/bun-sql'
import * as schema from './schema'

// You can specify any property from the bun sql connection options
export const db = drizzle({
  connection: { url: process.env.DATABASE_URL! },
  schema,
})

export type DrizzleDB = typeof db
