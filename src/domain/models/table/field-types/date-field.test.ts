import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { DateFieldSchema } from './date-field.ts'

describe('DateFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid date field', () => {
      const field = {
        id: 1,
        name: 'due_date',
        type: 'date',
      }

      const result = Schema.decodeUnknownSync(DateFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept date field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'due_date',
        type: 'date',
        required: true,
        unique: false,
        indexed: true,
        format: 'YYYY-MM-DD',
        includeTime: true,
        timezone: 'America/New_York',
        default: '2025-01-01',
      }

      const result = Schema.decodeUnknownSync(DateFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept date field with time', () => {
      const field = {
        id: 1,
        name: 'appointment',
        type: 'date',
        includeTime: true,
        timezone: 'UTC',
      }

      const result = Schema.decodeUnknownSync(DateFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'due_date',
        type: 'date',
      }

      expect(() => {
        Schema.decodeUnknownSync(DateFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'due_date',
      }

      expect(() => {
        Schema.decodeUnknownSync(DateFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof DateFieldSchema> = {
        id: 1,
        name: 'due_date',
        type: 'date',
        format: 'YYYY-MM-DD',
      }
      expect(field.id).toBe(1)
    })
  })
})
