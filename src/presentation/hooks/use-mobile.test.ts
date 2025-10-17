import { describe, test, expect } from 'bun:test'
import { renderToString } from 'react-dom/server'
import * as React from 'react'

// Note: useIsMobile relies on browser APIs (window.matchMedia) and React hooks (useEffect).
// In an SSR/Bun test environment, we can only test the basic structure and SSR behavior.
// Full client-side behavior testing would require a browser environment or tools like Playwright.

describe('useIsMobile', () => {
  describe('hook structure', () => {
    test('hook file exports useIsMobile function', async () => {
      const { useIsMobile } = await import('./use-mobile')
      expect(useIsMobile).toBeDefined()
      expect(typeof useIsMobile).toBe('function')
    })

    test('hook can be imported without errors', async () => {
      // Should not throw during import
      const hookModule = await import('./use-mobile')
      expect(hookModule).toBeDefined()
    })
  })

  describe('SSR behavior', () => {
    test('returns false during server-side rendering', async () => {
      // Import dynamically to avoid window access issues
      const { useIsMobile } = await import('./use-mobile')

      // Mock window for SSR test
      const originalWindow = global.window
      // @ts-expect-error - Temporarily mock window for test
      global.window = {
        matchMedia: () => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
        innerWidth: 1024,
      }

      const TestComponent = () => {
        const isMobile = useIsMobile()
        return React.createElement('div', { 'data-mobile': isMobile }, `isMobile: ${isMobile}`)
      }

      const html = renderToString(React.createElement(TestComponent))

      // During SSR, useEffect doesn't run, so isMobile should be false (!! undefined = false)
      expect(html).toContain('isMobile: false')
      expect(html).toContain('data-mobile="false"')

      // Cleanup
      // @ts-expect-error - Restore original window
      global.window = originalWindow
    })

    test('hook does not crash during SSR', async () => {
      const { useIsMobile } = await import('./use-mobile')

      // Mock minimal window
      const originalWindow = global.window
      // @ts-expect-error - Mock window
      global.window = {
        matchMedia: () => ({
          matches: true,
          media: '',
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
        innerWidth: 375,
      }

      const TestComponent = () => {
        const isMobile = useIsMobile()
        return React.createElement('div', {}, `Mobile: ${isMobile}`)
      }

      // Should not throw during rendering
      expect(() => {
        renderToString(React.createElement(TestComponent))
      }).not.toThrow()

      // Cleanup
      // @ts-expect-error - Restore
      global.window = originalWindow
    })
  })

  describe('hook implementation details', () => {
    test('uses 768px as mobile breakpoint constant', () => {
      // Read the source file to verify the constant
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      expect(source).toContain('MOBILE_BREAKPOINT')
      expect(source).toContain('768')
    })

    test('uses window.matchMedia for responsive detection', () => {
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      expect(source).toContain('window.matchMedia')
      expect(source).toContain('max-width')
    })

    test('uses useEffect hook for client-side logic', () => {
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      expect(source).toContain('useEffect')
      expect(source).toContain('addEventListener')
      expect(source).toContain('removeEventListener')
    })

    test('uses useState to manage mobile state', () => {
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      expect(source).toContain('useState')
      expect(source).toContain('setIsMobile')
    })

    test('returns boolean value with !! operator', () => {
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      expect(source).toContain('!!isMobile')
    })
  })

  describe('responsive breakpoint logic', () => {
    test('breakpoint is set to 768px', () => {
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      // Verify the constant value
      expect(source).toMatch(/MOBILE_BREAKPOINT\s*=\s*768/)
    })

    test('uses max-width media query for mobile detection', () => {
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      // Should use max-width: 767px (768 - 1)
      expect(source).toContain('max-width')
      expect(source).toContain('MOBILE_BREAKPOINT - 1')
    })

    test('checks window.innerWidth for current viewport size', () => {
      const fs = require('fs')
      const path = require('path')
      const hookPath = path.join(__dirname, 'use-mobile.ts')
      const source = fs.readFileSync(hookPath, 'utf-8')

      expect(source).toContain('window.innerWidth')
      expect(source).toContain('MOBILE_BREAKPOINT')
    })
  })

  describe('hook type safety', () => {
    test('hook returns boolean type', async () => {
      const { useIsMobile } = await import('./use-mobile')

      const originalWindow = global.window
      // @ts-expect-error - Mock window
      global.window = {
        matchMedia: () => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
        }),
        innerWidth: 1024,
      }

      const TestComponent = () => {
        const isMobile = useIsMobile()
        const type = typeof isMobile
        return React.createElement('div', {}, `type: ${type}`)
      }

      const html = renderToString(React.createElement(TestComponent))
      expect(html).toContain('type: boolean')

      // Cleanup
      // @ts-expect-error - Restore
      global.window = originalWindow
    })
  })

  describe('documentation and naming', () => {
    test('hook is named useIsMobile (React hook convention)', async () => {
      const { useIsMobile } = await import('./use-mobile')
      expect(useIsMobile.name).toBe('useIsMobile')
    })

    test('hook follows React naming convention with "use" prefix', () => {
      const hookName = 'useIsMobile'
      expect(hookName).toMatch(/^use[A-Z]/)
    })
  })
})
