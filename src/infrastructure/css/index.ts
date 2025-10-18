/**
 * CSS Infrastructure Module
 *
 * Provides CSS compilation utilities using Tailwind CSS via PostCSS.
 * Compiles Tailwind CSS on-demand for development and production builds.
 *
 * @example
 * ```typescript
 * import { compileCSS } from '@/infrastructure/css'
 *
 * const program = Effect.gen(function* () {
 *   const compiledCSS = yield* compileCSS()
 *   return compiledCSS
 * })
 * ```
 */

export { compileCSS } from './compiler'
