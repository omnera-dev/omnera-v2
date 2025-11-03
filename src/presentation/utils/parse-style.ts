/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Parse a CSS string into a React style object
 *
 * Converts kebab-case CSS properties to camelCase React style properties.
 * Handles semicolon-separated CSS declarations.
 *
 * @param styleString - CSS string (e.g., "background-color: #007bff; padding: 1rem;")
 * @returns React style object (e.g., { backgroundColor: '#007bff', padding: '1rem' })
 *
 * @example
 * ```typescript
 * const style = parseStyle('background-color: #007bff; padding: 1rem;')
 * // { backgroundColor: '#007bff', padding: '1rem' }
 * ```
 */
export function parseStyle(styleString: string): Record<string, string> {
  const result: Record<string, string> = {}

  // Split by semicolon and process each declaration
  const declarations = styleString.split(';').filter((d) => d.trim())

  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map((s) => s.trim())
    if (property && value) {
      // Convert kebab-case to camelCase (e.g., background-color → backgroundColor)
      const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelCaseProperty] = value
    }
  }

  return result
}
