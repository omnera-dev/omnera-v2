import { describe, test, expect } from 'bun:test'
import {
  FOCUS_RING_CLASSES,
  VALIDATION_RING_CLASSES,
  COMMON_INTERACTIVE_CLASSES,
} from './variant-classes'

describe('variant-classes', () => {
  describe('FOCUS_RING_CLASSES', () => {
    test('is a non-empty string', () => {
      expect(typeof FOCUS_RING_CLASSES).toBe('string')
      expect(FOCUS_RING_CLASSES.length).toBeGreaterThan(0)
    })

    test('includes focus-visible classes', () => {
      expect(FOCUS_RING_CLASSES).toContain('focus-visible')
    })

    test('includes border class for focus', () => {
      expect(FOCUS_RING_CLASSES).toContain('focus-visible:border-ring')
    })

    test('includes ring class for focus', () => {
      expect(FOCUS_RING_CLASSES).toContain('focus-visible:ring-ring')
    })

    test('includes ring width class', () => {
      expect(FOCUS_RING_CLASSES).toContain('ring-[3px]')
    })

    test('contains proper Tailwind class structure', () => {
      // Should have classes separated by spaces
      const classes = FOCUS_RING_CLASSES.split(' ')
      expect(classes.length).toBeGreaterThan(0)
      expect(classes.every((cls) => cls.length > 0)).toBe(true)
    })
  })

  describe('VALIDATION_RING_CLASSES', () => {
    test('is a non-empty string', () => {
      expect(typeof VALIDATION_RING_CLASSES).toBe('string')
      expect(VALIDATION_RING_CLASSES.length).toBeGreaterThan(0)
    })

    test('includes aria-invalid classes', () => {
      expect(VALIDATION_RING_CLASSES).toContain('aria-invalid')
    })

    test('includes destructive border class', () => {
      expect(VALIDATION_RING_CLASSES).toContain('aria-invalid:border-destructive')
    })

    test('includes destructive ring class with opacity', () => {
      expect(VALIDATION_RING_CLASSES).toContain('aria-invalid:ring-destructive/20')
    })

    test('includes dark mode variant', () => {
      expect(VALIDATION_RING_CLASSES).toContain('dark:aria-invalid:ring-destructive')
    })

    test('contains proper Tailwind class structure', () => {
      const classes = VALIDATION_RING_CLASSES.split(' ')
      expect(classes.length).toBeGreaterThan(0)
      expect(classes.every((cls) => cls.length > 0)).toBe(true)
    })
  })

  describe('COMMON_INTERACTIVE_CLASSES', () => {
    test('is a non-empty string', () => {
      expect(typeof COMMON_INTERACTIVE_CLASSES).toBe('string')
      expect(COMMON_INTERACTIVE_CLASSES.length).toBeGreaterThan(0)
    })

    test('includes focus ring classes', () => {
      expect(COMMON_INTERACTIVE_CLASSES).toContain('focus-visible:border-ring')
      expect(COMMON_INTERACTIVE_CLASSES).toContain('focus-visible:ring-ring')
    })

    test('includes validation ring classes', () => {
      expect(COMMON_INTERACTIVE_CLASSES).toContain('aria-invalid:border-destructive')
      expect(COMMON_INTERACTIVE_CLASSES).toContain('aria-invalid:ring-destructive')
    })

    test('is a combination of focus and validation classes', () => {
      // Should contain all focus classes
      FOCUS_RING_CLASSES.split(' ').forEach((cls) => {
        expect(COMMON_INTERACTIVE_CLASSES).toContain(cls)
      })

      // Should contain all validation classes
      VALIDATION_RING_CLASSES.split(' ').forEach((cls) => {
        expect(COMMON_INTERACTIVE_CLASSES).toContain(cls)
      })
    })

    test('contains proper Tailwind class structure', () => {
      const classes = COMMON_INTERACTIVE_CLASSES.split(' ')
      expect(classes.length).toBeGreaterThan(0)
      expect(classes.every((cls) => cls.length > 0)).toBe(true)
    })
  })

  describe('class consistency', () => {
    test('all exported classes are readonly', () => {
      // TypeScript enforces this, but we can verify they are strings
      expect(typeof FOCUS_RING_CLASSES).toBe('string')
      expect(typeof VALIDATION_RING_CLASSES).toBe('string')
      expect(typeof COMMON_INTERACTIVE_CLASSES).toBe('string')
    })

    test('classes do not contain duplicate spaces', () => {
      expect(FOCUS_RING_CLASSES).not.toContain('  ')
      expect(VALIDATION_RING_CLASSES).not.toContain('  ')
      expect(COMMON_INTERACTIVE_CLASSES).not.toContain('  ')
    })

    test('classes do not start or end with spaces', () => {
      expect(FOCUS_RING_CLASSES.trim()).toBe(FOCUS_RING_CLASSES)
      expect(VALIDATION_RING_CLASSES.trim()).toBe(VALIDATION_RING_CLASSES)
      expect(COMMON_INTERACTIVE_CLASSES.trim()).toBe(COMMON_INTERACTIVE_CLASSES)
    })
  })

  describe('Tailwind class validity', () => {
    test('focus ring classes use valid Tailwind prefixes', () => {
      const validPrefixes = ['focus-visible:', 'ring-']
      const classes = FOCUS_RING_CLASSES.split(' ')

      classes.forEach((cls) => {
        const hasValidPrefix = validPrefixes.some((prefix) => cls.includes(prefix))
        expect(hasValidPrefix).toBe(true)
      })
    })

    test('validation ring classes use valid Tailwind prefixes', () => {
      const validPrefixes = ['aria-invalid:', 'dark:']
      const classes = VALIDATION_RING_CLASSES.split(' ')

      classes.forEach((cls) => {
        const hasValidPrefix = validPrefixes.some((prefix) => cls.includes(prefix))
        expect(hasValidPrefix).toBe(true)
      })
    })

    test('no classes contain invalid characters', () => {
      const allClasses = [FOCUS_RING_CLASSES, VALIDATION_RING_CLASSES, COMMON_INTERACTIVE_CLASSES]

      allClasses.forEach((classString) => {
        // Should only contain alphanumeric, hyphens, colons, slashes, brackets, and spaces
        expect(classString).toMatch(/^[a-z0-9\-:\/\[\]\s]+$/i)
      })
    })
  })

  describe('usage in components', () => {
    test('focus ring classes can be concatenated with other classes', () => {
      const combined = `${FOCUS_RING_CLASSES} border-2 rounded-md`
      expect(combined).toContain('focus-visible')
      expect(combined).toContain('border-2')
      expect(combined).toContain('rounded-md')
    })

    test('validation ring classes can be concatenated with other classes', () => {
      const combined = `${VALIDATION_RING_CLASSES} p-2 text-sm`
      expect(combined).toContain('aria-invalid')
      expect(combined).toContain('p-2')
      expect(combined).toContain('text-sm')
    })

    test('common interactive classes can be used directly', () => {
      const elementClasses = `input ${COMMON_INTERACTIVE_CLASSES}`
      expect(elementClasses).toContain('input')
      expect(elementClasses).toContain('focus-visible')
      expect(elementClasses).toContain('aria-invalid')
    })
  })

  describe('accessibility', () => {
    test('focus ring classes support keyboard navigation', () => {
      // focus-visible only shows on keyboard focus, not mouse click
      expect(FOCUS_RING_CLASSES).toContain('focus-visible')
      expect(FOCUS_RING_CLASSES).not.toContain('focus:') // Should not use regular focus
    })

    test('validation classes use aria-invalid attribute', () => {
      // Uses aria-invalid for semantic validation state
      expect(VALIDATION_RING_CLASSES).toContain('aria-invalid')
    })

    test('dark mode is supported for validation', () => {
      // Ensures validation is visible in dark mode
      expect(VALIDATION_RING_CLASSES).toContain('dark:')
    })
  })
})
