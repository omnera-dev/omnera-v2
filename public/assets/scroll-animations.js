/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Scroll Animations Handler
 *
 * Applies animations to elements when they enter the viewport using Intersection Observer.
 * Looks for elements with data-scroll-animation attribute and applies the appropriate
 * Tailwind animation class when the element reaches the specified threshold visibility.
 */

;(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations)
  } else {
    initScrollAnimations()
  }

  function initScrollAnimations() {
    // Find all elements with scroll animation data
    const elements = document.querySelectorAll('[data-scroll-animation]')

    if (elements.length === 0) {
      return
    }

    // Track which elements have been animated
    const animatedElements = new WeakSet()

    // Function to apply scroll animation to an element
    function applyScrollAnimation(element) {
      if (animatedElements.has(element)) {
        return // Already animated
      }

      const animation = element.getAttribute('data-scroll-animation')
      if (!animation) {
        return
      }

      // Remove any existing animation classes first
      const existingAnimations = Array.from(element.classList).filter((cls) =>
        cls.startsWith('animate-')
      )
      existingAnimations.forEach((cls) => element.classList.remove(cls))

      // Add scroll animation class
      element.classList.add(`animate-${animation}`)
      animatedElements.add(element)
    }

    // Function to check if element is in viewport
    function isElementInViewport(element, threshold) {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      const windowWidth = window.innerWidth || document.documentElement.clientWidth

      // Calculate visible percentage
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
      const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0)
      const elementArea = rect.height * rect.width
      const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth)
      const visiblePercentage = elementArea > 0 ? visibleArea / elementArea : 0

      return visiblePercentage >= threshold
    }

    // Check all elements for visibility
    function checkVisibility() {
      elements.forEach((element) => {
        const threshold = parseFloat(element.getAttribute('data-scroll-threshold') || '0.1')
        if (isElementInViewport(element, threshold)) {
          applyScrollAnimation(element)
        }
      })
    }

    // Use Intersection Observer as primary method
    elements.forEach((element) => {
      const threshold = parseFloat(element.getAttribute('data-scroll-threshold') || '0.1')

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              applyScrollAnimation(entry.target)
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: threshold,
          rootMargin: '0px',
        }
      )

      observer.observe(element)
    })

    // Also check on scroll events as fallback
    let scrollTimeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(checkVisibility, 50)
    })

    // Check immediately in case elements are already visible
    checkVisibility()
  }
})()
