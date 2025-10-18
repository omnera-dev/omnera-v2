import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { AutonumberFieldSchema } from './autonumber-field.ts'

describe('AutonumberFieldSchema', () => {
  test('should accept valid autonumber field', () => {
    const field = {
      id: 1,
      name: 'invoice_num',
      type: 'autonumber',
      prefix: 'INV-',
      startFrom: 1000,
    }
    const result = Schema.decodeUnknownSync(AutonumberFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
