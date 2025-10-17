import { describe, test, expect } from 'bun:test'
import { CSSCompilationError } from './css-compilation-error'

describe('CSSCompilationError', () => {
  describe('error construction', () => {
    test('creates error with string cause', () => {
      const error = new CSSCompilationError('Failed to compile CSS')

      expect(error).toBeInstanceOf(CSSCompilationError)
      expect(error.cause).toBe('Failed to compile CSS')
      expect(error._tag).toBe('CSSCompilationError')
    })

    test('creates error with Error cause', () => {
      const originalError = new Error('PostCSS compilation failed')
      const error = new CSSCompilationError(originalError)

      expect(error).toBeInstanceOf(CSSCompilationError)
      expect(error.cause).toBe(originalError)
      expect(error._tag).toBe('CSSCompilationError')
    })

    test('creates error with object cause', () => {
      const cause = {
        file: 'input.css',
        line: 42,
        column: 10,
        message: 'Unknown at-rule',
      }
      const error = new CSSCompilationError(cause)

      expect(error).toBeInstanceOf(CSSCompilationError)
      expect(error.cause).toEqual(cause)
      expect(error._tag).toBe('CSSCompilationError')
    })

    test('creates error with null cause', () => {
      const error = new CSSCompilationError(null)

      expect(error).toBeInstanceOf(CSSCompilationError)
      expect(error.cause).toBeNull()
      expect(error._tag).toBe('CSSCompilationError')
    })
  })

  describe('error properties', () => {
    test('_tag is readonly and always CSSCompilationError', () => {
      const error = new CSSCompilationError('test')

      expect(error._tag).toBe('CSSCompilationError')

      // Verify it's the correct discriminator for type narrowing
      const checkTag = (err: unknown): err is CSSCompilationError => {
        return (
          typeof err === 'object' &&
          err !== null &&
          '_tag' in err &&
          err._tag === 'CSSCompilationError'
        )
      }

      expect(checkTag(error)).toBe(true)
    })

    test('cause property preserves original error information', () => {
      const originalError = new Error('Tailwind compilation failed')
      originalError.stack = 'CSS compilation stack trace'

      const error = new CSSCompilationError(originalError)

      expect(error.cause).toBe(originalError)
      expect((error.cause as Error).message).toBe('Tailwind compilation failed')
      expect((error.cause as Error).stack).toBe('CSS compilation stack trace')
    })
  })

  describe('error usage with Effect', () => {
    test('can be used in Effect error channel', () => {
      type CompilationError = CSSCompilationError | { _tag: 'OtherError' }

      const handleError = (error: CompilationError): string => {
        switch (error._tag) {
          case 'CSSCompilationError':
            return `CSS compilation failed: ${error.cause}`
          case 'OtherError':
            return 'Other error occurred'
        }
      }

      const cssError = new CSSCompilationError('Invalid Tailwind directive')
      expect(handleError(cssError)).toBe('CSS compilation failed: Invalid Tailwind directive')
    })
  })

  describe('real-world CSS error scenarios', () => {
    test('handles PostCSS syntax error', () => {
      const syntaxError = new Error('Unclosed block at line 42:10')
      const error = new CSSCompilationError(syntaxError)

      expect(error.cause).toBe(syntaxError)
      expect((error.cause as Error).message).toContain('Unclosed block')
    })

    test('handles Tailwind config error', () => {
      const configError = new Error('Failed to load tailwind.config.js')
      const error = new CSSCompilationError(configError)

      expect(error.cause).toBe(configError)
      expect((error.cause as Error).message).toContain('tailwind.config.js')
    })

    test('handles missing input file error', () => {
      const fileError = new Error('ENOENT: no such file or directory')
      const error = new CSSCompilationError(fileError)

      expect(error.cause).toBe(fileError)
      expect((error.cause as Error).message).toContain('ENOENT')
    })

    test('handles PostCSS plugin error', () => {
      const pluginError = new Error('Plugin tailwindcss failed with error')
      const error = new CSSCompilationError(pluginError)

      expect(error.cause).toBe(pluginError)
      expect((error.cause as Error).message).toContain('Plugin')
    })
  })

  describe('error comparison', () => {
    test('different error instances are not equal', () => {
      const error1 = new CSSCompilationError('Error 1')
      const error2 = new CSSCompilationError('Error 1')

      expect(error1).not.toBe(error2)
      expect(error1.cause).toBe(error2.cause)
    })

    test('errors with different causes are distinguishable', () => {
      const error1 = new CSSCompilationError('Syntax error')
      const error2 = new CSSCompilationError('Config error')

      expect(error1.cause).not.toBe(error2.cause)
    })
  })
})
