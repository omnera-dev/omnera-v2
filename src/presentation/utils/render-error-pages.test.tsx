import { describe, test, expect } from 'bun:test'
import { renderNotFoundPage, renderErrorPage } from './render-error-pages'

describe('renderNotFoundPage', () => {
  describe('HTML structure', () => {
    test('returns HTML string with DOCTYPE', () => {
      const html = renderNotFoundPage()

      expect(html).toStartWith('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('</html>')
    })

    test('renders valid HTML structure', () => {
      const html = renderNotFoundPage()

      // Should have head and body tags
      expect(html).toContain('<head')
      expect(html).toContain('</head>')
      expect(html).toContain('<body')
      expect(html).toContain('</body>')
    })

    test('includes 404 or Not Found message', () => {
      const html = renderNotFoundPage()

      // Should mention 404 or "not found" somewhere
      const lowerHtml = html.toLowerCase()
      expect(lowerHtml).toMatch(/404|not found/)
    })
  })

  describe('CSS and metadata', () => {
    test('includes CSS link tag for output.css', () => {
      const html = renderNotFoundPage()

      expect(html).toContain('/output.css')
    })

    test('includes proper meta tags', () => {
      const html = renderNotFoundPage()

      // Should have viewport meta tag
      expect(html).toContain('viewport')
    })

    test('includes title tag', () => {
      const html = renderNotFoundPage()

      expect(html).toContain('<title')
    })
  })

  describe('consistency', () => {
    test('produces consistent output', () => {
      const html1 = renderNotFoundPage()
      const html2 = renderNotFoundPage()

      expect(html1).toBe(html2)
    })

    test('is a complete HTML document', () => {
      const html = renderNotFoundPage()

      expect(html).toStartWith('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('</html>')
      expect(html.length).toBeGreaterThan(100) // Should be substantial
    })
  })
})

describe('renderErrorPage', () => {
  describe('HTML structure', () => {
    test('returns HTML string with DOCTYPE', () => {
      const html = renderErrorPage()

      expect(html).toStartWith('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('</html>')
    })

    test('renders valid HTML structure', () => {
      const html = renderErrorPage()

      // Should have head and body tags
      expect(html).toContain('<head')
      expect(html).toContain('</head>')
      expect(html).toContain('<body')
      expect(html).toContain('</body>')
    })

    test('includes 500 or error message', () => {
      const html = renderErrorPage()

      // Should mention 500 or "error" somewhere
      const lowerHtml = html.toLowerCase()
      expect(lowerHtml).toMatch(/500|error/)
    })
  })

  describe('CSS and metadata', () => {
    test('includes CSS link tag for output.css', () => {
      const html = renderErrorPage()

      expect(html).toContain('/output.css')
    })

    test('includes proper meta tags', () => {
      const html = renderErrorPage()

      // Should have viewport meta tag
      expect(html).toContain('viewport')
    })

    test('includes title tag', () => {
      const html = renderErrorPage()

      expect(html).toContain('<title')
    })
  })

  describe('consistency', () => {
    test('produces consistent output', () => {
      const html1 = renderErrorPage()
      const html2 = renderErrorPage()

      expect(html1).toBe(html2)
    })

    test('is a complete HTML document', () => {
      const html = renderErrorPage()

      expect(html).toStartWith('<!DOCTYPE html>')
      expect(html).toContain('<html')
      expect(html).toContain('</html>')
      expect(html.length).toBeGreaterThan(100) // Should be substantial
    })
  })
})

describe('error pages comparison', () => {
  test('404 and 500 pages are different', () => {
    const notFoundHtml = renderNotFoundPage()
    const errorHtml = renderErrorPage()

    expect(notFoundHtml).not.toBe(errorHtml)
  })

  test('both error pages include CSS link', () => {
    const notFoundHtml = renderNotFoundPage()
    const errorHtml = renderErrorPage()

    expect(notFoundHtml).toContain('/output.css')
    expect(errorHtml).toContain('/output.css')
  })

  test('both error pages have proper DOCTYPE', () => {
    const notFoundHtml = renderNotFoundPage()
    const errorHtml = renderErrorPage()

    expect(notFoundHtml).toStartWith('<!DOCTYPE html>')
    expect(errorHtml).toStartWith('<!DOCTYPE html>')
  })

  test('both error pages have complete HTML structure', () => {
    const notFoundHtml = renderNotFoundPage()
    const errorHtml = renderErrorPage()

    expect(notFoundHtml).toContain('<html')
    expect(notFoundHtml).toContain('</html>')
    expect(errorHtml).toContain('<html')
    expect(errorHtml).toContain('</html>')
  })
})
