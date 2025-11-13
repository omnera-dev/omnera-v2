/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { type ReactElement } from 'react'
import { renderInlineScriptTag, renderScriptTag } from '@/presentation/scripts/script-renderers'
import type { GroupedScripts } from './PageScripts'
import type { Languages } from '@/domain/models/app/languages'
import type { Page } from '@/domain/models/app/pages'
import type { Theme } from '@/domain/models/app/theme'

/**
 * Props for PageBodyScripts component
 */
type PageBodyScriptsProps = {
  readonly page: Page
  readonly theme: Theme | undefined
  readonly languages: Languages | undefined
  readonly direction: 'ltr' | 'rtl'
  readonly scripts: GroupedScripts
  readonly position: 'start' | 'end'
}

/**
 * Renders external and inline scripts for a given position
 */
function renderScripts(
  externalScripts: GroupedScripts['external']['head'],
  inlineScripts: GroupedScripts['inline']['head'],
  keyPrefix: string
): ReactElement {
  return (
    <>
      {externalScripts.map((script, index) =>
        renderScriptTag({
          src: script.src,
          async: script.async,
          defer: script.defer,
          module: script.module,
          integrity: script.integrity,
          crossOrigin: script.crossorigin as 'anonymous' | 'use-credentials' | undefined,
          reactKey: `${keyPrefix}-${index}`,
        })
      )}
      {inlineScripts.map((script, index) =>
        renderInlineScriptTag({
          code: script.code,
          async: script.async,
          reactKey: `inline-${keyPrefix}-${index}`,
        })
      )}
    </>
  )
}

/**
 * Renders language switcher scripts and configuration
 */
function LanguageSwitcherScripts({
  languages,
  theme,
  direction,
}: {
  readonly languages: Languages
  readonly theme: Theme | undefined
  readonly direction: 'ltr' | 'rtl'
}): ReactElement {
  return (
    <>
      {/* Configuration data for external script (CSP-compliant) */}
      <div
        data-language-switcher-config={JSON.stringify(languages)}
        style={{ display: 'none' }}
      />
      {/* Expose languages config to window for testing/debugging - fallback defaults to default language */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.APP_LANGUAGES = ${JSON.stringify({
            ...languages,
            fallback: languages.fallback ?? languages.default,
          })};`,
        }}
      />
      {/* Expose theme config with RTL-aware direction to window for testing/debugging */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.APP_THEME = ${JSON.stringify({
            ...(theme || {}),
            direction: direction,
          })};`,
        }}
      />
      {/* External script file loaded only when needed (defer ensures DOM is ready) */}
      <script
        src="/assets/language-switcher.js"
        defer={true}
      />
    </>
  )
}

/**
 * Renders conditional script tags (banner, animation, features)
 */
function renderConditionalScripts(config: {
  readonly page: Page
  readonly theme: Theme | undefined
  readonly languages: Languages | undefined
  readonly direction: 'ltr' | 'rtl'
}): ReactElement {
  const { page, theme, languages, direction } = config
  return (
    <>
      {/* Client-side banner dismiss functionality - inject when banner is dismissible */}
      {page.layout?.banner?.dismissible && (
        <script
          src="/assets/banner-dismiss.js"
          defer={true}
        />
      )}
      {/* Client-side scroll animation functionality - inject when scroll animations configured */}
      {theme?.animations?.scaleUp && (
        <script
          src="/assets/scroll-animation.js"
          defer={true}
        />
      )}
      {/* Client-side language switcher functionality - always inject when languages configured */}
      {languages && (
        <LanguageSwitcherScripts
          languages={languages}
          theme={theme}
          direction={direction}
        />
      )}
      {/* Client-side feature flags - inject when features configured */}
      {page.scripts?.features && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.FEATURES = ${JSON.stringify(page.scripts.features)};`,
          }}
        />
      )}
    </>
  )
}

/**
 * Click interaction handler script
 */
const CLICK_INTERACTION_SCRIPT = `
(function() {
  document.addEventListener('click', function(event) {
    const button = event.target.closest('[data-click-animation]');
    if (!button) return;

    const animation = button.getAttribute('data-click-animation');
    if (!animation || animation === 'none') return;

    const animationClass = 'animate-' + animation;
    button.classList.add(animationClass);

    const removeAnimation = function() {
      button.classList.remove(animationClass);
      button.removeEventListener('animationend', removeAnimation);
    };
    button.addEventListener('animationend', removeAnimation);
  });
})();
`.trim()

/**
 * Scroll interaction handler script using IntersectionObserver
 */
const SCROLL_INTERACTION_SCRIPT = `
(function() {
  const elements = document.querySelectorAll('[data-scroll-animation]');
  if (elements.length === 0) return;

  const observers = new Map();

  elements.forEach(function(element) {
    const animation = element.getAttribute('data-scroll-animation');
    if (!animation) return;

    const threshold = parseFloat(element.getAttribute('data-scroll-threshold') || '0.1');
    const delay = element.getAttribute('data-scroll-delay') || '0ms';
    const duration = element.getAttribute('data-scroll-duration') || '600ms';
    const once = element.getAttribute('data-scroll-once') !== 'false';

    const animationClass = 'animate-' + animation;

    // Apply animation delay and duration via inline styles
    if (delay !== '0ms') {
      element.style.animationDelay = delay;
    }
    if (duration !== '600ms') {
      element.style.animationDuration = duration;
    }

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          element.classList.add(animationClass);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          element.classList.remove(animationClass);
        }
      });
    }, { threshold: threshold });

    observer.observe(element);
    observers.set(element, observer);
  });
})();
`.trim()

/**
 * Renders scripts for body end position
 */
function renderBodyEndScripts(config: {
  readonly page: Page
  readonly theme: Theme | undefined
  readonly languages: Languages | undefined
  readonly direction: 'ltr' | 'rtl'
  readonly scripts: GroupedScripts
}): ReactElement {
  const { page, theme, languages, direction, scripts } = config
  return (
    <>
      {renderScripts(scripts.external.bodyEnd, scripts.inline.bodyEnd, 'body-end')}
      {renderConditionalScripts({ page, theme, languages, direction })}
      <script dangerouslySetInnerHTML={{ __html: CLICK_INTERACTION_SCRIPT }} />
      <script dangerouslySetInnerHTML={{ __html: SCROLL_INTERACTION_SCRIPT }} />
    </>
  )
}

/**
 * Renders scripts for body start or end position
 *
 * For 'start' position:
 * - External and inline scripts positioned at body-start
 *
 * For 'end' position:
 * - External and inline scripts positioned at body-end
 * - Banner dismiss script (if banner is dismissible)
 * - Scroll animation script (if theme has scaleUp animation)
 * - Language switcher script (if languages configured)
 * - Feature flags script (if features configured)
 *
 * @param props - Component props
 * @returns Script elements for the specified position
 */
export function PageBodyScripts({
  page,
  theme,
  languages,
  direction,
  scripts,
  position,
}: PageBodyScriptsProps): Readonly<ReactElement> {
  if (position === 'start') {
    return renderScripts(scripts.external.bodyStart, scripts.inline.bodyStart, 'body-start')
  }

  return renderBodyEndScripts({ page, theme, languages, direction, scripts })
}
