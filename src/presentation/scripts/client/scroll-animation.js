/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Client-side scroll animation handler using IntersectionObserver
 *
 * Immediately Invoked Function Expression (IIFE) that:
 * - Detects elements with data-scroll-animation attribute
 * - Uses IntersectionObserver to watch when elements enter viewport
 * - Triggers animations by adding 'scroll-animated' class
 * - Handles animation completion and cleanup
 *
 * CSP-compliant: No inline event handlers, runs from external file
 */
;(function () {
  'use strict'

  /**
   * Initialize scroll animations with IntersectionObserver
   * Observes all elements with data-scroll-animation attribute
   */
  function init() {
    // Find all elements that should animate on scroll
    const animatedElements = document.querySelectorAll('[data-scroll-animation]')

    if (animatedElements.length === 0) {
      return
    }

    // Create IntersectionObserver with threshold
    // Trigger when at least 10% of the element is visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is now visible, trigger animation
            const element = entry.target

            // Apply the animation by modifying style
            // This makes the element visible and triggers the animation
            element.style.opacity = '1'
            element.style.animationPlayState = 'running'

            // Stop observing this element (one-time animation)
            observer.unobserve(element)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element reaches bottom
      }
    )

    // Observe all animated elements
    animatedElements.forEach((element) => {
      // Ensure animation is paused initially
      element.style.animationPlayState = 'paused'
      observer.observe(element)
    })
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    // DOM already loaded
    init()
  }
})()
