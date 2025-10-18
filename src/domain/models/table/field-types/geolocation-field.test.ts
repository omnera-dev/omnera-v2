import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { GeolocationFieldSchema } from './geolocation-field.ts'

describe('GeolocationFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid geolocation field', () => {
      const field = {
        id: 1,
        name: 'office_location',
        type: 'geolocation',
      }

      const result = Schema.decodeUnknownSync(GeolocationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept geolocation field with required flag', () => {
      const field = {
        id: 1,
        name: 'office_location',
        type: 'geolocation',
        required: true,
      }

      const result = Schema.decodeUnknownSync(GeolocationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept geolocation field with optional flag', () => {
      const field = {
        id: 1,
        name: 'delivery_location',
        type: 'geolocation',
        required: false,
      }

      const result = Schema.decodeUnknownSync(GeolocationFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'office_location',
        type: 'geolocation',
      }

      expect(() => {
        Schema.decodeUnknownSync(GeolocationFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'office_location',
      }

      expect(() => {
        Schema.decodeUnknownSync(GeolocationFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof GeolocationFieldSchema> = {
        id: 1,
        name: 'office_location',
        type: 'geolocation',
        required: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
