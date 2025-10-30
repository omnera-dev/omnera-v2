/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import * as Context from 'effect/Context'
import * as Data from 'effect/Data'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Schedule from 'effect/Schedule'
import { glob as globSync } from 'glob'
import { format as prettierFormat } from 'prettier'
import type { Options as PrettierOptions } from 'prettier'

/**
 * File System Error Types
 */
export class FileNotFoundError extends Data.TaggedError('FileNotFoundError')<{
  readonly path: string
  readonly cause?: unknown
}> {}

export class FileReadError extends Data.TaggedError('FileReadError')<{
  readonly path: string
  readonly cause?: unknown
}> {}

export class FileWriteError extends Data.TaggedError('FileWriteError')<{
  readonly path: string
  readonly cause?: unknown
}> {}

export class DirectoryCreateError extends Data.TaggedError('DirectoryCreateError')<{
  readonly path: string
  readonly cause?: unknown
}> {}

export class GlobError extends Data.TaggedError('GlobError')<{
  readonly pattern: string
  readonly cause?: unknown
}> {}

export class FormattingError extends Data.TaggedError('FormattingError')<{
  readonly content: string
  readonly cause?: unknown
}> {}

/**
 * File System Service Interface
 */
export interface FileSystemService {
  /**
   * Read file contents as UTF-8 string
   * @param path - Absolute or relative file path
   * @returns Effect that resolves to file contents
   */
  readonly readFile: (path: string) => Effect.Effect<string, FileNotFoundError | FileReadError>

  /**
   * Write content to file (creates parent directories if needed)
   * @param path - Absolute or relative file path
   * @param content - Content to write
   * @returns Effect that completes when write is successful
   */
  readonly writeFile: (
    path: string,
    content: string
  ) => Effect.Effect<void, FileWriteError | DirectoryCreateError>

  /**
   * Check if file or directory exists
   * @param path - Path to check
   * @returns Effect that resolves to true if exists, false otherwise
   */
  readonly exists: (path: string) => Effect.Effect<boolean>

  /**
   * Create directory recursively
   * @param path - Directory path
   * @returns Effect that completes when directory is created
   */
  readonly mkdir: (path: string) => Effect.Effect<void, DirectoryCreateError>

  /**
   * Find files matching glob pattern
   * @param pattern - Glob pattern (e.g., "src/**\/*.ts")
   * @returns Effect that resolves to array of file paths
   */
  readonly glob: (pattern: string) => Effect.Effect<readonly string[], GlobError>

  /**
   * Format content with Prettier
   * @param content - Content to format
   * @param options - Prettier options (defaults to project config)
   * @returns Effect that resolves to formatted content
   */
  readonly format: (
    content: string,
    options?: PrettierOptions
  ) => Effect.Effect<string, FormattingError>

  /**
   * Write file and format with Prettier
   * @param path - File path
   * @param content - Content to write
   * @param options - Prettier options
   * @returns Effect that completes when write + format is successful
   */
  readonly writeFormatted: (
    path: string,
    content: string,
    options?: PrettierOptions
  ) => Effect.Effect<void, FileWriteError | DirectoryCreateError | FormattingError>
}

/**
 * File System Service Tag (for dependency injection)
 */
export const FileSystemService = Context.GenericTag<FileSystemService>('FileSystemService')

/**
 * Default retry schedule: 3 attempts with exponential backoff
 */
const defaultRetrySchedule = Schedule.exponential('100 millis').pipe(
  Schedule.compose(Schedule.recurs(2))
)

/**
 * Live File System Service Implementation
 */
