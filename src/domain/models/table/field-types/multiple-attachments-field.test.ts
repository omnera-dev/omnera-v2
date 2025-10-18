import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { MultipleAttachmentsFieldSchema } from './multiple-attachments-field.ts'

describe('MultipleAttachmentsFieldSchema', () => {
  test('should accept valid multiple-attachments field', () => {
    const field = { id: 1, name: 'documents', type: 'multiple-attachments', maxFiles: 5 }
    const result = Schema.decodeUnknownSync(MultipleAttachmentsFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
