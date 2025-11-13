/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import type { SocialSection } from '@/domain/models/app/page/layout/footer'
import type { ReactElement } from 'react'

interface FooterSocialProps {
  readonly social?: SocialSection
}

export function FooterSocial({ social }: FooterSocialProps): ReactElement | undefined {
  if (!social?.links || social.links.length === 0) {
    return undefined
  }

  return (
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
  )
}
