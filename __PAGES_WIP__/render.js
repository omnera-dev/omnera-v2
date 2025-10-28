import React from 'react'
import { renderToString } from 'react-dom/server'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Import all components
import * as Components from './components.jsx'

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read page configuration
const pageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'page.json'), 'utf-8'))

/**
 * Render the complete page
 */
function renderPage() {
  const { meta, theme, layout, sections, scripts, blocs = [] } = pageConfig

  // NO MORE BUSINESS LOGIC - Use generic Render component for all sections

  // Render Head component
  const headContent = renderToString(
    <Components.Head
      meta={meta}
      theme={theme}
    />
  )

  // Render the full page structure using generic Render component
  const bodyContent = renderToString(
    <>
      {layout.banner.enabled && (
        <Components.Banner
          gradient={layout.banner.gradient}
          text={layout.banner.text}
        />
      )}
      <Components.Navigation
        logo={layout.navigation.logo}
        logoAlt={layout.navigation.logoAlt}
        links={layout.navigation.links.desktop}
        cta={layout.navigation.cta}
        mobileLinks={layout.navigation.links.mobile}
      />
      {sections.map((section, index) => (
        <Components.Render
          key={index}
          element={section}
          blocs={blocs}
        />
      ))}
    </>
  )

  // Render Scripts component
  const scriptsContent = renderToString(<Components.Scripts scripts={scripts} />)

  // Generate complete HTML
  const html = `<!DOCTYPE html>
<html lang="${meta.lang}">
${headContent}
<body>
${bodyContent}
${scriptsContent}
</body>
</html>`

  return html
}

/**
 * Main function to generate and save HTML
 */
function main() {
  console.log('🚀 Generating HTML from React components and page.json...')

  try {
    const html = renderPage()

    // Write to index.html
    // Write to root directory (parent of generated/)
    const outputPath = path.join(__dirname, '..', 'new-index.html')
    fs.writeFileSync(outputPath, html, 'utf-8')

    console.log('✅ HTML generated successfully!')
    console.log(`📄 Output: ${outputPath}`)
  } catch (error) {
    console.error('❌ Error generating HTML:', error)
    process.exit(1)
  }
}

// Run the main function
main()
