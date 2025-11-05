/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Click Interactions Client-Side Handler
 *
 * This script enables click interactions for buttons rendered from the configuration.
 * Since the application uses SSR without client-side hydration, this script adds
 * event listeners to handle animations and actions.
 */

;(function () {
  /**
   * Handle click interactions for a button element
   * @param {HTMLButtonElement} button - Button element with data-click-interaction attribute
   */
  function handleButtonClick(button) {
    try {
      const interactionData = button.getAttribute('data-click-interaction')
      if (!interactionData) return

      const interaction = JSON.parse(interactionData)

      // Handle animation
      if (interaction.animation && interaction.animation !== 'none') {
        button.classList.add(`animate-${interaction.animation}`)

        // Remove animation class after 1 second
        setTimeout(() => {
          button.classList.remove(`animate-${interaction.animation}`)
        }, 1000)
      }

      // Handle navigation
      if (interaction.navigate) {
        if (interaction.navigate.startsWith('#')) {
          // Anchor navigation
          window.location.hash = interaction.navigate
        } else {
          // Internal routing
          window.location.href = interaction.navigate
        }
      }

      // Handle openUrl
      if (interaction.openUrl) {
        if (interaction.openInNewTab) {
          window.open(interaction.openUrl, '_blank')
        } else {
          window.location.href = interaction.openUrl
        }
      }

      // Handle scrollTo
      if (interaction.scrollTo) {
        const targetElement = document.querySelector(interaction.scrollTo)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      }

      // Handle toggleElement
      if (interaction.toggleElement) {
        const targetElement = document.querySelector(interaction.toggleElement)
        if (targetElement instanceof HTMLElement) {
          if (targetElement.style.display === 'none') {
            targetElement.style.display = ''
          } else {
            targetElement.style.display = 'none'
          }
        }
      }

      // Handle submitForm
      if (interaction.submitForm) {
        const form = document.querySelector(interaction.submitForm)
        if (form instanceof HTMLFormElement) {
          form.submit()
        }
      }
    } catch (error) {
      console.error('Error handling click interaction:', error)
    }
  }

  /**
   * Initialize click interactions on page load
   */
  function initializeClickInteractions() {
    const buttonsWithInteractions = document.querySelectorAll('[data-click-interaction]')

    buttonsWithInteractions.forEach((button) => {
      if (button instanceof HTMLButtonElement) {
        button.addEventListener('click', () => handleButtonClick(button))
      }
    })
  }

  // Initialize immediately since defer ensures DOM is ready
  initializeClickInteractions()
})()
