/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { BarcodeFieldSchema } from './barcode-field'

describe('BarcodeFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid barcode field', () => {
      const field = {
        id: 1,
        name: 'product_barcode',
        type: 'barcode' as const,
      }

      const result = Schema.decodeSync(BarcodeFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept barcode field with all optional properties', () => {
      const field = {
        id: 1,
        name: 'product_barcode',
        type: 'barcode' as const,
        required: true,
        format: 'EAN-13',
      }

      const result = Schema.decodeSync(BarcodeFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept barcode field with QR code format', () => {
      const field = {
        id: 1,
        name: 'asset_code',
        type: 'barcode' as const,
        format: 'QR',
      }

      const result = Schema.decodeSync(BarcodeFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'product_barcode',
        type: 'barcode' as const,
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: id
        Schema.decodeSync(BarcodeFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'product_barcode',
      }

      expect(() => {
        // @ts-expect-error - Testing missing required property: type
        Schema.decodeSync(BarcodeFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof BarcodeFieldSchema> = {
        id: 1,
        name: 'product_barcode',
        type: 'barcode' as const,
        format: 'EAN-13',
      }
      expect(field.id).toBe(1)
    })
  })
})
