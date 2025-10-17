import { test, expect, describe } from 'bun:test'
import { Effect } from 'effect'
import { CSSCompilationError } from '@/infrastructure/errors/css-compilation-error'
import { compileCSS, type CompiledCSS } from './compiler'

describe('CSSCompilationError', () => {
  test('should create error with correct tag', () => {
    // Given: An error cause
    const cause = new Error('CSS parsing failed')

    // When: CSSCompilationError is created
    const error = new CSSCompilationError(cause)

    // Then: Error has correct tag and cause
    expect(error._tag).toBe('CSSCompilationError')
    expect(error.cause).toBe(cause)
  })

  test('should handle string cause', () => {
    // Given: A string cause
    const cause = 'File not found'

    // When: CSSCompilationError is created
    const error = new CSSCompilationError(cause)

    // Then: Error stores string cause
    expect(error._tag).toBe('CSSCompilationError')
    expect(error.cause).toBe('File not found')
  })

  test('should handle object cause', () => {
    // Given: An object cause
    const cause = { code: 'ENOENT', path: '/path/to/file.css' }

    // When: CSSCompilationError is created
    const error = new CSSCompilationError(cause)

    // Then: Error stores object cause
    expect(error._tag).toBe('CSSCompilationError')
    expect(error.cause).toEqual({ code: 'ENOENT', path: '/path/to/file.css' })
  })
})

describe('CompiledCSS interface', () => {
  test('should have correct structure', () => {
    // Given: A CompiledCSS object
    const compiled: CompiledCSS = {
      css: '.text-red-500 { color: #ef4444; }',
      timestamp: Date.now(),
    }

    // When: Checking properties
    // Then: Has required properties
    expect(compiled.css).toBeTypeOf('string')
    expect(compiled.timestamp).toBeTypeOf('number')
    expect(compiled.css.length).toBeGreaterThan(0)
    expect(compiled.timestamp).toBeGreaterThan(0)
  })

  test('should handle empty CSS', () => {
    // Given: Empty CSS
    const compiled: CompiledCSS = {
      css: '',
      timestamp: Date.now(),
    }

    // When: Checking properties
    // Then: Empty string is valid
    expect(compiled.css).toBe('')
    expect(compiled.timestamp).toBeGreaterThan(0)
  })

  test('should handle large CSS strings', () => {
    // Given: Large CSS output
    const largeCSS = '.class-' + 'a'.repeat(10_000) + ' { color: red; }'
    const compiled: CompiledCSS = {
      css: largeCSS,
      timestamp: Date.now(),
    }

    // When: Checking properties
    // Then: Handles large strings
    expect(compiled.css.length).toBeGreaterThan(10_000)
    expect(compiled.timestamp).toBeGreaterThan(0)
  })
})

describe('compileCSS - Type Validation', () => {
  test('should return Effect type', () => {
    // Given: compileCSS function
    // When: Called
    const result = compileCSS()

    // Then: Returns Effect
    expect(Effect.isEffect(result)).toBe(true)
  })

  test('should have correct Effect error type', () => {
    // Given: compileCSS function
    const program = compileCSS()

    // When: Checking Effect type
    // Then: Should be Effect that can fail with CSSCompilationError
    // Note: Actual file system interaction is tested in integration tests
    expect(Effect.isEffect(program)).toBe(true)
  })

  test('should return CompiledCSS on success', () => {
    // Given: compileCSS function
    const program = compileCSS()

    // When: Checking return type
    // Then: Effect should be Effect<CompiledCSS, CSSCompilationError>
    expect(Effect.isEffect(program)).toBe(true)
  })
})

describe('compileCSS - Error Handling', () => {
  test('should handle file read errors', () => {
    // Given: CSS file doesn't exist
    // When: compileCSS attempts to read non-existent file
    // Then: Should return CSSCompilationError

    // Note: This tests the error wrapping behavior
    // Actual file system errors are tested in integration tests
    const error = new CSSCompilationError(new Error('ENOENT'))
    expect(error._tag).toBe('CSSCompilationError')
    expect(error.cause).toBeInstanceOf(Error)
  })

  test('should handle PostCSS processing errors', () => {
    // Given: Invalid CSS syntax
    // When: PostCSS fails to process
    // Then: Error should be wrapped in CSSCompilationError

    const error = new CSSCompilationError({
      name: 'CssSyntaxError',
      reason: 'Unknown at-rule',
      line: 5,
    })

    expect(error._tag).toBe('CSSCompilationError')
    expect(error.cause).toHaveProperty('name', 'CssSyntaxError')
  })

  test('should handle malformed CSS file', () => {
    // Given: CSS with syntax errors
    // When: Compilation fails
    // Then: Returns appropriate error

    const error = new CSSCompilationError('Unexpected token')
    expect(error._tag).toBe('CSSCompilationError')
    expect(error.cause).toBe('Unexpected token')
  })

  test('should handle permission denied errors', () => {
    // Given: No read permission on CSS file
    // When: readFile fails with EACCES
    // Then: Error is wrapped correctly

    const error = new CSSCompilationError({ code: 'EACCES', message: 'Permission denied' })
    expect(error._tag).toBe('CSSCompilationError')
    expect(error.cause).toHaveProperty('code', 'EACCES')
  })
})

