/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { GeolocationFieldSchema } from './geolocation-field'

describe('GeolocationFieldSchema', () => {
  describe('valid values', () => {
    test('should accept valid geolocation field', () => {
      const field = {
        id: 1,
        name: 'office_location',
        type: 'geolocation' as const,
      }

      const result = Schema.decodeSync(GeolocationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept geolocation field with required flag', () => {
      const field = {
        id: 1,
        name: 'office_location',
        type: 'geolocation' as const,
        required: true,
      }

      const result = Schema.decodeSync(GeolocationFieldSchema)(field)
      expect(result).toEqual(field)
    })

    test('should accept geolocation field with optional flag', () => {
      const field = {
        id: 1,
        name: 'delivery_location',
        type: 'geolocation' as const,
        required: false,
      }

      const result = Schema.decodeSync(GeolocationFieldSchema)(field)
      expect(result).toEqual(field)
    })
  })

  describe('invalid values', () => {
    test('should reject field without id', () => {
      const field = {
        name: 'office_location',
        type: 'geolocation' as const,
      }

      expect(() => {
        Schema.decodeSync(GeolocationFieldSchema)(field)
      }).toThrow()
    })

    test('should reject field without type', () => {
      const field = {
        id: 1,
        name: 'office_location',
      }

      expect(() => {
        Schema.decodeSync(GeolocationFieldSchema)(field)
      }).toThrow()
    })
  })

  describe('type inference', () => {
    test('should infer correct TypeScript type', () => {
      const field: Schema.Schema.Type<typeof GeolocationFieldSchema> = {
        id: 1,
        name: 'office_location',
        type: 'geolocation' as const,
        required: true,
      }
      expect(field.id).toBe(1)
    })
  })
})
