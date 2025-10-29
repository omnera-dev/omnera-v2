/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

interface VersionMismatch {
  package: string
  packageJsonVersion: string
  documentPath: string
  documentVersion: string
  line?: number
}

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

/**
 * Validate that documentation files contain correct package versions
 * matching those in package.json
 */
class DocsVersionValidator {
  private packageJson: PackageJson
  private mismatches: VersionMismatch[] = []

  // Key packages to validate (those commonly referenced in docs)
  private readonly packagesToCheck = [
    'hono',
    'tailwindcss',
    '@tailwindcss/postcss',
    'better-auth',
    'drizzle-orm',
    'drizzle-kit',
    'prettier-plugin-tailwindcss',
    'effect',
    'react',
    'zod',
    '@tanstack/react-query',
    '@tanstack/react-table',
    'typescript',
    'bun-types',
    '@types/bun',
  ]

  constructor() {
    const packageJsonPath = join(process.cwd(), 'package.json')
    this.packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  }

  /**
   * Get the actual version from package.json
   */
  private getPackageVersion(packageName: string): string | undefined {
    return (
      this.packageJson.dependencies?.[packageName] ||
      this.packageJson.devDependencies?.[packageName] ||
      this.packageJson.peerDependencies?.[packageName]
    )
  }

  /**
   * Extract version number from a version string (removes ^ ~ etc)
   */
  private extractVersionNumber(versionString: string): string {
    // Remove common prefixes
    return versionString.replace(/^[\^~>=<]/, '').trim()
  }

  /**
   * Check a single file for version mismatches
   */
  private checkFile(filePath: string): void {
    const content = readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')

    for (const packageName of this.packagesToCheck) {
      const actualVersion = this.getPackageVersion(packageName)
      if (!actualVersion) continue

      const actualVersionNum = this.extractVersionNumber(actualVersion)

      // Create various patterns to match version references
      const patterns = [
        // In tables: | **Package** | Version |
        new RegExp(`\\*\\*${packageName.replace('/', '\\/')}\\*\\*.*\\|\\s*([\\d.\\^~]+)`, 'i'),
        // In version fields: **Version**: X.X.X
        new RegExp(
          `\\*\\*Version\\*\\*:\\s*[\\^~]?([\\d.]+).*${packageName.replace('/', '\\/')}`,
          'i'
        ),
        // In JSON blocks: "package": "version"
        new RegExp(`"${packageName.replace('/', '\\/')}":\\s*"([^"]+)"`, 'g'),
        // Generic version mention: package version X.X.X or package X.X.X
        new RegExp(`${packageName.replace('/', '\\/')}[\\s\\w]*(?:version)?\\s*([\\d.]+)`, 'i'),
      ]

      // Special handling for specific packages in specific files
      if (filePath.includes('CLAUDE.md') || filePath.includes('README.md')) {
        // Check Core Stack tables
        if (packageName === 'tailwindcss') {
          patterns.push(/\*\*Tailwind CSS\*\*\s*\|\s*([\d.]+)/)
        }
        if (packageName === 'hono') {
          patterns.push(/\*\*Hono\*\*\s*\|\s*([\d.]+)/)
        }
        if (packageName === 'better-auth') {
          patterns.push(/\*\*Better Auth\*\*\s*\|\s*([\d.]+)/)
        }
        if (packageName === 'drizzle-orm') {
          patterns.push(/\*\*Drizzle ORM\*\*\s*\|\s*\^?([\d.]+)/)
        }
      }

      // Check each line for version references
      lines.forEach((line, index) => {
        for (const pattern of patterns) {
          const matches = line.matchAll(pattern)
          for (const match of matches) {
            if (match[1]) {
              const documentVersion = this.extractVersionNumber(match[1])

              // Compare versions
              if (
                documentVersion !== actualVersionNum &&
                !documentVersion.startsWith(actualVersionNum) &&
                !actualVersionNum.startsWith(documentVersion)
              ) {
                // Check if this is not just a different patch version that's acceptable
                const [docMajor, docMinor] = documentVersion.split('.')
                const [actualMajor, actualMinor] = actualVersionNum.split('.')

                // Report if major or minor versions differ
                if (docMajor !== actualMajor || docMinor !== actualMinor) {
                  this.mismatches.push({
                    package: packageName,
                    packageJsonVersion: actualVersion,
                    documentPath: filePath,
                    documentVersion: match[1],
                    line: index + 1,
                  })
                }
              }
            }
          }
        }
      })
    }
  }

  /**
   * Recursively find all markdown files
   */
  private findMarkdownFiles(dir: string): string[] {
    const files: string[] = []

    const items = readdirSync(dir)
    for (const item of items) {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)

      // Skip node_modules and hidden directories
      if (item.startsWith('.') || item === 'node_modules' || item === 'dist') {
        continue
      }

      if (stat.isDirectory()) {
        files.push(...this.findMarkdownFiles(fullPath))
      } else if (item.endsWith('.md')) {
        files.push(fullPath)
      }
    }

    return files
  }

  /**
   * Run the validation
   */
  public async validate(): Promise<void> {
    console.log('🔍 Validating documentation versions against package.json...\n')

    // Check main documentation files
    const docsToCheck = ['CLAUDE.md', 'README.md']

    // Check each main doc
    for (const doc of docsToCheck) {
      const docPath = join(process.cwd(), doc)
      try {
        this.checkFile(docPath)
      } catch {
        // File might not exist
      }
    }

    // Check all markdown files in docs/ directory
    const docsDir = join(process.cwd(), 'docs')
    try {
      statSync(docsDir)
      const markdownFiles = this.findMarkdownFiles(docsDir)
      console.log(`📂 Checking ${markdownFiles.length} documentation files in docs/...`)
      for (const file of markdownFiles) {
        this.checkFile(file)
      }
    } catch {
      // docs directory doesn't exist
    }

    // Report results
    if (this.mismatches.length === 0) {
      console.log('✅ All documentation versions match package.json!\n')
    } else {
      console.log(`❌ Found ${this.mismatches.length} version mismatches:\n`)

      for (const mismatch of this.mismatches) {
        const relativePath = mismatch.documentPath.replace(process.cwd() + '/', '')
        console.log(`📄 ${relativePath}${mismatch.line ? `:${mismatch.line}` : ''}`)
        console.log(`   Package: ${mismatch.package}`)
        console.log(`   package.json: ${mismatch.packageJsonVersion}`)
        console.log(`   documentation: ${mismatch.documentVersion}`)
        console.log('')
      }

      console.log(
        '💡 To fix these mismatches, update the documentation files with the correct versions from package.json.'
      )
      process.exit(1)
    }
  }
}

// Run the validator
const validator = new DocsVersionValidator()
validator.validate().catch(console.error)
