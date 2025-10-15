import { test, expect, describe } from 'bun:test'
import { Schema, ParseResult } from 'effect'
import { AppSchema, type App } from './index'

describe('AppSchema', () => {
  describe('Valid data', () => {
    test('should decode valid app data with name', () => {
      const validData = {
        name: 'Todo App',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('Todo App')
    })

    test('should decode app with single character name', () => {
      const validData = {
        name: 'X',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('X')
    })

    test('should decode app with special characters in name', () => {
      const validData = {
        name: 'My App 2.0 (Beta)',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('My App 2.0 (Beta)')
    })

    test('should decode app with long name', () => {
      const validData = {
        name: 'A comprehensive e-commerce solution with product catalog and shopping cart',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe(
        'A comprehensive e-commerce solution with product catalog and shopping cart'
      )
    })
  })

  describe('Invalid data - empty name', () => {
    test('should reject empty name', () => {
      const invalidData = {
        name: '',
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should provide helpful error message for empty name', () => {
      const invalidData = {
        name: '',
      }

      try {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(ParseResult.ParseError)
        const message = String(error)
        expect(message).toContain('Name must not be empty')
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

    test('should reject completely empty object', () => {
      const invalidData = {}

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Invalid data - wrong types', () => {
    test('should reject non-string name', () => {
      const invalidData = {
        name: 123,
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject null values', () => {
      const invalidData = {
        name: null,
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject undefined values', () => {
      const invalidData = {
        name: undefined,
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject array value', () => {
      const invalidData = {
        name: ['Test App'],
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject object value', () => {
      const invalidData = {
        name: { value: 'Test App' },
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })
  })

  describe('Type inference', () => {
    test('should have correct TypeScript type', () => {
      const app: App = {
        name: 'Type Test',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // TypeScript should infer this as string
      const name: string = result.name

      expect(name).toBe('Type Test')
    })
  })

  describe('Encoding', () => {
    test('should encode valid app data', () => {
      const app: App = {
        name: 'Encode Test',
      }

      const encoded = Schema.encodeSync(AppSchema)(app)

      expect(encoded.name).toBe('Encode Test')
    })
  })

  describe('Real-world examples', () => {
    test('should validate todo application config', () => {
      const todoApp = {
        name: 'Todo Master',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(todoApp)

      expect(result.name).toBe('Todo Master')
    })

    test('should validate e-commerce application config', () => {
      const ecommerceApp = {
        name: 'ShopPro',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(ecommerceApp)

      expect(result.name).toBe('ShopPro')
    })

    test('should validate blog application config', () => {
      const blogApp = {
        name: 'BlogCraft',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(blogApp)

      expect(result.name).toBe('BlogCraft')
    })

    test('should validate dashboard application config', () => {
      const dashboardApp = {
        name: 'Dashboard Admin',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(dashboardApp)

      expect(result.name).toBe('Dashboard Admin')
    })
  })
})
