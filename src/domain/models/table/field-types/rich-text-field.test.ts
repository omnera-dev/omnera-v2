import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { RichTextFieldSchema } from './rich-text-field.ts'

describe('RichTextFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid rich-text field', () => {
      const field = {
        id: 1,
        name: 'article_content',
        type: 'rich-text',
      }

      const result = Schema.decodeUnknownSync(RichTextFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept rich-text field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'article_content',
        type: 'rich-text',
        required: true,
        maxLength: 10000,
      }

      const result = Schema.decodeUnknownSync(RichTextFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept rich-text field with maxLength', () => {
      const field = {
        id: 1,
        name: 'description',
        type: 'rich-text',
        maxLength: 5000,
      }

      const result = Schema.decodeUnknownSync(RichTextFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'article_content',
        type: 'rich-text',
      }

      expect(() => {
        Schema.decodeUnknownSync(RichTextFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field with maxLength of 0', () => {
      const field = {
        id: 1,
        name: 'content',
        type: 'rich-text',
        maxLength: 0,
      }

      expect(() => {
        Schema.decodeUnknownSync(RichTextFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof RichTextFieldSchema> = {
        id: 1,
        name: 'article_content',
        type: 'rich-text',
        maxLength: 10000,
      }
      expect(field.id).toBe(1)
    })
  })
})
