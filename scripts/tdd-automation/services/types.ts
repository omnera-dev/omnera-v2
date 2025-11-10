/**
 * Copyright (c) 2025 ESSENTIAL SERVICES
 *
 * This source code is licensed under the Business Source License 1.1
 * found in the LICENSE.md file in the root directory of this source tree.
 */

/**
 * Shared types for TDD Queue services
 */

/**
 * Represents a single spec with fixme
 */
export interface SpecItem {
  specId: string
  file: string
  line: number
  description: string
  feature: string
  priority: number
}

/**
 * Represents a GitHub issue for a spec
 */
export interface SpecIssue {
  number: number
  specId: string
  state: 'queued' | 'in-progress' | 'completed' | 'failed'
  url: string
  createdAt: string
  updatedAt: string
  labels?: string[]
  testFile?: string // Optional: test file path extracted from issue body
}

/**
 * Scan result containing all specs with fixme
 */
export interface QueueScanResult {
  timestamp: string
  totalSpecs: number
  specs: SpecItem[]
}
