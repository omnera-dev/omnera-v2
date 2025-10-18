import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { FormulaFieldSchema } from './formula-field.ts'

describe('FormulaFieldSchema', () => {
  test('should accept valid formula field', () => {
    const field = { id: 1, name: 'total', type: 'formula', formula: 'price * quantity' }
    const result = Schema.decodeUnknownSync(FormulaFieldSchema)(field)
    expect(result).toEqual(field)
  })
})
