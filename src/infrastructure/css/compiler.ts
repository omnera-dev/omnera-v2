/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/postcss'
import { Effect, Ref } from 'effect'
import postcss from 'postcss'
import { CSSCompilationError } from '@/infrastructure/errors/css-compilation-error'

/**
 * Compiled CSS result with metadata
 */
export interface CompiledCSS {
  readonly css: string
  readonly timestamp: number
}

/**
 * In-memory cache for compiled CSS using Effect.Ref
 * Avoids recompiling on every request for better performance
 * Uses functional state management to avoid mutations
 */
const cssCache = Ref.unsafeMake<CompiledCSS | undefined>(undefined)

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
    // Check cache first
    const cached = yield* Ref.get(cssCache)
    if (cached !== undefined) {
      return cached
    }

    // Read source CSS file
    const cssPath = join(process.cwd(), 'src', 'presentation', 'styles', 'globals.css')
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

    // Update cache using functional approach
    yield* Ref.set(cssCache, compiled)

    return compiled
  })
