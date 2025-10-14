import { Effect } from 'effect'
import postcss from 'postcss'
import tailwindcss from '@tailwindcss/postcss'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Error class for CSS compilation failures
 */
export class CSSCompilationError {
  readonly _tag = 'CSSCompilationError'
  constructor(readonly cause: unknown) {}
}

/**
 * Compiled CSS result with metadata
 */
export interface CompiledCSS {
  readonly css: string
  readonly timestamp: number
}

/**
 * In-memory cache for compiled CSS
 * Avoids recompiling on every request for better performance
 */
let cachedCSS: CompiledCSS | null = null

/**
 * Compiles Tailwind CSS using PostCSS with @tailwindcss/postcss plugin
 *
 * This function:
 * 1. Reads the source CSS file (src/styles/main.css)
 * 2. Processes it through PostCSS with Tailwind CSS v4 plugin
 * 3. Returns the compiled CSS string
 * 4. Caches the result in memory for subsequent requests
 *
 * @returns Effect that yields compiled CSS string or CSSCompilationError
 *
 * @example
 * ```typescript
 * const program = Effect.gen(function* () {
 *   const result = yield* compileCSS()
 *   console.log(`Compiled ${result.css.length} bytes of CSS`)
 * })
 *
 * Effect.runPromise(program)
 * ```
 */
export const compileCSS = (): Effect.Effect<CompiledCSS, CSSCompilationError> =>
  Effect.gen(function* () {
    // Return cached CSS if available
    if (cachedCSS) {
      return cachedCSS
    }

    // Read source CSS file
    const cssPath = join(process.cwd(), 'src', 'styles', 'main.css')
    const sourceCSS = yield* Effect.tryPromise({
      try: () => readFile(cssPath, 'utf-8'),
      catch: (error) => new CSSCompilationError(error),
    })

    // Process CSS through PostCSS with Tailwind plugin
    const result = yield* Effect.tryPromise({
      try: async () => {
        const processor = postcss([tailwindcss()])
        return await processor.process(sourceCSS, {
          from: cssPath,
          to: undefined, // No output file (in-memory compilation)
        })
      },
      catch: (error) => new CSSCompilationError(error),
    })

    // Create compiled CSS result
    const compiled: CompiledCSS = {
      css: result.css,
      timestamp: Date.now(),
    }

    // Cache the result
    cachedCSS = compiled

    return compiled
  })

/**
 * Clears the CSS compilation cache
 * Useful for development when CSS source files change
 *
 * @returns Effect that clears the cache
 */
export const clearCSSCache = (): Effect.Effect<void> =>
  Effect.sync(() => {
    cachedCSS = null
  })

/**
 * Gets the cached CSS if available
 *
 * @returns Effect that yields cached CSS or null if not cached
 */
export const getCachedCSS = (): Effect.Effect<CompiledCSS | null> => Effect.sync(() => cachedCSS)
