/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Convert hex color to RGB values for Tailwind CSS custom properties
 * Tailwind v4 expects colors as space-separated RGB values (r g b) for opacity support
 *
 * @param hex - Hex color string (#RRGGBB or #RGB)
 * @returns Space-separated RGB values (e.g., "255 0 0") or original value if not hex
 */
export function hexToRgb(hex: string): string {
  // Return original value if not a hex color
  if (!hex.startsWith('#')) {
    return hex
  }

  // Remove # and handle 3-digit hex
  const cleanHex = hex.slice(1)
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex

  // Parse RGB values
  const r = parseInt(fullHex.slice(0, 2), 16)
  const g = parseInt(fullHex.slice(2, 4), 16)
  const b = parseInt(fullHex.slice(4, 6), 16)

  // Return space-separated RGB for Tailwind
  return `${r} ${g} ${b}`
}

/**
 * Convert space-separated RGB to rgb() format for CSS color properties
 *
 * @param color - Color value (hex or already converted RGB)
 * @returns rgb() wrapped color or original value
 */
export function toRgbColor(color: string): string {
  const rgb = hexToRgb(color)
  return rgb.includes(' ') ? `rgb(${rgb})` : color
}