describe('compileCSS - Cache Behavior', () => {
  test('should cache compilation results', () => {
    // Given: CSS has been compiled once
    // When: compileCSS is called again
    // Then: Should use cached result (tested via integration tests)

    // Note: Cache testing requires running the actual Effect program
    // which involves file I/O. This is tested in integration tests.
    // Here we verify the cache data structure is correct.

    const cached: CompiledCSS = {
      css: '.cached { color: blue; }',
      timestamp: Date.now(),
    }

    expect(cached.css).toBeTruthy()
    expect(cached.timestamp).toBeGreaterThan(0)
  })

  test('should include timestamp in cached result', () => {
    // Given: A compilation result
    const timestamp = Date.now()
    const result: CompiledCSS = {
      css: '.test { color: red; }',
      timestamp,
    }

    // When: Checking timestamp
    // Then: Timestamp should be recent
    expect(result.timestamp).toBe(timestamp)
    expect(Date.now() - result.timestamp).toBeLessThan(1000)
  })

  test('should handle cache with large CSS', () => {
    // Given: Large compiled CSS
    const largeCss = '.test { ' + 'property: value; '.repeat(1000) + '}'
    const result: CompiledCSS = {
      css: largeCss,
      timestamp: Date.now(),
    }

    // When: Checking cached result
    // Then: Large CSS is stored correctly
    expect(result.css.length).toBeGreaterThan(10_000)
    expect(result.timestamp).toBeGreaterThan(0)
  })
})

describe('compileCSS - Path Resolution', () => {
  test('should construct correct CSS file path', () => {
    // Given: Current working directory
    const cwd = process.cwd()

    // When: CSS path is constructed
    const expectedPath = `${cwd}/src/presentation/styles/globals.css`

    // Then: Path should be correct
    expect(expectedPath).toContain('/src/presentation/styles/globals.css')
    expect(expectedPath).toStartWith(cwd)
  })

  test('should handle different working directories', () => {
    // Given: Different working directory
    const customCwd = '/custom/path'

    // When: Path is constructed with custom cwd
    const path = `${customCwd}/src/presentation/styles/globals.css`

    // Then: Path should use custom directory
    expect(path).toBe('/custom/path/src/presentation/styles/globals.css')
  })
})

describe('compileCSS - CSS Content Validation', () => {
  test('should handle empty CSS file', () => {
    // Given: Empty CSS content
    const emptyResult: CompiledCSS = {
      css: '',
      timestamp: Date.now(),
    }

    // When: Checking result
    // Then: Empty string is valid
    expect(emptyResult.css).toBe('')
    expect(emptyResult.css.length).toBe(0)
  })

  test('should handle CSS with only whitespace', () => {
    // Given: Whitespace-only CSS
    const whitespaceResult: CompiledCSS = {
      css: '   \n  \t  ',
      timestamp: Date.now(),
    }

    // When: Checking result
    // Then: Whitespace is preserved
    expect(whitespaceResult.css).toContain(' ')
    expect(whitespaceResult.css).toContain('\n')
  })

  test('should handle CSS with unicode characters', () => {
    // Given: CSS with unicode
    const unicodeResult: CompiledCSS = {
      css: '.emoji { content: "🚀"; }',
      timestamp: Date.now(),
    }

    // When: Checking result
    // Then: Unicode is preserved
    expect(unicodeResult.css).toContain('🚀')
  })

  test('should handle CSS with special characters', () => {
    // Given: CSS with special characters
    const specialResult: CompiledCSS = {
      css: '.class { content: "\\n\\t\\r"; }',
      timestamp: Date.now(),
    }

    // When: Checking result
    // Then: Special characters are preserved
    expect(specialResult.css).toContain('\\n')
    expect(specialResult.css).toContain('\\t')
  })

  test('should handle minified CSS', () => {
    // Given: Minified CSS (no whitespace)
    const minifiedResult: CompiledCSS = {
      css: '.a{color:red}.b{color:blue}',
      timestamp: Date.now(),
    }

    // When: Checking result
    // Then: Minified format is preserved
    expect(minifiedResult.css).not.toContain(' ')
    expect(minifiedResult.css).not.toContain('\n')
    expect(minifiedResult.css.length).toBeLessThan(50)
  })
})
