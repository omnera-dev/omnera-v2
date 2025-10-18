import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { RelationshipFieldSchema } from './relationship-field'

describe('RelationshipFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid relationship field', () => {
      const field = {
        id: 1,
        name: 'author',
        type: 'relationship',
        relatedTable: 'users',
        relationType: 'many-to-one',
      }

      const result = Schema.decodeUnknownSync(RelationshipFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without relatedTable', () => {
      const field = {
        id: 1,
        name: 'author',
        type: 'relationship',
        relationType: 'many-to-one',
      }

      expect(() => {
        Schema.decodeUnknownSync(RelationshipFieldSchema)(field)
      }).toThrow()
    })
  })
})
