import React from 'react'

// ============================================================================
// HEAD COMPONENT with customElements support
// ============================================================================

/**
 * Head component - Generates complete <head> section with meta tags, styles, and scripts
 */
export const Head = ({ meta, theme }) => {
  const {
    title,
    description,
    keywords,
    author,
    canonical,
    favicon,
    favicons = [],
    stylesheet = './output.css?v=306168', // Default stylesheet path
    googleFonts,
    socialImage,
    openGraph,
    twitter,
    schema,
    preload,
    dnsPrefetch,
    analytics,
    lang = 'en',
    customElements = [], // NEW: Custom head elements
  } = meta

  // Custom styles with theme colors injected (Google Fonts import + animations)
  const customStyles = `
    /* Brand Typography - Following charte.html */
    ${googleFonts ? `@import url('${googleFonts}');` : ''}

    /* CSS Variables */
    :root {
      --brand-orange: ${theme.colors.orange};
      --brand-pourpre: ${theme.colors.pourpre};
      --brand-mauve: ${theme.colors.mauve};
      --brand-cyan: ${theme.colors.cyan};
      --brand-orange-light: ${theme.colors['orange-light']};
      --brand-pourpre-light: ${theme.colors['pourpre-light']};
      --brand-mauve-light: ${theme.colors['mauve-light']};
      --brand-cyan-light: ${theme.colors['cyan-light']};
      --brand-gray-dark: #111827;
      --brand-gray-medium: #4B5563;
      --brand-gray-light: #E5E7EB;
    }

    /* Universal font selector */
    * {
      font-family: "Neue Machina", "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    /* Title font styling */
    .title-font {
      font-family: "Bely Display", "Archivo Black", cursive;
      text-transform: lowercase;
      letter-spacing: 0.05em;
    }

    /* Hero animations */
    .hero-title {
      animation: fadeInUp 0.8s ease-out;
      line-height: 0.85;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -30px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }

    /* Fade-in animation */
    .fade-in {
      animation: fadeIn 1s ease-out;
    }

    /* Gradient text */
    .gradient-text {
      background: linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-pourpre) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Transition text */
    .transition-text {
      background: linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-mauve) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 600;
    }

    /* Background blobs */
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(40px);
      opacity: 0.3;
      animation: float 20s infinite;
    }

    /* Body text accessibility */
    body {
      line-height: 1.7;
      color: var(--brand-gray-dark);
    }

    p {
      line-height: 1.7;
    }
  `

  // Get enabled analytics providers
  const enabledProviders = analytics?.providers?.filter((p) => p.enabled) || []

  // Render custom elements
  const renderCustomElement = (element, index) => {
    const { type, attrs = {}, content, children } = element
    const Tag = type

    if (content) {
      return (
        <Tag
          key={index}
          {...attrs}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    } else if (children) {
      return (
        <Tag
          key={index}
          {...attrs}
        >
          {typeof children === 'string'
            ? children
            : children.map((child, i) => renderCustomElement(child, i))}
        </Tag>
      )
    } else {
      return (
        <Tag
          key={index}
          {...attrs}
        />
      )
    }
  }

  return (
    <head lang={lang}>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      />
      <title>{title}</title>

      {/* DNS Prefetch & Preconnect for External Resources */}
      {/* Render first DNS prefetch item (billetweb) */}
      {dnsPrefetch[0] && (
        <link
          rel="dns-prefetch"
          href={dnsPrefetch[0]}
        />
      )}
      {/* DNS Prefetch for enabled analytics providers (plausible) */}
      {enabledProviders.map(
        (provider, index) =>
          provider.dnsPrefetch && (
            <link
              key={`analytics-dns-${index}`}
              rel="dns-prefetch"
              href={provider.dnsPrefetch}
            />
          )
      )}
      {/* Render remaining DNS prefetch items (unpkg) */}
      {dnsPrefetch.slice(1).map((url, index) => (
        <link
          key={`dns-${index + 1}`}
          rel="dns-prefetch"
          href={url}
        />
      ))}
      <link
        rel="preconnect"
        href="https://unpkg.com"
        crossOrigin="anonymous"
      />

      {/* Preload Critical Resources */}
      {preload.map((resource, index) => {
        const { href, as, type, crossorigin, ...rest } = resource
        return (
          <link
            key={index}
            rel="preload"
            href={href}
            as={as}
            type={type}
            crossOrigin={crossorigin ? 'anonymous' : undefined}
            {...rest}
          />
        )
      })}

      {/* Standard Meta Tags */}
      <meta
        name="description"
        content={description}
      />
      <meta
        name="keywords"
        content={keywords}
      />
      <meta
        name="author"
        content={author}
      />
      <meta
        name="robots"
        content="index, follow"
      />
      <meta
        name="language"
        content="fr-FR"
      />

      {/* Open Graph Meta Tags (Facebook, LinkedIn, WhatsApp) */}
      <meta
        property="og:title"
        content={openGraph.title}
      />
      <meta
        property="og:description"
        content={openGraph.description}
      />
      <meta
        property="og:type"
        content={openGraph.type}
      />
      <meta
        property="og:url"
        content={openGraph.url}
      />
      <meta
        property="og:image"
        content={socialImage}
      />
      <meta
        property="og:image:width"
        content="1200"
      />
      <meta
        property="og:image:height"
        content="630"
      />
      <meta
        property="og:site_name"
        content={openGraph.siteName}
      />
      <meta
        property="og:locale"
        content={openGraph.locale}
      />

      {/* Twitter Card Meta Tags */}
      <meta
        name="twitter:card"
        content={twitter.card}
      />
      <meta
        name="twitter:title"
        content={twitter.title}
      />
      <meta
        name="twitter:description"
        content={twitter.description}
      />
      <meta
        name="twitter:image"
        content={socialImage}
      />
      <meta
        name="twitter:image:alt"
        content="Atelier sur le consentement - Merci pour ton non"
      />
      <meta
        name="twitter:site"
        content={twitter.site}
      />
      <meta
        name="twitter:creator"
        content={twitter.creator}
      />

      {/* Additional Social Media Tags */}
      <meta
        property="article:author"
        content={author}
      />
      <meta
        property="article:publisher"
        content={canonical}
      />

      {/* Canonical URL */}
      <link
        rel="canonical"
        href={canonical}
      />

      {/* Favicons */}
      {favicons.length > 0 ? (
        favicons.map((faviconItem, index) => (
          <link
            key={index}
            rel={faviconItem.rel}
            type={faviconItem.type}
            sizes={faviconItem.sizes}
            href={faviconItem.href}
          />
        ))
      ) : (
        <link
          rel="icon"
          href={favicon}
        />
      )}

      {/* Schema.org Markup for Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema.organization, null, 2),
        }}
      />

      {/* FAQ Schema Markup */}
      {schema.faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema.faqPage, null, 2),
          }}
        />
      )}

      {/* LocalBusiness Schema Markup */}
      {schema.localBusiness && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema.localBusiness, null, 2),
          }}
        />
      )}

      {/* Stylesheet */}
      <link
        rel="stylesheet"
        href={stylesheet}
      />

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Custom Head Elements */}
      {customElements.map((element, index) => renderCustomElement(element, index))}

      {/* Analytics Scripts - Rendered after custom elements per original HTML */}
      {enabledProviders.length > 0 && enabledProviders[0].name === 'plausible' && (
        <React.Fragment>
          <script
            async
            src="https://plausible.io/js/pa-uDEF1f-3lcur3O_VhvsaB.js"
          />
          <script
            dangerouslySetInnerHTML={{
              __html:
                'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();',
            }}
          />
        </React.Fragment>
      )}

      {/* Lucide Icons (Brand guideline: use icons instead of emojis) */}
      <script
        defer
        src="https://unpkg.com/lucide@latest"
      />
    </head>
  )
}