export const FileSystemServiceLive = Layer.succeed(
  FileSystemService,
  FileSystemService.of({
    readFile: (path: string) =>
      Effect.tryPromise({
        try: () => readFile(path, 'utf-8'),
        catch: (error) => {
          if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            return new FileNotFoundError({ path, cause: error })
          }
          return new FileReadError({ path, cause: error })
        },
      }).pipe(Effect.retry(defaultRetrySchedule)),

    writeFile: (path: string, content: string) =>
      Effect.gen(function* () {
        // Extract directory path and create if needed
        const dir = path.split('/').slice(0, -1).join('/')
        if (dir) {
          yield* Effect.tryPromise({
            try: () => mkdir(dir, { recursive: true }),
            catch: (error) => new DirectoryCreateError({ path: dir, cause: error }),
          })
        }

        // Write file
        yield* Effect.tryPromise({
          try: () => writeFile(path, content, 'utf-8'),
          catch: (error) => new FileWriteError({ path, cause: error }),
        })
      }).pipe(Effect.retry(defaultRetrySchedule)),

    exists: (path: string) =>
      Effect.tryPromise({
        try: async () => {
          try {
            await access(path)
            return true
          } catch {
            return false
          }
        },
        catch: () => false as never, // Never fails, returns false on error
      }),

    mkdir: (path: string) =>
      Effect.tryPromise({
        try: () => mkdir(path, { recursive: true }),
        catch: (error) => new DirectoryCreateError({ path, cause: error }),
      }).pipe(Effect.retry(defaultRetrySchedule), Effect.asVoid),

    glob: (pattern: string) =>
      Effect.tryPromise({
        try: () => globSync(pattern, { ignore: 'node_modules/**' }),
        catch: (error) => new GlobError({ pattern, cause: error }),
      }).pipe(Effect.retry(defaultRetrySchedule)),

    format: (content: string, options?: PrettierOptions) =>
      Effect.tryPromise({
        try: async () => {
          // Default to TypeScript parser if no options provided
          const defaultOptions: PrettierOptions = {
            parser: 'typescript',
            ...options,
          }
          return await prettierFormat(content, defaultOptions)
        },
        catch: (error) => new FormattingError({ content: content.slice(0, 100), cause: error }),
      }),

    writeFormatted: (path: string, content: string, options?: PrettierOptions) =>
      Effect.gen(function* () {
        const formatted = yield* Effect.tryPromise({
          try: async () => {
            const defaultOptions: PrettierOptions = {
              parser: 'typescript',
              filepath: path, // Auto-detect parser from file extension
              ...options,
            }
            return await prettierFormat(content, defaultOptions)
          },
          catch: (error) => new FormattingError({ content: content.slice(0, 100), cause: error }),
        })

        // Extract directory path and create if needed
        const dir = path.split('/').slice(0, -1).join('/')
        if (dir) {
          yield* Effect.tryPromise({
            try: () => mkdir(dir, { recursive: true }),
            catch: (error) => new DirectoryCreateError({ path: dir, cause: error }),
          })
        }

        // Write formatted file
        yield* Effect.tryPromise({
          try: () => writeFile(path, formatted, 'utf-8'),
          catch: (error) => new FileWriteError({ path, cause: error }),
        })
      }).pipe(Effect.retry(defaultRetrySchedule)),
  })
)

/**
 * Helper functions for common operations
 */

/**
 * Read file with FileSystemService
 */
export const readFile_ = (path: string) =>
  FileSystemService.pipe(Effect.flatMap((service) => service.readFile(path)))

/**
 * Write file with FileSystemService
 */
export const writeFile_ = (path: string, content: string) =>
  FileSystemService.pipe(Effect.flatMap((service) => service.writeFile(path, content)))

/**
 * Check if path exists with FileSystemService
 */
export const exists = (path: string) =>
  FileSystemService.pipe(Effect.flatMap((service) => service.exists(path)))

/**
 * Create directory with FileSystemService
 */
export const mkdir_ = (path: string) =>
  FileSystemService.pipe(Effect.flatMap((service) => service.mkdir(path)))

/**
 * Glob files with FileSystemService
 */
export const glob = (pattern: string) =>
  FileSystemService.pipe(Effect.flatMap((service) => service.glob(pattern)))

/**
 * Format content with FileSystemService
 */
export const format = (content: string, options?: PrettierOptions) =>
  FileSystemService.pipe(Effect.flatMap((service) => service.format(content, options)))

/**
 * Write formatted file with FileSystemService
 */
export const writeFormatted = (path: string, content: string, options?: PrettierOptions) =>
  FileSystemService.pipe(
    Effect.flatMap((service) => service.writeFormatted(path, content, options))
  )
