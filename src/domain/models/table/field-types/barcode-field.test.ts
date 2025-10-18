import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { BarcodeFieldSchema } from './barcode-field.ts'

describe('BarcodeFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid barcode field', () => {
      const field = {
        id: 1,
        name: 'product_barcode',
        type: 'barcode',
      }

      const result = Schema.decodeUnknownSync(BarcodeFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept barcode field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'product_barcode',
        type: 'barcode',
        required: true,
        format: 'EAN-13',
      }

      const result = Schema.decodeUnknownSync(BarcodeFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept barcode field with QR code format', () => {
      const field = {
        id: 1,
        name: 'asset_code',
        type: 'barcode',
        format: 'QR',
      }

      const result = Schema.decodeUnknownSync(BarcodeFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'product_barcode',
        type: 'barcode',
      }

      expect(() => {
        Schema.decodeUnknownSync(BarcodeFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'product_barcode',
      }

      expect(() => {
        Schema.decodeUnknownSync(BarcodeFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof BarcodeFieldSchema> = {
        id: 1,
        name: 'product_barcode',
        type: 'barcode',
        format: 'EAN-13',
      }
      expect(field.id).toBe(1)
    })
  })
})
