/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type {
  Footer as FooterProps,
  FooterColumn,
  FooterLink,
  Newsletter,
  SocialLink,
  SocialSection,
} from '@/domain/models/app/page/layout/footer'
import type { ReactElement } from 'react'

/**
 * Generates external link attributes for security
 */
function getExternalLinkProps(target?: string) {
  return target === '_blank'
    ? { rel: 'noopener noreferrer' as const, 'data-testid': 'footer-link-external' as const }
    : { rel: undefined, 'data-testid': undefined }
}

/**
 * Renders a single footer column with links
 */
function FooterColumn({ column, index }: { column: FooterColumn; index: number }) {
  return (
    <div
      key={index}
      data-testid={`footer-column-${index}`}
    >
      <h3 data-testid="column-title">{column.title}</h3>
      <ul data-testid="column-links">
        {column.links.map((link, linkIndex) => (
          <FooterColumnLink
            key={linkIndex}
            link={link}
          />
        ))}
      </ul>
    </div>
  )
}

/**
 * Renders a link within a footer column
 */
function FooterColumnLink({ link }: { link: FooterLink }) {
  const { rel, 'data-testid': testId } = getExternalLinkProps(link.target)
  return (
    <li>
      <a
        href={link.href}
        target={link.target}
        rel={rel}
        data-testid={testId}
      >
        {link.label}
      </a>
    </li>
  )
}

/**
 * Renders social media links section
 */
function FooterSocialLinks({ social }: { social: SocialSection }) {
  if (!social.links || social.links.length === 0) {
    return undefined
  }

  return (
    <div data-testid="footer-social">
      {social.title && <h3>{social.title}</h3>}
      <div>
        {social.links.map((link: SocialLink, index: number) => {
          const iconTestId = link.icon
            ? `custom-icon-${link.icon}`
            : `default-icon-${link.platform}`

          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`social-${link.platform}`}
              aria-label={link.platform}
            >
              <span data-testid={iconTestId}>{link.icon || link.platform}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Renders newsletter subscription section
 */
function FooterNewsletterSection({ newsletter }: { newsletter: Newsletter }) {
  if (!newsletter.enabled) {
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

/**
 * Renders legal links section
 */
function FooterLegalLinks({ legal }: { legal: readonly FooterLink[] }) {
  if (legal.length === 0) {
    return undefined
  }

  return (
    <div data-testid="footer-legal">
      {legal.map((link, index) => {
        const { rel } = getExternalLinkProps(link.target)
        return (
          <a
            key={index}
            href={link.href}
            target={link.target}
            rel={rel}
          >
            {link.label}
          </a>
        )
      })}
    </div>
  )
}

/**
 * Renders footer logo
 */
function FooterLogo({ logo }: { logo?: string }) {
  if (!logo) {
    return undefined
  }

  return (
    <img
      data-testid="footer-logo"
      src={logo}
      alt="Footer logo"
    />
  )
}

/**
 * Renders footer columns section
 */
function FooterColumns({ columns }: { columns?: readonly FooterColumn[] }) {
  if (!columns || columns.length === 0) {
    return undefined
  }

  return (
    <div>
      {columns.map((column, index) => (
        <FooterColumn
          key={index}
          column={column}
          index={index}
        />
      ))}
    </div>
  )
}

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
      <FooterLogo logo={logo} />
      {description && <div data-testid="footer-description">{description}</div>}
      <FooterColumns columns={columns} />
      {social && <FooterSocialLinks social={social} />}
      {newsletter && <FooterNewsletterSection newsletter={newsletter} />}
      {copyright && <div data-testid="footer-copyright">{copyright}</div>}
      {legal && <FooterLegalLinks legal={legal} />}
      {email && <a href={`mailto:${email}`}>{email}</a>}
    </footer>
  )
}
