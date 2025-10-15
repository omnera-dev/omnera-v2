import { test, expect, describe } from 'bun:test'
import { Schema, ParseResult } from 'effect'
import { NameSchema } from './name'

describe('NameSchema', () => {
  describe('Valid names - npm package naming rules', () => {
    test('should accept lowercase package names', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('todo-app')
      expect(result).toBe('todo-app')
    })

    test('should accept single character lowercase names', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('x')
      expect(result).toBe('x')
    })

    test('should accept names with hyphens', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('my-awesome-app')
      expect(result).toBe('my-awesome-app')
    })

    test('should accept names with underscores (not at start)', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('my_app')
      expect(result).toBe('my_app')
    })

    test('should accept names with dots (not at start)', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('my.app')
      expect(result).toBe('my.app')
    })

    test('should accept names with numbers', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('app123')
      expect(result).toBe('app123')
    })

    test('should accept scoped package names', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('@myorg/my-app')
      expect(result).toBe('@myorg/my-app')
    })

    test('should accept scoped packages with complex names', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('@company/project-name')
      expect(result).toBe('@company/project-name')
    })

    test('should accept URL-safe characters', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('my-app_v2.0')
      expect(result).toBe('my-app_v2.0')
    })

    test('should accept long names up to 214 characters', () => {
      const longName = 'a'.repeat(214)
      const result = Schema.decodeUnknownSync(NameSchema)(longName)
      expect(result).toBe(longName)
    })
  })

  describe('Invalid names - uppercase', () => {
    test('should reject names with uppercase letters', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('MyApp')
      }).toThrow()
    })

    test('should reject names with mixed case', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('Todo-App')
      }).toThrow()
    })

    test('should reject all uppercase names', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('MYAPP')
      }).toThrow()
    })
  })

  describe('Invalid names - leading characters', () => {
    test('should reject names starting with dot', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('.myapp')
      }).toThrow()
    })

    test('should reject names starting with underscore', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('_private')
      }).toThrow()
    })

    test('should reject scoped packages with underscore in scope', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('@_org/package')
      }).toThrow()
    })
  })

  describe('Invalid names - spaces', () => {
    test('should reject names with spaces', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('my app')
      }).toThrow()
    })

    test('should reject names with leading spaces', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)(' myapp')
      }).toThrow()
    })

    test('should reject names with trailing spaces', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('myapp ')
      }).toThrow()
    })
  })

  describe('Invalid names - non-URL-safe characters', () => {
    test('should reject names with parentheses', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('my-app(beta)')
      }).toThrow()
    })

    test('should reject names with special characters', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('my-app!')
      }).toThrow()
    })

    test('should reject names with ampersands', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('my&app')
      }).toThrow()
    })

    test('should reject names with slashes (non-scoped)', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('my/app')
      }).toThrow()
    })
  })

  describe('Invalid names - length constraints', () => {
    test('should reject empty names', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)('')
      }).toThrow()
    })

    test('should reject names exceeding 214 characters', () => {
      const tooLongName = 'a'.repeat(215)
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)(tooLongName)
      }).toThrow()
    })

    test('should provide helpful error message for too long names', () => {
      const tooLongName = 'a'.repeat(215)

      try {
        Schema.decodeUnknownSync(NameSchema)(tooLongName)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(ParseResult.ParseError)
        const message = String(error)
        expect(message).toContain('214 characters')
      }
    })
  })

  describe('Invalid data - wrong types', () => {
    test('should reject non-string name', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)(123 as any)
      }).toThrow()
    })

    test('should reject null values', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)(null as any)
      }).toThrow()
    })

    test('should reject undefined values', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)(undefined as any)
      }).toThrow()
    })

    test('should reject array value', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)(['test-app'] as any)
      }).toThrow()
    })

    test('should reject object value', () => {
      expect(() => {
        Schema.decodeUnknownSync(NameSchema)({ value: 'test-app' } as any)
      }).toThrow()
    })
  })

  describe('Type inference', () => {
    test('should have correct TypeScript type', () => {
      const name = 'type-test'
      const result = Schema.decodeUnknownSync(NameSchema)(name)

      // TypeScript should infer this as string
      const typedName: string = result

      expect(typedName).toBe('type-test')
    })
  })

  describe('Encoding', () => {
    test('should encode valid name', () => {
      const name = 'encode-test'
      const encoded = Schema.encodeSync(NameSchema)(name)

      expect(encoded).toBe('encode-test')
    })
  })

  describe('Real-world examples', () => {
    test('should validate todo application name', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('todo-master')
      expect(result).toBe('todo-master')
    })

    test('should validate e-commerce application name', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('shoppro')
      expect(result).toBe('shoppro')
    })

    test('should validate blog application name', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('blogcraft')
      expect(result).toBe('blogcraft')
    })

    test('should validate dashboard application name', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('dashboard-admin')
      expect(result).toBe('dashboard-admin')
    })

    test('should validate scoped organization package', () => {
      const result = Schema.decodeUnknownSync(NameSchema)('@acme/product')
      expect(result).toBe('@acme/product')
    })
  })
})
