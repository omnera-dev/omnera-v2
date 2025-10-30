#!/usr/bin/env bun
/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Lightweight Security Scanner for TDD Pipeline
 *
 * Performs basic static analysis for common security vulnerabilities:
 * - Hardcoded secrets (API keys, passwords, tokens)
 * - Dangerous functions (eval, dangerouslySetInnerHTML)
 * - SQL injection patterns
 * - Command injection risks
 *
 * This is NOT a replacement for comprehensive security audits.
 * Use the security-scanner skill for detailed analysis.
 */

import * as fs from 'node:fs'
import * as Effect from 'effect/Effect'
import * as Layer from 'effect/Layer'
import {
  CommandService,
  CommandServiceLive,
  LoggerServicePretty,
  logInfo,
  logError,
  logWarn,
  success,
} from '../lib/effect'

interface SecurityIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  category: string
  file: string
  line: number
  pattern: string
  description: string
  remediation: string
}

/**
 * Security patterns to scan for
 */
const SECURITY_PATTERNS = [
  // Critical: Hardcoded secrets
  {
    pattern: /(?:api[_-]?key|apikey)['"]?\s*[:=]\s*['"][^'"]{20,}['"]/gi,
    severity: 'CRITICAL' as const,
    category: 'Hardcoded Secrets',
    description: 'Potential hardcoded API key found',
    remediation: 'Move API key to environment variable (process.env.API_KEY)',
  },
  {
    pattern: /password['"]?\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'CRITICAL' as const,
    category: 'Hardcoded Secrets',
    description: 'Potential hardcoded password found',
    remediation: 'Move password to environment variable',
  },
  {
    pattern: /sk_live_[a-zA-Z0-9]{24,}/g,
    severity: 'CRITICAL' as const,
    category: 'Hardcoded Secrets',
    description: 'Stripe live API key found',
    remediation: 'Rotate key immediately and use environment variable',
  },
  {
    pattern: /AKIA[0-9A-Z]{16}/g,
    severity: 'CRITICAL' as const,
    category: 'Hardcoded Secrets',
    description: 'AWS access key found',
    remediation: 'Rotate key immediately and use AWS credentials provider',
  },
  {
    pattern: /ghp_[a-zA-Z0-9]{36}/g,
    severity: 'CRITICAL' as const,
    category: 'Hardcoded Secrets',
    description: 'GitHub personal access token found',
    remediation: 'Rotate token immediately and use GitHub App authentication',
  },

  // High: SQL Injection
  {
    pattern: /(?:SELECT|INSERT|UPDATE|DELETE).*\$\{[^}]+\}/gi,
    severity: 'HIGH' as const,
    category: 'SQL Injection',
    description: 'Potential SQL injection via string interpolation',
    remediation: 'Use parameterized queries or Drizzle ORM',
  },
  {
    pattern: /\.execute\([`][^`]*\$\{/g,
    severity: 'HIGH' as const,
    category: 'SQL Injection',
    description: 'SQL query with template literal and interpolation',
    remediation: 'Use parameterized queries: db.execute(query, [param])',
  },

  // High: XSS
  {
    pattern: /dangerouslySetInnerHTML/g,
    severity: 'HIGH' as const,
    category: 'XSS (Cross-Site Scripting)',
    description: 'Use of dangerouslySetInnerHTML detected',
    remediation: 'Sanitize HTML content with DOMPurify or avoid using dangerouslySetInnerHTML',
  },

  // High: Command Injection
  {
    pattern: /(?:exec|spawn|execSync|spawnSync)\([^)]*\$\{/g,
    severity: 'HIGH' as const,
    category: 'Command Injection',
    description: 'Potential command injection via string interpolation',
    remediation: 'Use array arguments instead of string interpolation',
  },

  // Medium: Weak Hashing
  {
    pattern: /\b(?:md5|sha1)\(/gi,
    severity: 'MEDIUM' as const,
    category: 'Weak Cryptography',
    description: 'Use of weak hashing algorithm (MD5/SHA1)',
    remediation: 'Use bcrypt, argon2, or scrypt for password hashing',
  },

  // Medium: Eval usage
  {
    pattern: /\beval\(/g,
    severity: 'MEDIUM' as const,
    category: 'Code Injection',
    description: 'Use of eval() detected',
    remediation:
      'Avoid eval() - use safe alternatives like JSON.parse() or Function constructor with validation',
  },

  // Low: Sensitive data in logs
  {
    pattern: /console\.log\([^)]*(?:password|token|secret|key)[^)]*\)/gi,
    severity: 'LOW' as const,
    category: 'Data Exposure',
    description: 'Potential sensitive data in console.log',
    remediation: 'Remove sensitive data from logs or use sanitized logging',
  },
]

/**
 * Scan a single file for security issues
 */
const scanFile = (filePath: string): SecurityIssue[] => {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  const issues: SecurityIssue[] = []

  SECURITY_PATTERNS.forEach((pattern) => {
    lines.forEach((line, index) => {
      const matches = line.matchAll(pattern.pattern)
      for (const match of matches) {
        // Skip comments (simple heuristic)
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
          continue
        }

        issues.push({
          severity: pattern.severity,
          category: pattern.category,
          file: filePath,
          line: index + 1,
          pattern: match[0].substring(0, 50), // Truncate long matches
          description: pattern.description,
          remediation: pattern.remediation,
        })
      }
    })
  })

  return issues
}

/**
 * Get list of files to scan from git diff
 */
const getChangedFiles = (cmd: CommandService): Effect.Effect<string[], never, never> => {
  return Effect.gen(function* () {
    // Get files changed in current branch compared to main
    const output = yield* cmd
      .exec('git diff --name-only origin/main...HEAD', {
        throwOnError: false,
      })
      .pipe(Effect.catchAll(() => Effect.succeed('')))

    const files = output
      .split('\n')
      .filter((file) => file.trim() !== '')
      .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file))
      .filter((file) => !file.includes('node_modules'))
      .filter((file) => !file.includes('.test.ts'))
      .filter((file) => !file.includes('.spec.ts'))
      .filter((file) => fs.existsSync(file))

    return files
  })
}

/**
 * Main security scan
 */
const securityScan = Effect.gen(function* () {
  const cmd = yield* CommandService

  yield* logInfo('Running security scan on changed files...', '🔒')
  yield* logInfo('')

  // Get changed files
  const files = yield* getChangedFiles(cmd)

  if (files.length === 0) {
    yield* logInfo('No files to scan (no changes detected)', 'ℹ️')
    return Effect.succeed({ critical: 0, high: 0, medium: 0, low: 0 })
  }

  yield* logInfo(`Scanning ${files.length} changed files...`, '📊')
  yield* logInfo('')

  // Scan each file
  const allIssues: SecurityIssue[] = []
  for (const file of files) {
    const issues = scanFile(file)
    allIssues.push(...issues)
  }

  // Group by severity
  const critical = allIssues.filter((i) => i.severity === 'CRITICAL')
  const high = allIssues.filter((i) => i.severity === 'HIGH')
  const medium = allIssues.filter((i) => i.severity === 'MEDIUM')
  const low = allIssues.filter((i) => i.severity === 'LOW')

  // Report findings
  if (critical.length > 0) {
    yield* logError('🔴 CRITICAL Issues:')
    for (const issue of critical) {
      yield* logError(`  ${issue.file}:${issue.line}`)
      yield* logError(`     ${issue.description}`)
      yield* logError(`     Pattern: ${issue.pattern}`)
      yield* logError(`     Fix: ${issue.remediation}`)
      yield* logInfo('')
    }
  }

  if (high.length > 0) {
    yield* logError('🟠 HIGH Issues:')
    for (const issue of high) {
      yield* logError(`  ${issue.file}:${issue.line}`)
      yield* logError(`     ${issue.description}`)
      yield* logError(`     Fix: ${issue.remediation}`)
      yield* logInfo('')
    }
  }

  if (medium.length > 0) {
    yield* logWarn('🟡 MEDIUM Issues:')
    for (const issue of medium) {
      yield* logWarn(`  ${issue.file}:${issue.line}`)
      yield* logWarn(`     ${issue.description}`)
      yield* logWarn(`     Fix: ${issue.remediation}`)
      yield* logInfo('')
    }
  }

  if (low.length > 0) {
    yield* logInfo('🔵 LOW Issues:', '')
    for (const issue of low) {
      yield* logInfo(`  ${issue.file}:${issue.line}`)
      yield* logInfo(`     ${issue.description}`)
      yield* logInfo('')
    }
  }

  // Summary
  yield* logInfo('─'.repeat(80))
  yield* logInfo('')
  yield* logInfo('📊 Security Scan Summary:', '')
  yield* logInfo(`   Files scanned: ${files.length}`)
  yield* logInfo(`   Total issues: ${allIssues.length}`)

  if (critical.length > 0) {
    yield* logError(`   🔴 CRITICAL: ${critical.length}`)
  }
  if (high.length > 0) {
    yield* logError(`   🟠 HIGH: ${high.length}`)
  }
  if (medium.length > 0) {
    yield* logWarn(`   🟡 MEDIUM: ${medium.length}`)
  }
  if (low.length > 0) {
    yield* logInfo(`   🔵 LOW: ${low.length}`)
  }

  yield* logInfo('')

  // Fail on critical issues, warn on others
  if (critical.length > 0) {
    yield* logError('❌ Security scan failed due to CRITICAL issues!')
    yield* logInfo('')
    yield* logInfo('CRITICAL issues must be fixed before merging.')
    yield* logInfo('For detailed security analysis, invoke the security-scanner skill.')
    return Effect.fail(new Error(`${critical.length} critical security issues found`))
  }

  if (high.length > 0 || medium.length > 0) {
    yield* logWarn('⚠️  Security scan passed with warnings')
    yield* logInfo('Consider fixing HIGH and MEDIUM issues before merging.')
  } else if (allIssues.length === 0) {
    yield* success('No security issues detected!')
  } else {
    yield* success('Security scan passed (low-severity issues only)')
  }

  return Effect.succeed({
    critical: critical.length,
    high: high.length,
    medium: medium.length,
    low: low.length,
  })
})

// Run scan
const program = securityScan

const runnable = program.pipe(
  Effect.provide(Layer.merge(CommandServiceLive, LoggerServicePretty()))
)

Effect.runPromise(runnable)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Security scan failed:', error)
    process.exit(1)
  })
