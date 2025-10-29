/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { NavigationSchema } from './navigation'

describe('NavigationSchema', () => {
  test('should accept navigation with logo only', () => {
    // GIVEN: Minimal navigation
    const navigation = { logo: './public/logo.svg' }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Logo should be accepted
    expect(result.logo).toBe('./public/logo.svg')
  })
  
  test('should accept navigation with mobile logo', () => {
    // GIVEN: Navigation with responsive logos
    const navigation = {
      logo: './public/logo.svg',
      logoMobile: './public/logo-mobile.svg'
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Mobile logo should be accepted
    expect(result.logoMobile).toBe('./public/logo-mobile.svg')
  })
  
  test('should accept navigation with logo alt text', () => {
    // GIVEN: Navigation with accessibility alt text
    const navigation = {
      logo: './public/logo.svg',
      logoAlt: 'Company Logo'
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Logo alt should be accepted
    expect(result.logoAlt).toBe('Company Logo')
  })
  
  test('should accept sticky navigation', () => {
    // GIVEN: Sticky navigation
    const navigation = {
      logo: './public/logo.svg',
      sticky: true
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Sticky flag should be accepted
    expect(result.sticky).toBe(true)
  })
  
  test('should accept transparent navigation', () => {
    // GIVEN: Transparent navigation
    const navigation = {
      logo: './public/logo.svg',
      transparent: true,
      sticky: true
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Transparent flag should be accepted
    expect(result.transparent).toBe(true)
  })
  
  test('should accept navigation with desktop links', () => {
    // GIVEN: Navigation with desktop menu
    const navigation = {
      logo: './public/logo.svg',
      links: {
        desktop: [
          { label: 'Products', href: '/products' },
          { label: 'Pricing', href: '/pricing' }
        ]
      }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Desktop links should be accepted
    expect(result.links?.desktop?.length).toBe(2)
  })
  
  test('should accept navigation with desktop and mobile links', () => {
    // GIVEN: Navigation with responsive menus
    const navigation = {
      logo: './public/logo.svg',
      links: {
        desktop: [
          { label: 'Products', href: '/products' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'About', href: '/about' }
        ],
        mobile: [
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' }
        ]
      }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Both link sets should be accepted
    expect(result.links?.desktop?.length).toBe(3)
    expect(result.links?.mobile?.length).toBe(2)
  })
  
  test('should accept navigation with CTA button', () => {
    // GIVEN: Navigation with call-to-action
    const navigation = {
      logo: './public/logo.svg',
      links: { desktop: [{ label: 'Features', href: '/features' }] },
      cta: {
        text: 'Get Started',
        href: '/signup',
        variant: 'primary' as const
      }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: CTA should be accepted
    expect(result.cta?.text).toBe('Get Started')
    expect(result.cta?.variant).toBe('primary')
  })
  
  test('should accept navigation with search', () => {
    // GIVEN: Navigation with search
    const navigation = {
      logo: './public/logo.svg',
      search: {
        enabled: true,
        placeholder: 'Search documentation...'
      }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: Search config should be accepted
    expect(result.search?.enabled).toBe(true)
    expect(result.search?.placeholder).toBe('Search documentation...')
  })
  
  test('should accept navigation with user menu', () => {
    // GIVEN: Navigation with user account menu
    const navigation = {
      logo: './public/logo.svg',
      user: {
        enabled: true,
        loginUrl: '/login',
        signupUrl: '/signup'
      }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: User menu should be accepted
    expect(result.user?.enabled).toBe(true)
    expect(result.user?.loginUrl).toBe('/login')
  })
  
  test('should accept navigation with all properties', () => {
    // GIVEN: Complete navigation configuration
    const navigation = {
      logo: './public/logo.svg',
      logoMobile: './public/logo-mobile.svg',
      logoAlt: 'Company Logo',
      sticky: true,
      transparent: false,
      links: {
        desktop: [{ label: 'Products', href: '/products' }]
      },
      cta: { text: 'Sign Up', href: '/signup' },
      search: { enabled: true },
      user: { enabled: true, loginUrl: '/login' }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(NavigationSchema)(navigation)
    
    // THEN: All properties should be accepted
    expect(result.logo).toBe('./public/logo.svg')
    expect(result.sticky).toBe(true)
    expect(result.cta?.text).toBe('Sign Up')
    expect(result.search?.enabled).toBe(true)
    expect(result.user?.enabled).toBe(true)
  })
  
  test('should reject navigation without required logo', () => {
    // GIVEN: Navigation missing logo
    const navigation = { sticky: true }
    
    // WHEN: Schema validation is performed
    // THEN: Should be rejected (logo is required)
    expect(() => Schema.decodeUnknownSync(NavigationSchema)(navigation)).toThrow()
  })
})
