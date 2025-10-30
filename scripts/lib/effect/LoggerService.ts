/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import * as Context from 'effect/Context'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import * as Logger from 'effect/Logger'

/**
 * Log level type
 */
export type LogLevelType = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

/**
 * GitHub Actions annotation type
 */
export type AnnotationType = 'notice' | 'warning' | 'error'

/**
 * Logger configuration
 */
export interface LoggerConfig {
  readonly level: LogLevelType
  readonly enableGitHubActions: boolean
  readonly enableEmojis: boolean
  readonly enableTimestamps: boolean
}

/**
 * Default logger configuration
 */
export const defaultLoggerConfig: LoggerConfig = {
  level: 'info',
  enableGitHubActions: !!process.env.GITHUB_ACTIONS,
  enableEmojis: true,
  enableTimestamps: false,
}

/**
 * Logger Service Interface
 */
export interface LoggerService {
  /**
   * Log trace message (verbose debugging)
   */
  readonly trace: (message: string) => Effect.Effect<void>

  /**
   * Log debug message (detailed information)
   */
  readonly debug: (message: string) => Effect.Effect<void>

  /**
   * Log info message (general information)
   */
  readonly info: (message: string, emoji?: string) => Effect.Effect<void>

  /**
   * Log warning message
   */
  readonly warn: (message: string, emoji?: string) => Effect.Effect<void>

  /**
   * Log error message
   */
  readonly error: (message: string, emoji?: string) => Effect.Effect<void>

  /**
   * Log fatal error message (critical failure)
   */
  readonly fatal: (message: string) => Effect.Effect<void>

  /**
   * Log success message (✅)
   */
  readonly success: (message: string) => Effect.Effect<void>

  /**
   * Log progress message (🔄)
   */
  readonly progress: (message: string) => Effect.Effect<void>

  /**
   * Log completion message (✨)
   */
  readonly complete: (message: string) => Effect.Effect<void>

  /**
   * Log skip message (⏭️)
   */
  readonly skip: (message: string) => Effect.Effect<void>

  /**
   * Create GitHub Actions annotation
   * @param type - Annotation type (notice, warning, error)
   * @param message - Annotation message
   * @param file - Optional file path
   * @param line - Optional line number
   */
  readonly annotation: (
    type: AnnotationType,
    message: string,
    file?: string,
    line?: number
  ) => Effect.Effect<void>

  /**
   * Log a separator line
   */
  readonly separator: (char?: string, length?: number) => Effect.Effect<void>

  /**
   * Log a section header with separator
   */
  readonly section: (title: string) => Effect.Effect<void>

  /**
   * Create a logger group (for nested logging)
   */
  readonly group: <A, E, R>(title: string, effect: Effect.Effect<A, E, R>) => Effect.Effect<A, E, R>
}

/**
 * Logger Service Tag (for dependency injection)
 */
export const LoggerService = Context.GenericTag<LoggerService>('LoggerService')

/**
 * Emoji prefixes for log levels
 */
const EMOJI_PREFIXES: Record<LogLevelType, string> = {
  trace: '🔍',
  debug: '🐛',
  info: 'ℹ️',
  warn: '⚠️',
  error: '❌',
  fatal: '💥',
}

/**
 * Format message with emoji and timestamp
 */
const formatMessage = (
  message: string,
  emoji: string,
  config: LoggerConfig,
  forceEmoji = false
): string => {
  const parts: string[] = []

  // Add timestamp if enabled
  if (config.enableTimestamps) {
    const timestamp = new Date().toISOString()
    parts.push(`[${timestamp}]`)
  }

  // Add emoji if enabled or forced
  if (config.enableEmojis || forceEmoji) {
    parts.push(emoji)
  }

  // Add message
  parts.push(message)

  return parts.join(' ')
}

/**
 * Create GitHub Actions annotation command
 */
const createAnnotation = (
  type: AnnotationType,
  message: string,
  file?: string,
  line?: number
): string => {
  const props: string[] = []
  if (file) {
    props.push(`file=${file}`)
  }
  if (line !== undefined) {
    props.push(`line=${line}`)
  }
  const propsStr = props.length > 0 ? ` ${props.join(',')}` : ''
  return `::${type}${propsStr}::${message}`
}

/**
 * Live Logger Service Implementation
 */
