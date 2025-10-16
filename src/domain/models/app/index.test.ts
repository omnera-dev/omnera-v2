import { test, expect, describe } from 'bun:test'
import { Schema, ParseResult } from 'effect'
import { AppSchema, type App } from '.'

describe('AppSchema', () => {
  describe('Valid applications - Name only', () => {
    test('should accept app with only name', () => {
      // GIVEN: An app configuration with only a name
      const app = {
        name: 'todo-app',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted without modification
      expect(result).toEqual({
        name: 'todo-app',
      })
    })

    test('should accept app with scoped name', () => {
      // GIVEN: An app configuration with scoped package name
      const app = {
        name: '@myorg/todo-app',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: '@myorg/todo-app',
      })
    })
  })

  describe('Valid applications - Name and version', () => {
    test('should accept app with name and version', () => {
      // GIVEN: An app configuration with name and version
      const app = {
        name: 'todo-app',
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted with both properties
      expect(result).toEqual({
        name: 'todo-app',
        version: '1.0.0',
      })
    })

    test('should accept app with version in development', () => {
      // GIVEN: An app configuration with development version
      const app = {
        name: 'my-app',
        version: '0.1.0',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'my-app',
        version: '0.1.0',
      })
    })

    test('should accept app with pre-release version', () => {
      // GIVEN: An app configuration with pre-release version
      const app = {
        name: 'beta-app',
        version: '2.0.0-beta.1',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'beta-app',
        version: '2.0.0-beta.1',
      })
    })

    test('should accept app with build metadata', () => {
      // GIVEN: An app configuration with version containing build metadata
      const app = {
        name: 'ci-app',
        version: '1.0.0+build.123',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'ci-app',
        version: '1.0.0+build.123',
      })
    })

    test('should accept scoped app with complex version', () => {
      // GIVEN: A scoped app with pre-release and build metadata
      const app = {
        name: '@acme/product',
        version: '1.0.0-rc.1+build.456',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: '@acme/product',
        version: '1.0.0-rc.1+build.456',
      })
    })
  })

  describe('Invalid applications - Name validation', () => {
    test('should reject app with invalid name (uppercase)', () => {
      // GIVEN: An app with uppercase letters in name
      const invalidApp = {
        name: 'TodoApp',
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })

    test('should reject app with empty name', () => {
      // GIVEN: An app with empty name
      const invalidApp = {
        name: '',
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })

    test('should reject app with name containing spaces', () => {
      // GIVEN: An app with spaces in name
      const invalidApp = {
        name: 'my app',
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })

    test('should reject app with name exceeding 214 characters', () => {
      // GIVEN: An app with name exceeding maximum length
      const invalidApp = {
        name: 'a'.repeat(215),
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })
  })

  describe('Invalid applications - Version validation', () => {
    test('should reject app with invalid version (leading zeros)', () => {
      // GIVEN: An app with version containing leading zeros
      const invalidApp = {
        name: 'my-app',
        version: '01.0.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })

    test('should reject app with incomplete version', () => {
      // GIVEN: An app with incomplete version (missing patch)
      const invalidApp = {
        name: 'my-app',
        version: '1.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })

    test('should reject app with non-numeric version components', () => {
      // GIVEN: An app with non-numeric version components
      const invalidApp = {
        name: 'my-app',
        version: '1.x.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })

    test('should reject app with version containing spaces', () => {
      // GIVEN: An app with spaces in version
      const invalidApp = {
        name: 'my-app',
        version: '1.0.0 beta',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
      }).toThrow()
    })
  })

  describe('Invalid applications - Missing required fields', () => {
    test('should reject app without name', () => {
      // GIVEN: An app configuration missing the required name field
      const invalidApp = {
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp as any)
      }).toThrow()
    })

    test('should reject empty object', () => {
      // GIVEN: An empty object
      const invalidApp = {}

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp as any)
      }).toThrow()
    })
  })

  describe('Invalid data - Wrong types', () => {
    test('should reject null', () => {
      // GIVEN: A null value
      const invalidInput = null

      // WHEN: The value is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidInput as any)
      }).toThrow()
    })

    test('should reject undefined', () => {
      // GIVEN: An undefined value
      const invalidInput = undefined

      // WHEN: The value is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidInput as any)
      }).toThrow()
    })

    test('should reject string value', () => {
      // GIVEN: A string instead of an object
      const invalidInput = 'todo-app'

      // WHEN: The value is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidInput as any)
      }).toThrow()
    })

    test('should reject array value', () => {
      // GIVEN: An array instead of an object
      const invalidInput = [{ name: 'todo-app' }]

      // WHEN: The value is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidInput as any)
      }).toThrow()
    })

    test('should reject app with wrong name type', () => {
      // GIVEN: An app with number as name
      const invalidApp = {
        name: 123,
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp as any)
      }).toThrow()
    })

    test('should reject app with wrong version type', () => {
      // GIVEN: An app with number as version
      const invalidApp = {
        name: 'my-app',
        version: 1.0,
      }

      // WHEN: The app is validated against the schema
      // THEN: Validation should throw an error
      expect(() => {
        Schema.decodeUnknownSync(AppSchema)(invalidApp as any)
      }).toThrow()
    })
  })

  describe('Type inference', () => {
    test('should have correct TypeScript type for name only', () => {
      // GIVEN: A valid app configuration with only name
      const app = {
        name: 'my-app',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: TypeScript should infer the correct type
      const typedApp: App = result
      expect(typedApp.name).toBe('my-app')
      expect(typedApp.version).toBeUndefined()
    })

    test('should have correct TypeScript type for name and version', () => {
      // GIVEN: A valid app configuration with name and version
      const app = {
        name: 'my-app',
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: TypeScript should infer the correct type
      const typedApp: App = result
      expect(typedApp.name).toBe('my-app')
      expect(typedApp.version).toBe('1.0.0')
    })
  })

  describe('Encoding', () => {
    test('should encode valid app with name only', () => {
      // GIVEN: A valid app configuration with only name
      const app = {
        name: 'my-app',
      }

      // WHEN: The app is encoded using the schema
      const encoded = Schema.encodeSync(AppSchema)(app)

      // THEN: The encoded value should match the original app
      expect(encoded).toEqual({
        name: 'my-app',
      })
    })

    test('should encode valid app with name and version', () => {
      // GIVEN: A valid app configuration with name and version
      const app = {
        name: 'my-app',
        version: '1.0.0',
      }

      // WHEN: The app is encoded using the schema
      const encoded = Schema.encodeSync(AppSchema)(app)

      // THEN: The encoded value should match the original app
      expect(encoded).toEqual({
        name: 'my-app',
        version: '1.0.0',
      })
    })
  })

  describe('Real-world examples', () => {
    test('should validate todo application', () => {
      // GIVEN: A real-world todo application configuration
      const app = {
        name: 'todo-master',
        version: '2.1.0',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'todo-master',
        version: '2.1.0',
      })
    })

    test('should validate e-commerce application', () => {
      // GIVEN: A real-world e-commerce application configuration
      const app = {
        name: 'shoppro',
        version: '3.0.0-rc.1',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'shoppro',
        version: '3.0.0-rc.1',
      })
    })

    test('should validate blog application without version', () => {
      // GIVEN: A blog application without version
      const app = {
        name: 'blogcraft',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'blogcraft',
      })
    })

    test('should validate dashboard application with build metadata', () => {
      // GIVEN: A dashboard application with CI build metadata
      const app = {
        name: 'dashboard-admin',
        version: '1.5.2+build.20241016',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'dashboard-admin',
        version: '1.5.2+build.20241016',
      })
    })

    test('should validate scoped organization package', () => {
      // GIVEN: A scoped organization package configuration
      const app = {
        name: '@acme/product',
        version: '0.1.0-dev',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: '@acme/product',
        version: '0.1.0-dev',
      })
    })
  })

  describe('Edge cases', () => {
    test('should accept app with minimum valid name and version', () => {
      // GIVEN: An app with single character name and minimum version
      const app = {
        name: 'x',
        version: '0.0.0',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'x',
        version: '0.0.0',
      })
    })

    test('should accept app with maximum length name', () => {
      // GIVEN: An app with name at maximum length
      const app = {
        name: 'a'.repeat(214),
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'a'.repeat(214),
        version: '1.0.0',
      })
    })

    test('should accept app with complex version identifiers', () => {
      // GIVEN: An app with complex pre-release and build metadata
      const app = {
        name: 'my-app',
        version: '1.0.0-rc.1.alpha+build.123.sha.abc',
      }

      // WHEN: The app is validated against the schema
      const result = Schema.decodeUnknownSync(AppSchema)(app)

      // THEN: The app should be accepted
      expect(result).toEqual({
        name: 'my-app',
        version: '1.0.0-rc.1.alpha+build.123.sha.abc',
      })
    })
  })

  describe('Error messages', () => {
    test('should provide helpful error for missing name', () => {
      // GIVEN: An app without required name field
      const invalidApp = {
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      try {
        Schema.decodeUnknownSync(AppSchema)(invalidApp as any)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        // THEN: Error should be ParseError
        expect(error).toBeInstanceOf(ParseResult.ParseError)
      }
    })

    test('should provide helpful error for invalid name', () => {
      // GIVEN: An app with invalid name format
      const invalidApp = {
        name: 'MyApp',
        version: '1.0.0',
      }

      // WHEN: The app is validated against the schema
      try {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        // THEN: Error should mention npm package naming
        expect(error).toBeInstanceOf(ParseResult.ParseError)
        const message = String(error)
        expect(message).toContain('lowercase')
      }
    })

    test('should provide helpful error for invalid version', () => {
      // GIVEN: An app with invalid version format (meets length but wrong pattern)
      const invalidApp = {
        name: 'my-app',
        version: 'x.y.z',
      }

      // WHEN: The app is validated against the schema
      try {
        Schema.decodeUnknownSync(AppSchema)(invalidApp)
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        // THEN: Error should mention Semantic Versioning
        expect(error).toBeInstanceOf(ParseResult.ParseError)
        const message = String(error)
        expect(message).toContain('Semantic Versioning')
      }
    })
  })
})