// ============================================================================
// SCRIPTS COMPONENT
// ============================================================================

/**
 * Scripts component - Generates all interactive JavaScript functionality
 */
export const Scripts = ({ scripts }) => {
  const { workshopDates, features, externalScripts } = scripts

  // Mobile menu functionality
  const mobileMenuScript = features.mobileMenu
    ? `
    // Mobile menu functionality
    document.addEventListener('DOMContentLoaded', function() {
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const closeMenuButton = document.getElementById('close-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      const menuOverlay = document.getElementById('menu-overlay');
      const menuSidebar = document.getElementById('menu-sidebar');
      const menuLinks = mobileMenu.querySelectorAll('a');

      function openMenu() {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
          menuSidebar.classList.remove('-translate-x-full');
        }, 10);
      }

      function closeMenu() {
        menuSidebar.classList.add('-translate-x-full');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300);
      }

      mobileMenuButton.addEventListener('click', openMenu);
      closeMenuButton.addEventListener('click', closeMenu);
      menuOverlay.addEventListener('click', closeMenu);

      menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    });
  `
    : ''

  // Workshop dates update script
  const workshopDatesScript =
    workshopDates && workshopDates.length > 0
      ? `
    // Update workshop dates
    document.addEventListener('DOMContentLoaded', function() {
      const workshopDates = ${JSON.stringify(workshopDates)}.map(d => new Date(d));
      const now = new Date();
      const nextDate = workshopDates.find(date => date > now);

      if (nextDate) {
        const options = { day: 'numeric', month: 'long' };
        const dateStr = nextDate.toLocaleDateString('fr-FR', options);

        const heroDateElement = document.getElementById('hero-next-date');
        const registrationDateElement = document.getElementById('registration-date');

        if (heroDateElement) heroDateElement.textContent = dateStr;
        if (registrationDateElement) registrationDateElement.textContent = dateStr;
      }
    });
  `
      : ''

  // Team card flip functionality
  const teamCardFlipScript = features.teamCardFlip
    ? `
    // Team card flip functionality
    document.addEventListener('DOMContentLoaded', function() {
      const teamCards = document.querySelectorAll('.team-card');

      teamCards.forEach(card => {
        card.addEventListener('click', function() {
          this.classList.toggle('flipped');
        });
      });
    });
  `
    : ''

  // Lucide icons initialization
  const lucideScript = features.lucideIcons
    ? `
    // Initialize Lucide icons
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  `
    : ''

  // Scroll-spy for active navigation highlighting
  const scrollSpyScript = features.scrollSpy
    ? `
    // Scroll-spy for active navigation links
    document.addEventListener('DOMContentLoaded', function() {
      const sections = ['atelier', 'temoignages', 'pour-qui', 'programme', 'infos-pratiques', 'mission', 'valeurs', 'equipe', 'faq'];
      const navLinks = document.querySelectorAll('nav a[href^="#"]');

      function updateActiveLink() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(sectionId => {
          const section = document.getElementById(sectionId);
          if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
              currentSection = sectionId;
            }
          }
        });

        navLinks.forEach(link => {
          link.classList.remove('text-orange');
          const href = link.getAttribute('href');
          if (href === '#' + currentSection) {
            link.classList.add('text-orange');
          }
        });
      }

      window.addEventListener('scroll', updateActiveLink);
      updateActiveLink();
    });
  `
    : ''

  // Combine all scripts (Billetweb uses shop_frame declarative approach, no JS init needed)
  const allScripts = [
    mobileMenuScript,
    workshopDatesScript,
    teamCardFlipScript,
    lucideScript,
    scrollSpyScript,
  ]
    .filter(Boolean)
    .join('\n\n')

  return (
    <>
      {/* Internal scripts */}
      {allScripts && <script dangerouslySetInnerHTML={{ __html: allScripts }} />}

      {/* External scripts */}
      {externalScripts &&
        externalScripts.map((script, index) => {
          const { src, defer, async, type, ...rest } = script
          return (
            <script
              key={index}
              src={src}
              defer={defer}
              async={async}
              type={type}
              {...rest}
            />
          )
        })}
    </>
  )
}

