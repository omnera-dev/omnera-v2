/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { LayoutSchema } from './layout'

describe('LayoutSchema', () => {
  test('should accept empty layout', () => {
    // GIVEN: Blank page layout
    const layout = {}
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(LayoutSchema)(layout)
    
    // THEN: Empty layout should be accepted
    expect(result).toEqual({})
  })
  
  test('should accept layout with banner only', () => {
    // GIVEN: Layout with banner
    const layout = {
      banner: { enabled: true, text: 'Announcement' }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(LayoutSchema)(layout)
    
    // THEN: Banner should be accepted
    expect(result.banner?.enabled).toBe(true)
  })
  
  test('should accept layout with navigation only', () => {
    // GIVEN: Minimal layout with navigation
    const layout = {
      navigation: { logo: './logo.svg' }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(LayoutSchema)(layout)
    
    // THEN: Navigation should be accepted
    expect(result.navigation?.logo).toBe('./logo.svg')
  })
  
  test('should accept layout with navigation and footer', () => {
    // GIVEN: Standard website layout
    const layout = {
      navigation: { logo: './logo.svg' },
      footer: { enabled: true, copyright: '© 2024 Company' }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(LayoutSchema)(layout)
    
    // THEN: Navigation and footer should be accepted
    expect(result.navigation?.logo).toBe('./logo.svg')
    expect(result.footer?.enabled).toBe(true)
  })
  
  test('should accept layout with sidebar', () => {
    // GIVEN: Documentation layout with sidebar
    const layout = {
      navigation: { logo: './logo.svg' },
      sidebar: {
        enabled: true,
        position: 'left' as const,
        items: [
          { type: 'link' as const, label: 'Docs', href: '/docs' }
        ]
      },
      footer: { enabled: true }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(LayoutSchema)(layout)
    
    // THEN: Sidebar should be accepted
    expect(result.sidebar?.enabled).toBe(true)
    expect(result.sidebar?.position).toBe('left')
  })
  
  test('should accept layout with all 4 components', () => {
    // GIVEN: Complete layout
    const layout = {
      banner: { enabled: true, text: 'Sale' },
      navigation: { logo: './logo.svg', sticky: true },
      sidebar: { enabled: true, position: 'left' as const },
      footer: { enabled: true, copyright: '© 2024' }
    }
    
    // WHEN: Schema validation is performed
    const result = Schema.decodeUnknownSync(LayoutSchema)(layout)
    
    // THEN: All components should be accepted
    expect(result.banner?.enabled).toBe(true)
    expect(result.navigation?.logo).toBe('./logo.svg')
    expect(result.sidebar?.enabled).toBe(true)
    expect(result.footer?.enabled).toBe(true)
  })
})
