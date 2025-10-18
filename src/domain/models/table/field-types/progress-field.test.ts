import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { ProgressFieldSchema } from './progress-field.ts'

describe('ProgressFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid progress field', () => {
      const field = {
        id: 1,
        name: 'task_completion',
        type: 'progress',
      }

      const result = Schema.decodeUnknownSync(ProgressFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept progress field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'task_completion',
        type: 'progress',
        required: true,
        color: '#10B981',
      }

      const result = Schema.decodeUnknownSync(ProgressFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept progress field with custom color', () => {
      const field = {
        id: 1,
        name: 'project_progress',
        type: 'progress',
        color: '#3B82F6',
      }

      const result = Schema.decodeUnknownSync(ProgressFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'task_completion',
        type: 'progress',
      }

      expect(() => {
        Schema.decodeUnknownSync(ProgressFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with invalid hex color', () => {
      const field = {
        id: 1,
        name: 'progress',
        type: 'progress',
        color: 'blue',
      }

      expect(() => {
        Schema.decodeUnknownSync(ProgressFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with short hex color', () => {
      const field = {
        id: 1,
        name: 'progress',
        type: 'progress',
        color: '#FFF',
      }

      expect(() => {
        Schema.decodeUnknownSync(ProgressFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof ProgressFieldSchema> = {
        id: 1,
        name: 'task_completion',
        type: 'progress',
        color: '#10B981',
      }
      expect(field.id).toBe(1)
    })
  })
})
