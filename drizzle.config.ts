import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  // Schema files location (supports glob patterns)
  schema: './src/infrastructure/database/drizzle/schema.ts',

  // Migration output directory
  out: './drizzle',

  // Database dialect
  dialect: 'postgresql',

  // Database connection
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // Enable verbose logging (optional)
  verbose: true,

  // Enable strict mode (optional, recommended)
  strict: true,
})
