/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, expect, test } from 'bun:test'
import { buildFlexClasses, buildGridClasses } from './class-builders'
import type { Theme } from '@/domain/models/app/theme'

describe('Class Builders', () => {
  describe('buildFlexClasses', () => {
    test('returns base flex class when no props provided', () => {
      const result = buildFlexClasses()
      expect(result).toBe('flex')
    })

    test('returns base flex class when empty props provided', () => {
      const result = buildFlexClasses({})
      expect(result).toBe('flex')
    })

    test('adds items-start class when align is start', () => {
      const result = buildFlexClasses({ align: 'start' })
      expect(result).toBe('flex items-start')
    })

    test('adds items-center class when align is center', () => {
      const result = buildFlexClasses({ align: 'center' })
      expect(result).toBe('flex items-center')
    })

    test('adds items-end class when align is end', () => {
      const result = buildFlexClasses({ align: 'end' })
      expect(result).toBe('flex items-end')
    })

    test('does not add alignment class for invalid align value', () => {
      const result = buildFlexClasses({ align: 'invalid' })
      expect(result).toBe('flex')
    })

    test('adds gap class when gap is a number', () => {
      const result = buildFlexClasses({ gap: 4 })
      expect(result).toBe('flex gap-4')
    })

    test('adds gap class for various numeric values', () => {
      expect(buildFlexClasses({ gap: 0 })).toBe('flex gap-0')
      expect(buildFlexClasses({ gap: 2 })).toBe('flex gap-2')
      expect(buildFlexClasses({ gap: 8 })).toBe('flex gap-8')
      expect(buildFlexClasses({ gap: 16 })).toBe('flex gap-16')
    })

    test('does not add gap class when gap is not a number', () => {
      expect(buildFlexClasses({ gap: '4' })).toBe('flex')
      expect(buildFlexClasses({ gap: 'large' })).toBe('flex')
      expect(buildFlexClasses({ gap: true })).toBe('flex')
    })

    test('combines alignment and gap classes', () => {
      const result = buildFlexClasses({ align: 'center', gap: 4 })
      expect(result).toBe('flex items-center gap-4')
    })

    test('handles all valid combinations', () => {
      expect(buildFlexClasses({ align: 'start', gap: 2 })).toBe('flex items-start gap-2')
      expect(buildFlexClasses({ align: 'center', gap: 4 })).toBe('flex items-center gap-4')
      expect(buildFlexClasses({ align: 'end', gap: 8 })).toBe('flex items-end gap-8')
    })

    test('ignores extra props', () => {
      const result = buildFlexClasses({
        align: 'center',
        gap: 4,
        someOtherProp: 'value',
        anotherProp: 123,
      })
      expect(result).toBe('flex items-center gap-4')
    })
  })

  describe('buildGridClasses', () => {
    test('returns base grid class when no theme provided', () => {
      const result = buildGridClasses()
      expect(result).toBe('grid')
    })

    test('returns base grid class when theme has no breakpoints', () => {
      const theme: Theme = {}
      const result = buildGridClasses(theme)
      expect(result).toBe('grid')
    })

    test('returns base grid class when breakpoints exist but no md', () => {
      const theme: Theme = {
        breakpoints: {
          sm: '640px',
          lg: '1024px',
        },
      }
      const result = buildGridClasses(theme)
      expect(result).toBe('grid')
    })

    test('adds md:grid-cols-2 class when md breakpoint exists', () => {
      const theme: Theme = {
        breakpoints: {
          md: '768px',
        },
      }
      const result = buildGridClasses(theme)
      expect(result).toBe('grid md:grid-cols-2')
    })

    test('adds md:grid-cols-2 class when multiple breakpoints exist', () => {
      const theme: Theme = {
        breakpoints: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      }
      const result = buildGridClasses(theme)
      expect(result).toBe('grid md:grid-cols-2')
    })

    test('handles md breakpoint with any truthy value', () => {
      // Any truthy value for md should work
      const theme1: Theme = { breakpoints: { md: '768px' } }
      expect(buildGridClasses(theme1)).toBe('grid md:grid-cols-2')

      const theme2: Theme = { breakpoints: { md: '1px' } }
      expect(buildGridClasses(theme2)).toBe('grid md:grid-cols-2')
    })
  })
})