// ============================================================================
// GENERIC ATOMIC COMPONENTS
// ============================================================================

/**
 * Section - Generic section wrapper
 */
export const Section = ({ id, className = '', style = {}, children, tag = 'section' }) => {
  const Tag = tag
  return (
    <Tag
      id={id}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  )
}

/**
 * Container - Max-width container with padding
 */
export const Container = ({ maxWidth = 'max-w-7xl', className = '', children }) => {
  return <div className={`${maxWidth} mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
}

/**
 * Grid - Flexible grid layout
 */
export const Grid = ({
  cols = 1,
  colsMd = null,
  colsLg = null,
  gap = 6,
  className = '',
  children,
}) => {
  const gridCols = `grid-cols-${cols}`
  const gridColsMd = colsMd ? `md:grid-cols-${colsMd}` : ''
  const gridColsLg = colsLg ? `lg:grid-cols-${colsLg}` : ''
  const gridGap = `gap-${gap}`

  return (
    <div className={`grid ${gridCols} ${gridColsMd} ${gridColsLg} ${gridGap} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Flex - Flexbox layout
 */
export const Flex = ({
  direction = 'row',
  align = 'start',
  justify = 'start',
  gap = 4,
  wrap = false,
  className = '',
  children,
}) => {
  const flexDirection = direction === 'col' ? 'flex-col' : 'flex-row'
  const alignItems = `items-${align}`
  const justifyContent = `justify-${justify}`
  const flexGap = `gap-${gap}`
  const flexWrap = wrap ? 'flex-wrap' : ''

  return (
    <div
      className={`flex ${flexDirection} ${alignItems} ${justifyContent} ${flexGap} ${flexWrap} ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Text - Typography component (no default classes to avoid redundancy)
 */
export const Text = ({ level = 'p', color, size, weight, align, className = '', children }) => {
  const Tag = level
  const textColor = color ? `text-${color}` : ''
  const textSize = size ? `text-${size}` : ''
  const textWeight = weight ? `font-${weight}` : ''
  const textAlign = align ? `text-${align}` : ''

  return (
    <Tag className={`${textColor} ${textSize} ${textWeight} ${textAlign} ${className}`.trim()}>
      {children}
    </Tag>
  )
}

/**
 * Image - Image with lazy loading
 */
export const Image = ({ src, alt = '', width, height, loading = 'lazy', className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
    />
  )
}

/**
 * Link - Internal/external link
 */
export const Link = ({ href, external = false, className = '', children }) => {
  const attrs = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <a
      href={href}
      className={className}
      {...attrs}
    >
      {children}
    </a>
  )
}

/**
 * Button - CTA button
 */
export const Button = ({ href, variant = 'primary', size = 'md', className = '', children }) => {
  const baseClasses = 'rounded-full font-bold transition-colors duration-300'

  const variantClasses = {
    primary: 'bg-orange text-white hover:bg-orange-hover',
    secondary: 'bg-mauve text-white hover:bg-mauve-hover',
    outline: 'border-2 border-orange text-orange hover:bg-orange hover:text-white',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <a
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </a>
  )
}

/**
 * Icon - Lucide icon wrapper
 */
export const Icon = ({ name, size = 5, color, className = '' }) => {
  const iconSize = `w-${size} h-${size}`
  const iconColor = color ? `text-${color}` : ''

  return (
    <i
      data-lucide={name}
      className={`${iconSize} ${iconColor} ${className}`}
    ></i>
  )
}

/**
 * Badge - Inline badge
 */
export const Badge = ({ color = 'orange', className = '', children }) => {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-${color}-light text-${color} border border-${color} ${className}`}
    >
      {children}
    </span>
  )
}

/**
 * Card - Generic card component
 */
export const Card = ({ variant = 'default', color, padding = 6, className = '', children }) => {
  const baseClasses = 'rounded-lg'

  const variantClasses = {
    default: 'bg-white',
    colored: color ? `bg-${color}-light` : 'bg-white',
    bordered: `bg-white border border-gray-200`,
    borderTop: color
      ? `bg-white border-t-4 border-t-${color} border border-gray-200`
      : 'bg-white border',
  }

  const paddingClass = `p-${padding}`

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${paddingClass} ${className}`}>
      {children}
    </div>
  )
}

/**
 * List - Unordered/ordered list with icons
 */
export const List = ({ items, icon, iconColor, ordered = false, className = '' }) => {
  const Tag = ordered ? 'ol' : 'ul'

  return (
    <Tag className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3"
        >
          {icon && (
            <Icon
              name={icon}
              size={6}
              color={iconColor}
              className="mt-1 flex-shrink-0"
            />
          )}
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </Tag>
  )
}

/**
 * Timeline - Timeline item with pause support
 */
export const TimelineItem = ({
  title,
  description,
  color,
  time,
  isLast = false,
  isPause = false,
}) => {
  return (
    <div className={`relative pl-10 ${!isLast ? 'border-l-2 border-gray-200 pb-8' : 'pb-8'}`}>
      <div
        className={`absolute top-0 -left-3 h-6 w-6 rounded-full ${isPause ? 'border-4 border-white bg-gray-200' : `bg-${color}`}`}
      ></div>
      <div className="flex-1">
        <h3 className={`title-font ${isPause ? 'text-gray-600' : `text-${color}`} mb-1 text-lg`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600">{description}</p>
        {time && <span className="mt-1 block text-sm text-gray-500">{time}</span>}
      </div>
    </div>
  )
}

/**
 * Accordion - Collapsible content (FAQ item) using native <details>/<summary>
 */
export const AccordionItem = ({ question, answer }) => {
  // Check if answer contains HTML tags
  const isHTML = typeof answer === 'string' && /<[^>]+>/.test(answer)

  return (
    <details className="rounded-lg bg-white p-6">
      <summary className="text-bleu-fonce cursor-pointer list-none text-lg font-bold">
        {question}
      </summary>
      {isHTML ? (
        <div
          className="mt-4 text-gray-700"
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      ) : (
        <div className="mt-4 text-gray-700">{answer}</div>
      )}
    </details>
  )
}

/**
 * CustomHTML - Render custom HTML safely
 */
export const CustomHTML = ({ html, className = '' }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/**
 * TeamCard - Team member flip card with photo and bio (using saturated colors)
 */
export const TeamCard = ({ name, role, roleColor, image, bio }) => {
  return (
    <div className="team-card perspective group h-96 cursor-pointer">
      <div className="transform-style-3d relative h-full w-full transition-transform duration-500 group-hover:rotate-y-180">
        {/* Front of card */}
        <div className="absolute h-full w-full overflow-hidden rounded-lg shadow-lg backface-hidden">
          <div className="flex h-full flex-col">
            <div className={`flex-1 bg-${roleColor} flex items-center justify-center p-6`}>
              <img
                src={image}
                alt={name}
                className="h-48 w-48 rounded-full border-4 border-white object-cover shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <div className="bg-white p-6 text-center">
              <h3 className="title-font text-bleu-fonce mb-1 text-xl">{name}</h3>
              <p className={`text-${roleColor} font-semibold`}>{role}</p>
            </div>
          </div>
        </div>
        {/* Back of card */}
        <div
          className={`absolute h-full w-full backface-hidden bg-${roleColor} rotate-y-180 overflow-hidden rounded-lg shadow-lg`}
        >
          <div className="flex h-full flex-col overflow-y-auto p-6">
            <h3 className="title-font mb-2 text-xl text-white">{name}</h3>
            <p className="mb-4 font-semibold text-white opacity-90">{role}</p>
            <p className="text-sm leading-relaxed text-white">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// RECURSIVE RENDER COMPONENT
// ============================================================================

/**
 * Render - Recursively renders any component based on type
 * Supports bloc references via $ref and variable substitution
 */
export const Render = ({ element, blocs = [] }) => {
  if (!element || (!element.type && !element.$ref)) return null

  // Handle $ref (bloc reference with variable substitution)
  if (element.$ref) {
    const blocName = element.$ref
    const bloc = blocs.find((b) => b.name === blocName)

    if (!bloc) {
      console.warn(`Bloc not found: ${blocName}`)
      return null
    }

    // Clone bloc to avoid mutation
    let resolvedElement = JSON.parse(JSON.stringify(bloc))

    // Replace variables if vars provided
    if (element.vars) {
      const replaceVariables = (obj) => {
        if (typeof obj === 'string') {
          // Replace all $variable occurrences
          return obj.replace(/\$(\w+)/g, (match, varName) => {
            return element.vars[varName] !== undefined ? element.vars[varName] : match
          })
        } else if (Array.isArray(obj)) {
          return obj.map((item) => replaceVariables(item))
        } else if (obj && typeof obj === 'object') {
          const result = {}
          for (const [key, value] of Object.entries(obj)) {
            result[key] = replaceVariables(value)
          }
          return result
        }
        return obj
      }

      resolvedElement = replaceVariables(resolvedElement)
    }

    // Recursively render the resolved element
    return (
      <Render
        element={resolvedElement}
        blocs={blocs}
      />
    )
  }

  const { type, props = {}, children, content } = element

  // Component mapping
  const components = {
    section: Section,
    container: Container,
    grid: Grid,
    flex: Flex,
    text: Text,
    image: Image,
    link: Link,
    button: Button,
    icon: Icon,
    badge: Badge,
    card: Card,
    list: List,
    timeline: TimelineItem,
    accordion: AccordionItem,
    customHTML: CustomHTML,
    teamCard: TeamCard,
    // Basic HTML elements (pass-through)
    div: 'div',
    img: 'img',
    p: 'p',
    span: 'span',
    a: 'a',
  }

  const Component = components[type]

  if (!Component) {
    console.warn(`Unknown component type: ${type}`)
    return null
  }

  // Handle content (simple text/HTML)
  if (content && !children) {
    return <Component {...props}>{content}</Component>
  }

  // Handle children (recursive rendering)
  if (children && Array.isArray(children)) {
    return (
      <Component {...props}>
        {children.map((child, index) => (
          <Render
            key={index}
            element={child}
            blocs={blocs}
          />
        ))}
      </Component>
    )
  }

  // Handle no children
  return <Component {...props} />
}

// ============================================================================
// LEGACY LAYOUT COMPONENTS (Banner, Navigation)
// These are kept for now as they have complex interactive logic
// ============================================================================

/**
 * Banner - Top announcement banner
 */
export const Banner = ({ gradient, text }) => {
  return (
    <div
      className="relative py-3 text-center"
      style={{ background: gradient }}
    >
      <p className="text-sm font-semibold text-white sm:text-base">{text}</p>
    </div>
  )
}

/**
 * Navigation - Main navigation with mobile menu
 */
export const Navigation = ({ logo, logoAlt, links, cta, mobileLinks }) => {
  return (
    <>
      {/* Desktop & Mobile Navigation Bar */}
      <nav className="bg-opacity-90 fixed top-0 right-0 left-0 z-50 w-full bg-white shadow-lg backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center"
            >
              <img
                src={logo}
                alt={logoAlt}
                className="h-12 w-auto sm:h-14 lg:h-16"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-8 lg:flex">
              <div className="flex items-center space-x-6">
                {links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="hover:text-orange text-sm font-medium text-gray-700 transition"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <a
                href={cta.href}
                className={`rounded-full font-bold transition-colors duration-300 bg-${cta.color} text-white hover:bg-${cta.color}-hover px-6 py-3`}
              >
                <span>{cta.text}</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-button"
              className="rounded-lg p-2 transition hover:bg-gray-100 lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className="fixed inset-0 z-50 hidden"
      >
        <div
          id="menu-overlay"
          className="bg-bleu-fonce/50 fixed inset-0 backdrop-blur-sm transition-opacity"
        ></div>
        <div
          id="menu-sidebar"
          className="fixed top-0 left-0 flex h-screen w-80 max-w-[85%] -translate-x-full transform flex-col bg-white shadow-xl transition-transform duration-300"
        >
          <div className="flex items-center justify-between p-4">
            <img
              src={logo}
              alt={logoAlt}
              className="h-10 w-auto"
              loading="lazy"
            />
            <button
              id="close-menu-button"
              className="rounded-lg p-2 transition hover:bg-gray-100"
              aria-label="Fermer le menu"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-6">
            <ul className="space-y-2">
              {mobileLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="hover:text-orange hover:bg-orange-light block rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <a
                href={cta.href}
                className={`rounded-full font-bold transition-colors duration-300 bg-${cta.color} text-white hover:bg-${cta.color}-hover block w-full px-6 py-4 text-center text-lg shadow-lg`}
              >
                <span>{cta.text}</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
