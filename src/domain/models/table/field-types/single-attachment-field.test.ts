import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { SingleAttachmentFieldSchema } from './single-attachment-field'

describe('SingleAttachmentFieldSchema', () => {
  test('should accept valid single-attachment field', () => {
    const field = { id: 1, name: 'profile_pic', type: 'single-attachment' }
    const result = Schema.decodeUnknownSync(SingleAttachmentFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
