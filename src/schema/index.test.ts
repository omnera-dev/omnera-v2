import { test, expect, describe } from 'bun:test'
import { Schema, ParseResult } from 'effect'
import { AppSchema, type App } from './index'

describe('AppSchema', () => {
  describe('Valid data', () => {
    test('should decode valid app data with name and description', () => {
      const validData = {
        name: 'Todo App',
        description: 'A simple todo application',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('Todo App')
      expect(result.description).toBe('A simple todo application')
    })

    test('should decode app with multi-line description', () => {
      const validData = {
        name: 'E-commerce Platform',
        description:
          'A comprehensive e-commerce solution with:\n- Product catalog\n- Shopping cart\n- Payment integration',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('E-commerce Platform')
      expect(result.description).toContain('Product catalog')
    })

    test('should decode app with single character name', () => {
      const validData = {
        name: 'X',
        description: 'Minimal app',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('X')
      expect(result.description).toBe('Minimal app')
    })

    test('should decode app with empty description', () => {
      const validData = {
        name: 'Test App',
        description: '',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('Test App')
      expect(result.description).toBe('')
    })

    test('should decode app with special characters in name', () => {
      const validData = {
        name: 'My App 2.0 (Beta)',
        description: 'Testing special characters',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(validData)

      expect(result.name).toBe('My App 2.0 (Beta)')
    })
  })

  describe('Invalid data - empty name', () => {
    test('should reject empty name', () => {
      const invalidData = {
        name: '',
        description: 'Test description',
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should provide helpful error message for empty name', () => {
      const invalidData = {
        name: '',
        description: 'Test description',
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
      const invalidData = {
        description: 'Test description',
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject missing description field', () => {
      const invalidData = {
        name: 'Test App',
      }

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
        description: 'Test description',
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject non-string description', () => {
      const invalidData = {
        name: 'Test App',
        description: { text: 'Not a string' },
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject null values', () => {
      const invalidData = {
        name: null,
        description: null,
      }

      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidData)
      }).toThrow()
    })

    test('should reject undefined values', () => {
      const invalidData = {
        name: undefined,
        description: undefined,
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
        description: 'Testing type inference',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // TypeScript should infer these as strings
      const name: string = result.name
      const description: string = result.description

      expect(name).toBe('Type Test')
      expect(description).toBe('Testing type inference')
    })
  })

  describe('Encoding', () => {
    test('should encode valid app data', () => {
      const app: App = {
        name: 'Encode Test',
        description: 'Testing encoding',
      }

      const encoded = Schema.encodeSync(AppSchema)(app)

      expect(encoded.name).toBe('Encode Test')
      expect(encoded.description).toBe('Testing encoding')
    })
  })

  describe('Real-world examples', () => {
    test('should validate todo application config', () => {
      const todoApp = {
        name: 'Todo Master',
        description:
          'A fullstack todo application with user authentication, task prioritization, and real-time sync',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(todoApp)

      expect(result.name).toBe('Todo Master')
      expect(result.description).toContain('authentication')
    })

    test('should validate e-commerce application config', () => {
      const ecommerceApp = {
        name: 'ShopPro',
        description:
          'E-commerce platform with product catalog, shopping cart, payment integration, and order management',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(ecommerceApp)

      expect(result.name).toBe('ShopPro')
      expect(result.description).toContain('payment')
    })

    test('should validate blog application config', () => {
      const blogApp = {
        name: 'BlogCraft',
        description:
          'A modern blog system with markdown support, real-time comments, and social media integration',
      }

      const result = Schema.decodeUnknownSync(AppSchema)(blogApp)

      expect(result.name).toBe('BlogCraft')
      expect(result.description).toContain('markdown')
    })
  })
})
