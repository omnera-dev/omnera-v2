/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Convert camelCase to kebab-case
 *
 * Transforms camelCase strings into kebab-case format by inserting hyphens
 * between lowercase/digit characters and uppercase characters, then lowercasing
 * the entire string.
 *
 * @param str - String in camelCase
 * @returns String in kebab-case
 *
 * @example
 * ```typescript
 * toKebabCase('fadeIn') // 'fade-in'
 * toKebabCase('slideInUp') // 'slide-in-up'
 * toKebabCase('backgroundColor') // 'background-color'
 * ```
 */
export function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}
