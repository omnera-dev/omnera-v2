import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { DurationFieldSchema } from './duration-field.ts'

describe('DurationFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid duration field', () => {
      const field = {
        id: 1,
        name: 'work_hours',
        type: 'duration',
      }

      const result = Schema.decodeUnknownSync(DurationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept duration field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'work_hours',
        type: 'duration',
        required: true,
        format: 'h:mm',
      }

      const result = Schema.decodeUnknownSync(DurationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept duration field with custom format', () => {
      const field = {
        id: 1,
        name: 'elapsed_time',
        type: 'duration',
        format: 'h:mm:ss',
      }

      const result = Schema.decodeUnknownSync(DurationFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'work_hours',
        type: 'duration',
      }

      expect(() => {
        Schema.decodeUnknownSync(DurationFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'work_hours',
      }

      expect(() => {
        Schema.decodeUnknownSync(DurationFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof DurationFieldSchema> = {
        id: 1,
        name: 'work_hours',
        type: 'duration',
        format: 'h:mm',
      }
      expect(field.id).toBe(1)
    })
  })
})
