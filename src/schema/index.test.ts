import { test, expect, describe } from 'bun:test'
import { Schema, ParseResult } from 'effect'
import { AppSchema, type App } from './index'

describe('AppSchema', () => {
  describe('Valid names - npm package naming rules', () => {
    test('should accept lowercase package names', () => {
      const validData = { name: 'todo-app' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('todo-app')
    })

    test('should accept single character lowercase names', () => {
      const validData = { name: 'x' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('x')
    })

    test('should accept names with hyphens', () => {
      const validData = { name: 'my-awesome-app' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('my-awesome-app')
    })

    test('should accept names with underscores (not at start)', () => {
      const validData = { name: 'my_app' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('my_app')
    })

    test('should accept names with dots (not at start)', () => {
      const validData = { name: 'my.app' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('my.app')
    })

    test('should accept names with numbers', () => {
      const validData = { name: 'app123' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('app123')
    })

    test('should accept scoped package names', () => {
      const validData = { name: '@myorg/my-app' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('@myorg/my-app')
    })

    test('should accept scoped packages with complex names', () => {
      const validData = { name: '@company/project-name' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('@company/project-name')
    })

    test('should accept URL-safe characters', () => {
      const validData = { name: 'my-app_v2.0' }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe('my-app_v2.0')
    })

    test('should accept long names up to 214 characters', () => {
      const longName = 'a'.repeat(214)
      const validData = { name: longName }
      const result = Schema.decodeUnknownSync(AppSchema)(validData)
      expect(result.name).toBe(longName)
    })
  })

  describe('Invalid names - uppercase', () => {
    test('should reject names with uppercase letters', () => {
      const invalidData = { name: 'MyApp' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names with mixed case', () => {
      const invalidData = { name: 'Todo-App' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject all uppercase names', () => {
      const invalidData = { name: 'MYAPP' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Invalid names - leading characters', () => {
    test('should reject names starting with dot', () => {
      const invalidData = { name: '.myapp' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names starting with underscore', () => {
      const invalidData = { name: '_private' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject scoped packages with underscore in scope', () => {
      const invalidData = { name: '@_org/package' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Invalid names - spaces', () => {
    test('should reject names with spaces', () => {
      const invalidData = { name: 'my app' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names with leading spaces', () => {
      const invalidData = { name: ' myapp' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names with trailing spaces', () => {
      const invalidData = { name: 'myapp ' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Invalid names - non-URL-safe characters', () => {
    test('should reject names with parentheses', () => {
      const invalidData = { name: 'my-app(beta)' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names with special characters', () => {
      const invalidData = { name: 'my-app!' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names with ampersands', () => {
      const invalidData = { name: 'my&app' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names with slashes (non-scoped)', () => {
      const invalidData = { name: 'my/app' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Invalid names - length constraints', () => {
    test('should reject empty names', () => {
      const invalidData = { name: '' }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject names exceeding 214 characters', () => {
      const tooLongName = 'a'.repeat(215)
      const invalidData = { name: tooLongName }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should provide helpful error message for too long names', () => {
      const tooLongName = 'a'.repeat(215)
      const invalidData = { name: tooLongName }

      try {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(ParseResult.ParseError)
        const message = String(error)
        expect(message).toContain('214 characters')
      }
    })
  })

  describe('Invalid data - missing fields', () => {
    test('should reject missing name field', () => {
      const invalidData = {}
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Invalid data - wrong types', () => {
    test('should reject non-string name', () => {
      const invalidData = { name: 123 }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject null values', () => {
      const invalidData = { name: null }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject undefined values', () => {
      const invalidData = { name: undefined }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject array value', () => {
      const invalidData = { name: ['test-app'] }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject object value', () => {
      const invalidData = { name: { value: 'test-app' } }
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Type inference', () => {
    test('should have correct TypeScript type', () => {
      const app: App = {
        name: 'type-test',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // TypeScript should infer this as string
      const name: string = result.name

      expect(name).toBe('type-test')
    })
  })

  describe('Encoding', () => {
    test('should encode valid app data', () => {
      const app: App = {
        name: 'encode-test',
      }

      const encoded = Schema.encodeSync(AppSchema)(app)

      expect(encoded.name).toBe('encode-test')
    })
  })

  describe('Real-world examples', () => {
    test('should validate todo application config', () => {
      const todoApp = {
        name: 'todo-master',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(todoApp)

      expect(result.name).toBe('todo-master')
    })

    test('should validate e-commerce application config', () => {
      const ecommerceApp = {
        name: 'shoppro',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(ecommerceApp)

      expect(result.name).toBe('shoppro')
    })

    test('should validate blog application config', () => {
      const blogApp = {
        name: 'blogcraft',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(blogApp)

      expect(result.name).toBe('blogcraft')
    })

    test('should validate dashboard application config', () => {
      const dashboardApp = {
        name: 'dashboard-admin',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(dashboardApp)

      expect(result.name).toBe('dashboard-admin')
    })

    test('should validate scoped organization package', () => {
      const scopedApp = {
        name: '@acme/product',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(scopedApp)

      expect(result.name).toBe('@acme/product')
    })
  })
})
