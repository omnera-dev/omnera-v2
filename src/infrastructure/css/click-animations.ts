/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Click interaction animations
 *
 * Provides CSS animations for click interactions (pulse, ripple, bounce, etc.)
 * These animations are separate from entrance/exit animations provided by tw-animate-css
 *
 * Architecture: Infrastructure Layer (CSS generation)
 * - Supports click interaction schema (animation: pulse, ripple, bounce, shake, flash, none)
 * - Generates @keyframes and utility classes for click feedback
 */

/**
 * Generate CSS for click interaction animations
 *
 * Returns CSS string with @keyframes and .animate-* utility classes
 * for all click interaction animation types
 */
export function generateClickAnimationCSS(): string {
  return `/* Click interaction animations */
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }

      .animate-ripple {
        position: relative;
        overflow: hidden;
      }

      .animate-ripple::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 600ms ease-out;
      }`
}
