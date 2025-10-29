/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { SocialPlatformSchema, FooterSchema } from './footer'

describe('SocialPlatformSchema', () => {
  test('should accept all 7 social platforms', () => {
    // GIVEN: All valid social platforms
    const platforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'github', 'tiktok'] as const
    
    // WHEN: Schema validation is performed on each
    const results = platforms.map(p => Schema.decodeUnknownSync(SocialPlatformSchema)(p))
    
    // THEN: All platforms should be accepted
    expect(results).toEqual([...platforms])
  })
})

describe('FooterSchema', () => {
  test('should accept footer with enabled only', () => {
    // GIVEN: Minimal footer
    const footer = { enabled: true }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(FooterSchema)(footer)
    
    // THEN: Enabled should be accepted
    expect(result.enabled).toBe(true)
  })
  
  test('should accept footer with logo and description', () => {
    // GIVEN: Footer with branding
    const footer = {
      enabled: true,
      logo: './logo-footer.svg',
      description: 'Building the future'
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(FooterSchema)(footer)
    
    // THEN: Logo and description should be accepted
    expect(result.logo).toBe('./logo-footer.svg')
    expect(result.description).toBe('Building the future')
  })
  
  test('should accept footer with columns', () => {
    // GIVEN: Footer with link columns
    const footer = {
      enabled: true,
      columns: [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' }
          ]
        }
      ]
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(FooterSchema)(footer)
    
    // THEN: Columns should be accepted
    expect(result.columns?.length).toBe(1)
    expect(result.columns?.[0]?.title).toBe('Product')
  })
  
  test('should accept footer with social links', () => {
    // GIVEN: Footer with social media
    const footer = {
      enabled: true,
      social: {
        links: [
          { platform: 'twitter' as const, url: 'https://twitter.com/company' },
          { platform: 'github' as const, url: 'https://github.com/company' }
        ]
      }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(FooterSchema)(footer)
    
    // THEN: Social links should be accepted
    expect(result.social?.links?.length).toBe(2)
  })
  
  test('should accept footer with newsletter', () => {
    // GIVEN: Footer with newsletter
    const footer = {
      enabled: true,
      newsletter: {
        enabled: true,
        title: 'Subscribe',
        placeholder: 'your@email.com'
      }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(FooterSchema)(footer)
    
    // THEN: Newsletter should be accepted
    expect(result.newsletter?.enabled).toBe(true)
  })
  
  test('should accept footer with copyright and legal', () => {
    // GIVEN: Footer with legal section
    const footer = {
      enabled: true,
      copyright: '© 2024 Company Inc.',
      legal: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' }
      ]
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(FooterSchema)(footer)
    
    // THEN: Copyright and legal should be accepted
    expect(result.copyright).toBe('© 2024 Company Inc.')
    expect(result.legal?.length).toBe(2)
  })
})
