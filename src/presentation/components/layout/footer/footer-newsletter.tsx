/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Newsletter } from '@/domain/models/app/page/layout/footer'
import type { ReactElement } from 'react'

interface FooterNewsletterProps {
  readonly newsletter?: Newsletter
}

export function FooterNewsletter({ newsletter }: FooterNewsletterProps): ReactElement | undefined {
  if (!newsletter?.enabled) {
    return undefined
  }

  return (
    <div data-testid="footer-newsletter">
      {newsletter.title && <h3 data-testid="newsletter-title">{newsletter.title}</h3>}
      {newsletter.description && (
        <p data-testid="newsletter-description">{newsletter.description}</p>
      )}
      <form>
        <input
          type="email"
          data-testid="newsletter-input"
          placeholder={newsletter.placeholder || 'Enter your email'}
          aria-label="Email address"
        />
        <button
          type="submit"
          data-testid="newsletter-button"
        >
          {newsletter.buttonText || 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