export const LoggerServiceLive = (config: LoggerConfig = defaultLoggerConfig) =>
  Layer.succeed(
    LoggerService,
    LoggerService.of({
      trace: (message: string) =>
        Effect.log(formatMessage(message, EMOJI_PREFIXES.trace, config)).pipe(
          Effect.annotateLogs('level', 'trace')
        ),

      debug: (message: string) =>
        Effect.log(formatMessage(message, EMOJI_PREFIXES.debug, config)).pipe(
          Effect.annotateLogs('level', 'debug')
        ),

      info: (message: string, emoji?: string) =>
        Effect.log(formatMessage(message, emoji || EMOJI_PREFIXES.info, config, !!emoji)).pipe(
          Effect.annotateLogs('level', 'info')
        ),

      warn: (message: string, emoji?: string) =>
        Effect.logWarning(
          formatMessage(message, emoji || EMOJI_PREFIXES.warn, config, !!emoji)
        ).pipe(Effect.annotateLogs('level', 'warn')),

      error: (message: string, emoji?: string) =>
        Effect.logError(
          formatMessage(message, emoji || EMOJI_PREFIXES.error, config, !!emoji)
        ).pipe(Effect.annotateLogs('level', 'error')),

      fatal: (message: string) =>
        Effect.logFatal(formatMessage(message, EMOJI_PREFIXES.fatal, config)).pipe(
          Effect.annotateLogs('level', 'fatal')
        ),

      success: (message: string) =>
        Effect.log(formatMessage(message, '✅', config, true)).pipe(
          Effect.annotateLogs('level', 'info')
        ),

      progress: (message: string) =>
        Effect.log(formatMessage(message, '🔄', config, true)).pipe(
          Effect.annotateLogs('level', 'info')
        ),

      complete: (message: string) =>
        Effect.log(formatMessage(message, '✨', config, true)).pipe(
          Effect.annotateLogs('level', 'info')
        ),

      skip: (message: string) =>
        Effect.log(formatMessage(message, '⏭️', config, true)).pipe(
          Effect.annotateLogs('level', 'info')
        ),

      annotation: (type: AnnotationType, message: string, file?: string, line?: number) =>
        Effect.sync(() => {
          if (config.enableGitHubActions) {
            console.log(createAnnotation(type, message, file, line))
          }
        }),

      separator: (char = '─', length = 80) => Effect.log(char.repeat(length)),

      section: (title: string) =>
        Effect.gen(function* () {
          const sep = '─'.repeat(80)
          yield* Effect.log('')
          yield* Effect.log(sep)
          yield* Effect.log(title)
          yield* Effect.log(sep)
          yield* Effect.log('')
        }),

      group: <A, E, R>(title: string, effect: Effect.Effect<A, E, R>) =>
        Effect.gen(function* () {
          yield* Effect.log(`▼ ${title}`)
          const result = yield* effect
          yield* Effect.log(`▲ ${title} - completed`)
          return result
        }),
    })
  )

/**
 * Helper functions for common operations
 */

/**
 * Log trace message
 */
export const trace = (message: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.trace(message)))

/**
 * Log debug message
 */
export const debug = (message: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.debug(message)))

/**
 * Log info message
 */
export const info = (message: string, emoji?: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.info(message, emoji)))

/**
 * Log warning message
 */
export const warn = (message: string, emoji?: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.warn(message, emoji)))

/**
 * Log error message
 */
export const error = (message: string, emoji?: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.error(message, emoji)))

/**
 * Log fatal message
 */
export const fatal = (message: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.fatal(message)))

/**
 * Log success message
 */
export const success = (message: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.success(message)))

/**
 * Log progress message
 */
export const progress = (message: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.progress(message)))

/**
 * Log completion message
 */
export const complete = (message: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.complete(message)))

/**
 * Log skip message
 */
export const skip = (message: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.skip(message)))

/**
 * Create GitHub Actions annotation
 */
export const annotation = (type: AnnotationType, message: string, file?: string, line?: number) =>
  LoggerService.pipe(Effect.flatMap((service) => service.annotation(type, message, file, line)))

/**
 * Log separator line
 */
export const separator = (char?: string, length?: number) =>
  LoggerService.pipe(Effect.flatMap((service) => service.separator(char, length)))

/**
 * Log section header
 */
export const section = (title: string) =>
  LoggerService.pipe(Effect.flatMap((service) => service.section(title)))

/**
 * Create logger group
 */
export const group = <A, E, R>(title: string, effect: Effect.Effect<A, E, R>) =>
  LoggerService.pipe(Effect.flatMap((service) => service.group(title, effect)))

/**
 * Configure Effect Logger with custom format
 */
export const configureEffectLogger = (config: LoggerConfig = defaultLoggerConfig) =>
  Logger.replace(
    Logger.defaultLogger,
    Logger.make(({ logLevel, message }) => {
      // Map logLevel._tag to our emoji prefixes
      const levelName = String(logLevel._tag).toLowerCase()
      const emoji = EMOJI_PREFIXES[levelName as LogLevelType] || EMOJI_PREFIXES.info
      const formatted = formatMessage(String(message), emoji, config)
      globalThis.console.log(formatted)
    })
  )

/**
 * Pretty Logger Layer - Removes timestamps and fiber IDs for cleaner script output
 */
export const LoggerServicePretty = (config: LoggerConfig = defaultLoggerConfig) =>
  Layer.merge(
    LoggerServiceLive(config),
    Logger.replace(
      Logger.defaultLogger,
      Logger.make(({ message }) => {
        // Simple output without timestamps and fiber IDs
        globalThis.console.log(String(message))
      })
    )
  )
