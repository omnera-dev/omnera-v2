/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Standard HTML attributes for badge components
 */
export const STANDARD_HTML_ATTRS = new Set([
  'className',
  'style',
  'id',
  'role',
  'data-testid',
  'data-block',
  'data-type',
  'data-translation-key',
  'data-translations',
])

/**
 * Convert custom props to data-* attributes for badge components
 */
export function convertBadgeProps(elementProps: Record<string, unknown>): Record<string, unknown> {
  return Object.entries(elementProps).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (STANDARD_HTML_ATTRS.has(key) || key.startsWith('data-') || key.startsWith('aria-')) {
      return { ...acc, [key]: value }
    }
    return { ...acc, [`data-${key}`]: value }
  }, {})
}

/**
 * Parse HTML content string into React elements
 *
 * SECURITY: Safe use of dangerouslySetInnerHTML
 * - Content: HTML string from component/block configuration
 * - Source: Validated schema (component content property)
 * - Risk: Low - content is from server configuration, not user input
 * - Validation: Schema validation ensures string type
 * - Purpose: Render HTML content in badge/component elements
 * - XSS Protection: Content comes from trusted configuration
 * - NOTE: For user-generated HTML, use DOMPurify sanitization instead
 */
export function parseHTMLContent(htmlString: string) {
  return <div dangerouslySetInnerHTML={{ __html: htmlString }} />
}
