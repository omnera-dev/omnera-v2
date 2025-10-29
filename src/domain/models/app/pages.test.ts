/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { describe, expect, test } from 'bun:test'
import { Schema } from 'effect'
import { PageSchema, PagesSchema } from './pages'

describe('PageSchema', () => {
  test('should accept page with required properties only', () => {
    // GIVEN: Minimal page with name, path, meta, sections
    const page = {
      name: 'home',
      path: '/',
      meta: {
        lang: 'en-US',
        title: 'Home Page',
        description: 'Welcome to our homepage',
      },
      sections: [],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Minimal page should be accepted
    expect(result.name).toBe('home')
    expect(result.path).toBe('/')
    expect(result.meta.title).toBe('Home Page')
    expect(result.sections).toEqual([])
  })

  test('should accept page with all optional properties', () => {
    // GIVEN: Complete page with id, layout, and scripts
    const page = {
      id: 1,
      name: 'home',
      path: '/',
      meta: {
        lang: 'en-US',
        title: 'Welcome',
        description: 'Welcome to our platform',
      },
      layout: {
        navigation: {
          logo: '/logo.svg',
          links: {
            desktop: [
              {
                label: 'Home',
                href: '/',
              },
            ],
          },
        },
      },
      sections: [],
      scripts: {
        features: {
          analytics: true,
        },
      },
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Complete page should be accepted
    expect(result.id).toBe(1)
    expect(result.layout.navigation.logo).toBe('/logo.svg')
    expect(result.scripts.features.analytics).toBe(true)
  })

  test('should accept home path', () => {
    // GIVEN: Page with root path
    const page = {
      name: 'home',
      path: '/',
      meta: {
        lang: 'en-US',
        title: 'Home',
        description: 'Homepage',
      },
      sections: [],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Root path should be accepted
    expect(result.path).toBe('/')
  })

  test('should accept nested path', () => {
    // GIVEN: Page with nested URL path
    const page = {
      name: 'pricing',
      path: '/products/pricing',
      meta: {
        lang: 'en-US',
        title: 'Pricing',
        description: 'Product pricing',
      },
      sections: [],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Nested path should be accepted
    expect(result.path).toBe('/products/pricing')
  })

  test('should accept page with sections containing direct components', () => {
    // GIVEN: Page with direct component definitions
    const page = {
      name: 'simple',
      path: '/simple',
      meta: {
        lang: 'en-US',
        title: 'Simple Page',
        description: 'Simple page',
      },
      sections: [
        {
          type: 'section',
          props: {
            id: 'hero',
          },
        },
      ],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Direct component sections should be accepted
    expect(result.sections).toHaveLength(1)
    expect(result.sections[0].type).toBe('section')
  })

  test('should accept page with layout configuration', () => {
    // GIVEN: Page with complete layout
    const page = {
      name: 'full_layout',
      path: '/full',
      meta: {
        lang: 'en-US',
        title: 'Full Layout',
        description: 'Full layout page',
      },
      layout: {
        banner: {
          enabled: true,
          message: 'New feature available!',
          variant: 'info',
        },
        navigation: {
          logo: '/logo.svg',
          links: {
            desktop: [
              {
                label: 'Home',
                href: '/',
              },
            ],
          },
        },
        footer: {
          enabled: true,
          copyright: '© 2025 Company',
        },
        sidebar: {
          enabled: true,
          collapsible: true,
          defaultCollapsed: false,
          position: 'left',
        },
      },
      sections: [],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Layout configuration should be accepted
    expect(result.layout?.banner?.enabled).toBe(true)
    expect(result.layout?.navigation?.logo).toBe('/logo.svg')
    expect(result.layout?.footer?.enabled).toBe(true)
    expect(result.layout?.sidebar?.position).toBe('left')
  })

  test('should accept page with scripts configuration', () => {
    // GIVEN: Page with scripts and features
    const page = {
      name: 'interactive',
      path: '/interactive',
      meta: {
        lang: 'en-US',
        title: 'Interactive',
        description: 'Interactive page',
      },
      sections: [],
      scripts: {
        features: {
          analytics: true,
          chatWidget: true,
        },
      },
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Scripts configuration should be accepted
    expect(result.scripts.features.analytics).toBe(true)
    expect(result.scripts.features.chatWidget).toBe(true)
  })

  test('should accept page with comprehensive metadata', () => {
    // GIVEN: Page with SEO, social, structured data, and analytics
    const page = {
      name: 'product_page',
      path: '/product',
      meta: {
        lang: 'en-US',
        title: 'Amazing Product',
        description: 'The best product ever',
        keywords: 'product, amazing, best',
        author: 'Company',
        canonical: 'https://example.com/product',
        openGraph: {
          title: 'Amazing Product',
          description: 'The best product',
          type: 'website',
          url: 'https://example.com/product',
          image: 'https://example.com/og-image.jpg',
        },
        twitter: {
          card: 'summary_large_image',
          title: 'Amazing Product',
          description: 'The best product',
          image: 'https://example.com/twitter-image.jpg',
          site: '@company',
        },
        analytics: {
          providers: [
            {
              name: 'google',
              enabled: true,
              config: {
                trackingId: 'G-XXXXXXXXXX',
              },
            },
          ],
        },
      },
      sections: [],
    }

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PageSchema)(page)

    // THEN: Comprehensive metadata should be accepted
    expect(result.meta.title).toBe('Amazing Product')
    expect(result.meta.openGraph.type).toBe('website')
    expect(result.meta.twitter.card).toBe('summary_large_image')
    expect(result.meta.analytics.providers[0].name).toBe('google')
  })
})

describe('PagesSchema', () => {
  test('should accept pages array with single page', () => {
    // GIVEN: Array with one page
    const pages = [
      {
        name: 'home',
        path: '/',
        meta: {
          lang: 'en-US',
          title: 'Home',
          description: 'Homepage',
        },
        sections: [],
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PagesSchema)(pages)

    // THEN: Single-page array should be accepted
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('home')
  })

  test('should accept multiple pages in array', () => {
    // GIVEN: Array with multiple pages
    const pages = [
      {
        name: 'home',
        path: '/',
        meta: {
          lang: 'en-US',
          title: 'Home',
          description: 'Homepage',
        },
        sections: [],
      },
      {
        name: 'about',
        path: '/about',
        meta: {
          lang: 'en-US',
          title: 'About',
          description: 'About us',
        },
        sections: [],
      },
      {
        name: 'pricing',
        path: '/pricing',
        meta: {
          lang: 'en-US',
          title: 'Pricing',
          description: 'Our pricing',
        },
        sections: [],
      },
      {
        name: 'contact',
        path: '/contact',
        meta: {
          lang: 'en-US',
          title: 'Contact',
          description: 'Contact us',
        },
        sections: [],
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PagesSchema)(pages)

    // THEN: Multi-page array should be accepted
    expect(result).toHaveLength(4)
    expect(result[0].name).toBe('home')
    expect(result[1].name).toBe('about')
    expect(result[2].name).toBe('pricing')
    expect(result[3].name).toBe('contact')
  })

  test('should reject empty pages array', () => {
    // GIVEN: Empty pages array
    const pages = []

    // WHEN: Schema validation is performed
    // THEN: Should reject (minItems: 1)
    expect(() => Schema.decodeUnknownSync(PagesSchema)(pages)).toThrow()
  })

  test('should accept pages with different locales', () => {
    // GIVEN: Pages for different languages
    const pages = [
      {
        name: 'home_english',
        path: '/',
        meta: {
          lang: 'en',
          title: 'Welcome',
          description: 'Welcome to our platform',
        },
        sections: [],
      },
      {
        name: 'home_french',
        path: '/fr',
        meta: {
          lang: 'fr',
          title: 'Bienvenue',
          description: 'Bienvenue sur notre plateforme',
        },
        sections: [],
      },
      {
        name: 'home_spanish',
        path: '/es',
        meta: {
          lang: 'es',
          title: 'Bienvenido',
          description: 'Bienvenido a nuestra plataforma',
        },
        sections: [],
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PagesSchema)(pages)

    // THEN: Multi-locale pages should be accepted
    expect(result).toHaveLength(3)
    expect(result[0].meta.lang).toBe('en')
    expect(result[1].meta.lang).toBe('fr')
    expect(result[2].meta.lang).toBe('es')
  })

  test('should accept pages with mixed configurations', () => {
    // GIVEN: Pages with different configurations
    const pages = [
      {
        name: 'home',
        path: '/',
        meta: {
          lang: 'en-US',
          title: 'Home',
          description: 'Homepage',
        },
        sections: [],
      },
      {
        id: 1,
        name: 'about',
        path: '/about',
        meta: {
          lang: 'en-US',
          title: 'About',
          description: 'About us',
        },
        layout: {
          navigation: {
            logo: '/logo.svg',
            links: {
              desktop: [],
            },
          },
        },
        sections: [],
      },
      {
        name: 'contact',
        path: '/contact',
        meta: {
          lang: 'en-US',
          title: 'Contact',
          description: 'Contact us',
        },
        sections: [],
        scripts: {
          features: {
            analytics: true,
          },
        },
      },
    ]

    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(PagesSchema)(pages)

    // THEN: Mixed configurations should be accepted
    expect(result).toHaveLength(3)
    expect(result[0].id).toBeUndefined()
    expect(result[1].id).toBe(1)
    expect(result[1].layout).toBeDefined()
    expect(result[2].scripts).toBeDefined()
  })
})
