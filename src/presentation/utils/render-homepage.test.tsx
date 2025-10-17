import { describe, test, expect } from 'bun:test'
import { renderHomePage } from './render-homepage'
import type { App } from '@/domain/models/app'

describe('renderHomePage', () => {
  describe('HTML structure', () => {
    test('returns HTML string with DOCTYPE', () => {
      const app: App = {
        name: 'Test App',
        description: 'Test Description',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      expect(html).toStartWith('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('</html>')
    })

    test('includes app name in rendered HTML', () => {
      const app: App = {
        name: 'My Awesome App',
        description: 'A great description',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      expect(html).toContain('My Awesome App')
    })

    test('includes app description in rendered HTML', () => {
      const app: App = {
        name: 'Test App',
        description: 'This is a test description',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      expect(html).toContain('This is a test description')
    })

    test('renders valid HTML structure', () => {
      const app: App = {
        name: 'Test App',
        description: 'Test Description',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      // Should have head and body tags
      expect(html).toContain('<head')
      expect(html).toContain('</head>')
      expect(html).toContain('<body')
      expect(html).toContain('</body>')
    })
  })

  describe('app data handling', () => {
    test('handles app with only required name field', () => {
      const app: App = {
        name: 'Minimal App',
        description: undefined as unknown as string, // Force to test minimal case
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      expect(html).toContain('Minimal App')
      expect(html).toStartWith('<!DOCTYPE html>')
    })

    test('handles app with special characters in name', () => {
      const app: App = {
        name: 'App & Co. <Special>',
        description: 'Test',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      // React/renderToString should escape special characters
      expect(html).toBeDefined()
      expect(html).toContain('App')
    })

    test('handles app with special characters in description', () => {
      const app: App = {
        name: 'Test App',
        description: 'Description with <script>alert("XSS")</script>',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      // React should escape the script tag
      expect(html).toBeDefined()
      expect(html).not.toContain('<script>alert')
    })

    test('handles app with long description', () => {
      const app: App = {
        name: 'Test App',
        description: 'A'.repeat(1000),
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      expect(html).toStartWith('<!DOCTYPE html>')
      expect(html).toContain('A')
    })
  })

  describe('CSS and metadata', () => {
    test('includes CSS link tag for output.css', () => {
      const app: App = {
        name: 'Test App',
        description: 'Test Description',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      expect(html).toContain('/output.css')
    })

    test('includes proper meta tags', () => {
      const app: App = {
        name: 'Test App',
        description: 'Test Description',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      // Should have viewport meta tag
      expect(html).toContain('viewport')
    })

    test('includes title tag with app name', () => {
      const app: App = {
        name: 'My Special App',
        description: 'Test',
        version: '1.0.0',
      }

      const html = renderHomePage(app)

      expect(html).toContain('<title')
      expect(html).toContain('My Special App')
    })
  })

  describe('consistency', () => {
    test('produces consistent output for same input', () => {
      const app: App = {
        name: 'Test App',
        description: 'Test Description',
        version: '1.0.0',
      }

      const html1 = renderHomePage(app)
      const html2 = renderHomePage(app)

      expect(html1).toBe(html2)
    })

    test('produces different output for different apps', () => {
      const app1: App = {
        name: 'App One',
        description: 'First app',
        version: '1.0.0',
      }

      const app2: App = {
        name: 'App Two',
        description: 'Second app',
        version: '1.0.0',
      }

      const html1 = renderHomePage(app1)
      const html2 = renderHomePage(app2)

      expect(html1).not.toBe(html2)
      expect(html1).toContain('App One')
      expect(html2).toContain('App Two')
    })
  })
})
