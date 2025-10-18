import { drizzle } from 'drizzle-orm/bun-sql'
import * as schema from './schema'

// You can specify any property from the bun sql connection options
export const db = drizzle({
  connection: { url: process.env.DATABASE_URL! },
  schema,
})

export type DrizzleDB = typeof db
