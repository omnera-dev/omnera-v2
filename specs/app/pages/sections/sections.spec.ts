/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { test, expect } from '@/specs/fixtures.ts'

/**
 * E2E Tests for Page Sections
 *
 * Source: specs/app/pages/sections/sections.schema.json
 * Spec Count: 14
 *
 * Test Organization:
 * 1. @spec tests - One per spec in schema (14 tests) - Exhaustive acceptance criteria
 * 2. @regression test - ONE optimized integration test - Efficient workflow validation
 */

test.describe('Page Sections', () => {
  test.fixme(
    'APP-PAGES-SECTIONS-001: should render direct component definition',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'section',
                props: { id: 'hero', className: 'min-h-screen bg-gradient' },
                children: [{ type: 'text', content: 'Welcome' }],
              },
            ],
          },
        ],
      })
      await page.goto('/')
      const section = page.locator('section[id="hero"]')
      await expect(section).toBeVisible()
      await expect(section).toHaveClass(/min-h-screen/)
      await expect(section.locator('text=Welcome')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-002: should support all component types for page building',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      const componentTypes = [
        'section',
        'container',
        'flex',
        'grid',
        'card',
        'text',
        'icon',
        'image',
        'button',
        'link',
        'timeline',
        'accordion',
        'badge',
        'customHTML',
        'video',
        'audio',
        'iframe',
        'form',
        'input',
      ]
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: componentTypes.map((type) => ({ type })),
          },
        ],
      })
      await page.goto('/')
      for (const type of componentTypes) {
        const element = page.locator(`[data-component-type="${type}"]`).first()
        await expect(element).toBeTruthy()
      }
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-003: should accept generic component properties via props.schema.json',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'section',
                props: {
                  id: 'hero-section',
                  className: 'min-h-screen bg-gradient',
                  style: { padding: '2rem' },
                  'data-analytics': 'hero',
                },
              },
            ],
          },
        ],
      })
      await page.goto('/')
      const section = page.locator('#hero-section')
      await expect(section).toHaveAttribute('data-analytics', 'hero')
      await expect(section).toHaveClass(/min-h-screen/)
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-004: should support unlimited nesting depth for component tree',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'section',
                children: [
                  {
                    type: 'container',
                    children: [
                      {
                        type: 'flex',
                        children: [
                          {
                            type: 'card',
                            children: [{ type: 'text', content: 'Deeply nested' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('text=Deeply nested')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-005: should render text content',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'text',
                props: { level: 'h1', className: 'text-6xl font-bold' },
                content: 'Welcome to Our Platform',
              },
            ],
          },
        ],
      })
      await page.goto('/')
      const heading = page.locator('h1')
      await expect(heading).toHaveText('Welcome to Our Platform')
      await expect(heading).toHaveClass(/text-6xl/)
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-006: should apply interactive behaviors from interactions.schema.json',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'button',
                content: 'Click me',
                interactions: {
                  hover: { scale: 1.05 },
                  click: { action: 'navigate', url: '/contact' },
                  entrance: { animation: 'fade-in', duration: '500ms' },
                },
              },
            ],
          },
        ],
      })
      await page.goto('/')
      const button = page.locator('button:has-text("Click me")')
      await expect(button).toBeVisible()
      await button.hover()
      await expect(button).toHaveCSS('transform', /scale/)
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-007: should adapt component for different screen sizes',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'grid',
                props: { columns: 1 },
                responsive: {
                  md: { props: { columns: 2 } },
                  lg: { props: { columns: 3 } },
                },
              },
            ],
          },
        ],
      })
      await page.goto('/')
      const grid = page.locator('[data-component-type="grid"]')
      await expect(grid).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-008: should support translated component content',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'text',
                content: 'Welcome',
                i18n: { fr: { content: 'Bienvenue' }, es: { content: 'Bienvenido' } },
              },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('text=Welcome')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-009: should reference and instantiate reusable block with variables',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            id: 'section-header',
            structure: {
              type: 'section',
              children: [{ type: 'text', props: { level: 'h2' }, content: '$title' }],
            },
          },
        ],
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [{ $ref: 'section-header', vars: { title: 'Our Features' } }],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('h2:has-text("Our Features")')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-010: should support hybrid section composition',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            id: 'cta-section',
            structure: {
              type: 'section',
              children: [{ type: 'button', content: '$buttonLabel' }],
            },
          },
        ],
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'section',
                props: { id: 'hero' },
                children: [{ type: 'text', content: 'Welcome' }],
              },
              { $ref: 'cta-section', vars: { buttonLabel: 'Get Started' } },
              { type: 'container', children: [{ type: 'text', content: 'Features' }] },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('text=Welcome')).toBeVisible()
      await expect(page.locator('button:has-text("Get Started")')).toBeVisible()
      await expect(page.locator('text=Features')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-011: should build complex layouts through component composition',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'section',
                props: { className: 'py-20' },
                children: [
                  {
                    type: 'container',
                    props: { maxWidth: 'max-w-7xl' },
                    children: [
                      {
                        type: 'flex',
                        props: { direction: 'column', gap: '4' },
                        children: [
                          {
                            type: 'grid',
                            props: { columns: 3 },
                            children: [
                              {
                                type: 'card',
                                children: [
                                  {
                                    type: 'text',
                                    props: { level: 'h3' },
                                    content: 'Feature 1',
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('h3:has-text("Feature 1")')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-012: should combine interactive, responsive, and multi-language features',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'button',
                content: 'Click me',
                props: { className: 'px-6 py-3' },
                interactions: { hover: { scale: 1.05 } },
                responsive: { md: { props: { className: 'px-8 py-4' } } },
                i18n: { fr: { content: 'Cliquez-moi' } },
              },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('button:has-text("Click me")')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-013: should support form building capabilities',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'form',
                props: { action: '/api/contact', method: 'POST' },
                children: [
                  {
                    type: 'input',
                    props: {
                      type: 'text',
                      name: 'name',
                      placeholder: 'Your name',
                      required: true,
                    },
                  },
                  {
                    type: 'input',
                    props: { type: 'email', name: 'email', placeholder: 'Your email' },
                  },
                  { type: 'button', props: { type: 'submit' }, content: 'Submit' },
                ],
              },
            ],
          },
        ],
      })
      await page.goto('/')
      const form = page.locator('form[action="/api/contact"]')
      await expect(form).toBeVisible()
      await expect(form.locator('input[name="name"]')).toBeVisible()
      await expect(form.locator('input[type="email"]')).toBeVisible()
      await expect(form.locator('button[type="submit"]')).toBeVisible()
    }
  )

  test.fixme(
    'APP-PAGES-SECTIONS-014: should support rich media content',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'image',
                props: { src: '/hero.jpg', alt: 'Hero image', width: 1200, height: 600 },
              },
              { type: 'video', props: { src: '/demo.mp4', controls: true, autoplay: false } },
              { type: 'audio', props: { src: '/podcast.mp3', controls: true } },
              {
                type: 'iframe',
                props: {
                  src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                  width: 560,
                  height: 315,
                },
              },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('img[src="/hero.jpg"]')).toBeVisible()
      await expect(page.locator('video[src="/demo.mp4"]')).toBeVisible()
      await expect(page.locator('audio[src="/podcast.mp3"]')).toBeVisible()
      await expect(page.locator('iframe[src*="youtube.com"]')).toBeVisible()
    }
  )

  test.fixme(
    'user can complete full Page Sections workflow',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      await startServerWithSchema({
        name: 'test-app',
        blocks: [
          {
            id: 'feature-card',
            structure: {
              type: 'card',
              children: [
                { type: 'icon', props: { name: '$iconName' } },
                { type: 'text', props: { level: 'h3' }, content: '$title' },
                { type: 'text', content: '$description' },
              ],
            },
          },
        ],
        pages: [
          {
            name: 'Test',
            path: '/',
            meta: { lang: 'en-US', title: 'Test', description: 'Test' },
            sections: [
              {
                type: 'section',
                props: {
                  id: 'hero',
                  className: 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100',
                },
                children: [
                  {
                    type: 'container',
                    props: { maxWidth: 'max-w-7xl' },
                    children: [
                      {
                        type: 'text',
                        props: { level: 'h1', className: 'text-6xl font-bold' },
                        content: 'Welcome to Our Platform',
                      },
                      { type: 'text', content: 'Build amazing applications with ease' },
                    ],
                  },
                ],
              },
              {
                type: 'section',
                props: { id: 'features' },
                children: [
                  {
                    type: 'grid',
                    props: { columns: 1 },
                    responsive: { md: { props: { columns: 2 } }, lg: { props: { columns: 3 } } },
                    children: [
                      {
                        $ref: 'feature-card',
                        vars: {
                          iconName: 'rocket',
                          title: 'Fast',
                          description: 'Lightning-fast performance',
                        },
                      },
                      {
                        $ref: 'feature-card',
                        vars: {
                          iconName: 'lock',
                          title: 'Secure',
                          description: 'Enterprise-grade security',
                        },
                      },
                      {
                        $ref: 'feature-card',
                        vars: {
                          iconName: 'puzzle',
                          title: 'Flexible',
                          description: 'Highly customizable',
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      })
      await page.goto('/')
      await expect(page.locator('h1:has-text("Welcome to Our Platform")')).toBeVisible()
      await expect(page.locator('h3:has-text("Fast")')).toBeVisible()
      await expect(page.locator('h3:has-text("Secure")')).toBeVisible()
      await expect(page.locator('h3:has-text("Flexible")')).toBeVisible()
    }
  )
})
