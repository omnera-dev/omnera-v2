/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { Footer as FooterProps } from '@/domain/models/app/page/layout/footer'
import type { ReactElement } from 'react'

/**
 * Footer Component
 *
 * Renders the page footer with logo, copyright, optional legal links, and contact email.
 *
 * @param props - Footer configuration
 * @returns Footer element or undefined if disabled
 */
export function Footer({
  enabled = true,
  logo,
  description,
  columns,
  social,
  newsletter,
  copyright,
  legal,
  email,
}: Readonly<FooterProps>): Readonly<ReactElement | undefined> {
  if (!enabled) {
    return undefined
  }

  return (
    <footer
      data-testid="footer"
      style={{ display: 'block', minHeight: '1px' }}
    >
      {logo && (
        <img
          data-testid="footer-logo"
          src={logo}
          alt="Footer logo"
        />
      )}
      {description && (
        <div data-testid="footer-description">{description}</div>
      )}
      {columns && columns.length > 0 && (
        <div>
          {columns.map((column, index) => (
            <div
              key={index}
              data-testid={`footer-column-${index}`}
            >
              <h3 data-testid="column-title">{column.title}</h3>
              <ul data-testid="column-links">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      target={link.target}
                      rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
                      data-testid={link.target === '_blank' ? 'footer-link-external' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {social && social.links && social.links.length > 0 && (
        <div data-testid="footer-social">
          {social.title && <h3>{social.title}</h3>}
          <div>
            {social.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`social-${link.platform}`}
                aria-label={link.platform}
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      )}
      {newsletter && newsletter.enabled && (
        <div data-testid="footer-newsletter">
          {newsletter.title && (
            <h3 data-testid="newsletter-title">{newsletter.title}</h3>
          )}
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
      )}
      {copyright && (
        <div data-testid="footer-copyright">{copyright}</div>
      )}
      {legal && legal.length > 0 && (
        <div data-testid="footer-legal">
          {legal.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target={link.target}
              rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      {email && (
        <a href={`mailto:${email}`}>{email}</a>
      )}
    </footer>
  )
}
