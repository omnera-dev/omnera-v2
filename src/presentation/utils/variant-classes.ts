/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Sustainable Use License
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Common variant classes for interactive UI components
 *
 * These classes are shared across multiple components to ensure consistent
 * focus and validation styling throughout the application.
 *
 * @module variant-classes
 */

/**
 * Focus ring classes applied on keyboard focus (not mouse click)
 *
 * Provides a visible focus indicator for accessibility, using the theme's
 * ring color with reduced opacity for subtle but clear indication.
 */
export const FOCUS_RING_CLASSES =
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'

/**
 * Validation ring classes for invalid form fields
 *
 * Applied when aria-invalid="true" to provide visual feedback for
 * validation errors. Uses destructive color with theme-aware opacity.
 */
export const VALIDATION_RING_CLASSES =
  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'

/**
 * Combined interactive classes for form inputs and controls
 *
 * Merges focus and validation ring classes for consistent interactive
 * behavior across all form elements.
 */
export const COMMON_INTERACTIVE_CLASSES = `${FOCUS_RING_CLASSES} ${VALIDATION_RING_CLASSES}`
