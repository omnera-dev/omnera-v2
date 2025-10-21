/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from '@/infrastructure/auth/better-auth/schema'

/**
 * Database Template Manager for Fast Test Isolation
 *
 * Strategy:
 * 1. Create a template database once with all migrations applied
 * 2. For each test, duplicate the template into a new database (fast operation)
 * 3. Tests run against isolated databases in parallel
 * 4. Cleanup drops test databases after completion
 *
 * Benefits:
 * - Fast: Database duplication is ~10-100x faster than running migrations
 * - Isolated: Each test gets a pristine database copy
 * - Parallel: Tests can run concurrently without interference
 */

export class DatabaseTemplateManager {
  private templateDbName = 'omnera_test_template'
  private adminConnectionUrl: string

  constructor(private containerConnectionUrl: string) {
    // Extract admin connection (connect to 'postgres' database for admin operations)
    const url = new URL(containerConnectionUrl)
    url.pathname = '/postgres'
    this.adminConnectionUrl = url.toString()
  }

  /**
   * Create template database and run all migrations
   * Called once during global setup
   */
  async createTemplate(): Promise<void> {
    // Drop template if exists (for clean slate)
    await this.dropDatabase(this.templateDbName)

    // Create fresh template database with retry logic
    const adminPool = new Pool({
      connectionString: this.adminConnectionUrl,
      max: 1, // Use single connection for admin operations
      connectionTimeoutMillis: 5000,
    })
    try {
      // Wait a bit for container to be fully ready
      await this.waitForDatabase(adminPool)
      await adminPool.query(`CREATE DATABASE "${this.templateDbName}"`)
    } finally {
      await adminPool.end()
    }

    // Run migrations on template
    const templateUrl = this.getTemplateUrl()
    const templatePool = new Pool({ connectionString: templateUrl })
    const db = drizzle(templatePool, { schema })

    try {
      await migrate(db, { migrationsFolder: './drizzle' })
    } finally {
      await templatePool.end()
    }
  }

  /**
   * Wait for database to be ready
   */
  private async waitForDatabase(pool: Pool, maxAttempts = 10): Promise<void> {
    // eslint-disable-next-line functional/no-loop-statements
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await pool.query('SELECT 1')
        return
      } catch (error) {
        if (i === maxAttempts - 1) throw error
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }
  }

  /**
   * Duplicate template into a new test database
   * Called before each test that needs database access
   */
  async duplicateTemplate(testDbName: string): Promise<string> {
    const adminPool = new Pool({ connectionString: this.adminConnectionUrl })
    try {
      // Terminate connections to template (required for duplication)
      await adminPool.query(
        `
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1
          AND pid <> pg_backend_pid()
      `,
        [this.templateDbName]
      )

      // Small delay to ensure connections are fully terminated
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Create new database from template
      await adminPool.query(`CREATE DATABASE "${testDbName}" TEMPLATE "${this.templateDbName}"`)
    } finally {
      await adminPool.end()
    }

    return this.getTestDatabaseUrl(testDbName)
  }

  /**
   * Drop test database
   * Called after each test for cleanup
   */
  async dropTestDatabase(testDbName: string): Promise<void> {
    await this.dropDatabase(testDbName)
  }

  /**
   * Cleanup template database
   * Called during global teardown
   */
  async cleanup(): Promise<void> {
    await this.dropDatabase(this.templateDbName)
  }

  /**
   * Get template database URL
   */
  private getTemplateUrl(): string {
    return this.getTestDatabaseUrl(this.templateDbName)
  }

  /**
   * Get test database URL
   */
  private getTestDatabaseUrl(dbName: string): string {
    const url = new URL(this.containerConnectionUrl)
    url.pathname = `/${dbName}`
    return url.toString()
  }

  /**
   * Drop database if exists
   */
  private async dropDatabase(dbName: string): Promise<void> {
    // Use retry logic to handle transient connection issues
    const maxRetries = 3

    // eslint-disable-next-line functional/no-loop-statements
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const adminPool = new Pool({
        connectionString: this.adminConnectionUrl,
        max: 1,
        connectionTimeoutMillis: 5000,
      })

      try {
        // First, check if database exists
        const checkResult = await adminPool.query(
          `SELECT 1 FROM pg_database WHERE datname = $1`,
          [dbName]
        )

        // If database doesn't exist, we're done
        if (checkResult.rows.length === 0) {
          await adminPool.end()
          return
        }

        // Terminate all connections to the target database (force)
        await adminPool.query(
          `
          SELECT pg_terminate_backend(pid)
          FROM pg_stat_activity
          WHERE datname = $1
            AND pid <> pg_backend_pid()
        `,
          [dbName]
        )

        // Wait for connections to fully terminate
        await new Promise((resolve) => setTimeout(resolve, 200))

        // Use DROP DATABASE with FORCE (PostgreSQL 13+)
        // This will forcefully terminate remaining connections
        await adminPool.query(`DROP DATABASE "${dbName}" WITH (FORCE)`)

        // Success! Break retry loop
        await adminPool.end()
        return
      } catch (error) {
        await adminPool.end().catch(() => {
          /* ignore pool.end() errors */
        })

        // If this was the last attempt, log warning and continue
        if (attempt === maxRetries) {
          console.warn(`Warning dropping database ${dbName} after ${maxRetries} attempts:`, error)
          return
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, attempt * 200))
      }
    }
  }
}

/**
 * Generate unique test database name
 * Uses worker index and timestamp to ensure uniqueness across parallel tests
 */
export function generateTestDatabaseName(testInfo: { workerIndex: number }): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(7)
  return `omnera_test_${testInfo.workerIndex}_${timestamp}_${random}`
}
