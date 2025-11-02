/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { describe, test, expect } from 'bun:test'
import { renderToString } from 'react-dom/server'
import { ComponentRenderer } from './component-renderer'

describe('ComponentRenderer - Variable Substitution', () => {
  test('should substitute variables in block reference', () => {
    const blocks = [
      {
        name: 'hero',
        type: 'section',
        props: { id: 'hero' },
        children: [{ type: 'h1', children: ['$title'] }],
      },
    ]

    const component = {
      block: 'hero',
      vars: { title: 'Welcome to Our Platform' },
    }

    const html = renderToString(
      <ComponentRenderer
        component={component}
        blocks={blocks}
      />
    )

    expect(html).toContain('Welcome to Our Platform')
    expect(html).not.toContain('$title')
  })
})
