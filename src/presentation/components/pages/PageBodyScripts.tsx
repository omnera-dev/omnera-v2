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
      {/* Client-side scroll animation functionality - always inject (script has guard for zero elements) */}
      <script
        src="/assets/scroll-animation.js"
        defer={true}
      />
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
    const button = event.target.closest('[data-click-animation], [data-click-navigate], [data-click-open-url], [data-click-scroll-to], [data-click-toggle-element], [data-click-submit-form]');
    if (!button) return;

    const animation = button.getAttribute('data-click-animation');
    const navigate = button.getAttribute('data-click-navigate');
    const openUrl = button.getAttribute('data-click-open-url');
    const openInNewTab = button.getAttribute('data-click-open-in-new-tab') === 'true';
    const scrollTo = button.getAttribute('data-click-scroll-to');
    const toggleElement = button.getAttribute('data-click-toggle-element');
    const submitForm = button.getAttribute('data-click-submit-form');

    // Determine target action (navigate, openUrl, or scrollTo)
    const targetUrl = openUrl || navigate;
    const isExternalUrl = !!openUrl;

    // Handle submitForm action
    if (submitForm) {
      const formElement = document.querySelector(submitForm);
      if (formElement && formElement.tagName === 'FORM') {
        formElement.requestSubmit();
      }
      return;
    }

    // Handle toggleElement action
    if (toggleElement) {
      const targetElement = document.querySelector(toggleElement);
      if (targetElement) {
        const currentDisplay = window.getComputedStyle(targetElement).display;
        if (currentDisplay === 'none') {
          targetElement.style.display = '';
        } else {
          targetElement.style.display = 'none';
        }
      }
      return;
    }

    // Handle scrollTo action
    if (scrollTo) {
      const targetElement = document.querySelector(scrollTo);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    // Handle animation and navigation/openUrl together
    if (animation && animation !== 'none') {
      const animationClass = 'animate-' + animation;
      button.classList.add(animationClass);

      if (targetUrl) {
        // Navigate/open after animation completes (with timeout fallback)
        let navigated = false;
        const doNavigate = function() {
          if (!navigated) {
            navigated = true;
            button.classList.remove(animationClass);
            if (isExternalUrl && openInNewTab) {
              window.open(targetUrl, '_blank');
            } else {
              window.location.href = targetUrl;
            }
          }
        };

        // Listen for animation end
        button.addEventListener('animationend', doNavigate, { once: true });

        // Fallback timeout in case animation doesn't exist or fails (300ms default animation duration)
        setTimeout(doNavigate, 300);
      } else {
        // Just remove animation class when done
        const removeAnimation = function() {
          button.classList.remove(animationClass);
        };
        button.addEventListener('animationend', removeAnimation, { once: true });
        // Fallback to remove class after timeout
        setTimeout(removeAnimation, 300);
      }
    } else if (targetUrl) {
      // No animation, navigate/open immediately
      if (isExternalUrl && openInNewTab) {
        window.open(targetUrl, '_blank');
      } else {
        window.location.href = targetUrl;
      }
    }
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
