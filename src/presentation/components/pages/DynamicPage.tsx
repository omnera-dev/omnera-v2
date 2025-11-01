/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { ComponentRenderer } from '@/presentation/components/sections/component-renderer'
import type { Block, Blocks } from '@/domain/models/app/blocks'
import type { Component, SectionItem } from '@/domain/models/app/page/sections'
import type { Page } from '@/domain/models/app/pages'

/**
 * Check if a section is a block reference
 */
function isBlockReference(
  section: SectionItem
): section is { block: string } | { $ref: string; vars: Record<string, string | number | boolean> } {
  return 'block' in section || '$ref' in section
}

/**
 * Resolve a block reference to a component
 */
function resolveBlockReference(
  section: SectionItem,
  blocks?: Blocks
): { component: Component; blockName: string } | undefined {
  if (!isBlockReference(section) || !blocks) {
    return undefined
  }

  // Extract block name from either shorthand or full syntax
  const blockName = 'block' in section ? section.block : section.$ref

  // Find the block definition
  const block = blocks.find((b: Block) => b.name === blockName)
  if (!block) {
    return undefined
  }

  // For now, return the block as a component
  // TODO: Implement variable substitution when vars are provided
  return {
    component: block as unknown as Component,
    blockName,
  }
}

/**
 * DynamicPage component - Renders a custom page from configuration
 *
 * This component takes a page configuration and renders it as a complete HTML document
 * with all sections, metadata, and layout components.
 *
 * @param props - Component props
 * @param props.page - Page configuration from app schema
 * @param props.blocks - Optional blocks array for resolving block references
 * @returns React element with complete page structure
 */
export function DynamicPage({
  page,
  blocks,
}: {
  readonly page: Page
  readonly blocks?: Blocks
}): Readonly<ReactElement> {
  // Use default metadata if not provided
  const lang = page.meta?.lang || 'en-US'
  const title = page.meta?.title || page.name || page.path
  const description = page.meta?.description || ''

  return (
    <html lang={lang}>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>{title}</title>
        {description && (
          <meta
            name="description"
            content={description}
          />
        )}
        <link
          rel="stylesheet"
          href="/assets/output.css"
        />
      </head>
      <body>
        <main>
          {page.sections.map((section, index) => {
            // Check if this is a block reference
            const resolved = resolveBlockReference(section, blocks)

            if (resolved) {
              // Render block with data-block attribute
              return (
                <ComponentRenderer
                  key={index}
                  component={resolved.component}
                  blockName={resolved.blockName}
                />
              )
            }

            // Render as normal component
            return (
              <ComponentRenderer
                key={index}
                component={section as Component}
              />
            )
          })}
        </main>
      </body>
    </html>
  )
}
