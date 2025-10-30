# TDD Pipeline Optimization Roadmap

> **Status**: Phase 1 (Quality Gates) ✅ **COMPLETED**
> **Created**: 2025-01-30
> **Last Updated**: 2025-01-30

## Overview

This document outlines the optimization roadmap for the TDD automation pipeline, leveraging Claude Code agents and skills to improve quality, automation, and observability.

The optimization is organized into 3 phases:

- **Phase 1 (Quality Gates)** ✅ COMPLETED - Prevent low-quality implementations
- **Phase 2 (Automation Enhancement)** - Reduce manual intervention
- **Phase 3 (Observability)** - Improve monitoring and decision-making

---

## Phase 1: Quality Gates ✅ COMPLETED

**Goal**: Prevent bad specs and implementations from entering the pipeline.

**Status**: ✅ All 3 sub-phases completed

### Phase 1.1: Schema Validation in Queue Population ✅

**Implemented**: 2025-01-30

**What was added**:

- Created `scripts/tdd-automation/validate-schemas-for-specs.ts`
- Integrated schema validation step in `.github/workflows/tdd-queue-populate.yml`
- Validates JSON Schema files before creating GitHub issues

**Validation checks**:

- Schema file exists (co-located with test file)
- Valid JSON parsing
- Metadata presence ($id, title, type)
- Triple-Documentation Pattern (description ≥10 chars, examples array)
- x-specs array structure (if present)
- Spec ID format validation (PREFIX-ENTITY-NNN pattern)
- Spec ID uniqueness within file
- Internal $ref resolution

**Benefit**: Prevents bad specs from causing failed implementations (fail-fast at queue entry).

### Phase 1.2: Security Scanning in Validation ✅

**Implemented**: 2025-01-30

**What was added**:

- Created `scripts/tdd-automation/security-scan.ts`
- Integrated security scan step in `.github/workflows/tdd-validate.yml`
- Scans changed files for common security vulnerabilities

**Security patterns checked**:

- **Critical**: Hardcoded secrets (API keys, passwords, tokens, AWS keys, Stripe keys, GitHub tokens)
- **High**: SQL injection, XSS (dangerouslySetInnerHTML), Command injection
- **Medium**: Weak hashing (MD5/SHA1), eval() usage
- **Low**: Sensitive data in console.log

**Behavior**:

- **CRITICAL issues**: Block merge (exit code 1)
- **HIGH/MEDIUM/LOW issues**: Warn but don't block

**Benefit**: Catches security anti-patterns early, prevents vulnerabilities from reaching production.

### Phase 1.3: Best Practices Guidance in Queue Processor ✅

**Implemented**: 2025-01-30

**What was added**:

- Enhanced auto-invocation comment in `.github/workflows/tdd-queue-processor.yml`
- Explicitly mentions `best-practices-checker` skill in implementation instructions
- Provides specific framework patterns to validate

**Framework patterns mentioned**:

- Effect.gen for Application layer workflows
- Typed errors (Data.TaggedError) in Domain layer
- Drizzle query builder (not raw SQL)
- React 19 patterns (no manual useMemo)
- Hono RPC with Zod validation

**Benefit**: Ensures Claude Code validates framework patterns during implementation, reducing anti-pattern proliferation.

---

## Phase 2: Automation Enhancement ✅ (Phases 2.1-2.3 Complete, 2.4 Deferred)

**Goal**: Reduce manual intervention and improve automation intelligence.

**Status**: ✅ Mostly Complete (Phases 2.1-2.3 implemented, 2.4 deferred as low priority)

**Actual Effort**: ~2.5 hours (vs. estimated 9-13 hours - discovery that 2.1 was already implemented saved significant time)

### Phase 2.1: Duplication Detection Pre-Queue ✅

**Status**: ✅ Already Implemented (Verified 2025-01-30)

**Priority**: HIGH
**Actual Effort**: 0 hours (discovery that existing implementation already covers this)

**Objective**: Prevent duplicate spec issues from being created.

**Verification Findings**:

Upon examination of the codebase, discovered that **duplication prevention is already fully implemented** with sophisticated optimizations:

**Code-Level Prevention** (`scripts/tdd-automation/queue-manager.ts` lines 703-714):

```typescript
const commandPopulate = Effect.gen(function* () {
  const result = yield* scanForFixmeSpecs

  // OPTIMIZATION 1: Bulk deduplication (1 API call instead of N)
  const existingSpecIds = yield* getAllExistingSpecs

  // Filter specs that don't have issues yet
  const specsToCreate = result.specs.filter((spec) => !existingSpecIds.has(spec.specId))
  const alreadyExist = result.totalSpecs - specsToCreate.length

  yield* logInfo(`  Already exist: ${alreadyExist}`, '✓')

  // OPTIMIZATION 2: Parallel batching (create 10 issues concurrently)
  const createIssueEffect = (spec: SpecItem) =>
    createSpecIssue(spec, true).pipe(Effect.catchAll(() => Effect.succeed(-1)))

  yield* progress('Creating issues in parallel batches (concurrency: 10)...')
  const issueNumbers = yield* Effect.all(specsToCreate.map(createIssueEffect), {
    concurrency: 10,
  })
})
```

**Workflow-Level Prevention** (`.github/workflows/tdd-queue-populate.yml` lines 32-35):

```yaml
# Allow concurrent population (idempotent - skips duplicates)
concurrency:
  group: tdd-queue-populate
  cancel-in-progress: true
```

**Benefits Already Achieved**:

1. ✅ **Bulk fetch optimization**: Single API call to fetch all existing issues via `getAllExistingSpecs`
2. ✅ **Efficient filtering**: O(1) lookup using `Set.has()` for duplicate detection
3. ✅ **Parallel creation**: Creates 10 issues concurrently for performance
4. ✅ **Workflow-level concurrency control**: Prevents simultaneous populate runs
5. ✅ **Idempotent design**: Safe to run multiple times without creating duplicates

**Conclusion**: No additional work needed. The existing implementation is more sophisticated than the originally planned approach (individual checks per spec).

### Phase 2.2: Auto-Refactor Trigger After Completion ✅

**Status**: ✅ Implemented (2025-01-30)

**Priority**: MEDIUM
**Actual Effort**: ~30 minutes

**Objective**: Automatically invoke codebase-refactor-auditor after spec implementation to clean up code duplication.

**Implementation**:

Added post-completion step in `.github/workflows/tdd-validate.yml` (lines 283-313) that automatically posts a refactoring review request after successful spec validation:

```yaml
- name: Trigger refactoring review
  if: steps.result.outputs.success == 'true' && steps.issue.outputs.has_issue == 'true'
  run: |
    ISSUE_NUMBER="${{ steps.issue.outputs.issue_number }}"
    SPEC_ID="${{ steps.spec.outputs.spec_id }}"
    TEST_FILE="${{ steps.test_file.outputs.test_file }}"

    echo "🔄 Triggering post-implementation refactoring review..."

    gh issue comment "$ISSUE_NUMBER" --body "@claude

    ## 🔄 Post-Implementation Refactoring Review

    The spec **$SPEC_ID** has been implemented successfully. Please use the **codebase-refactor-auditor** agent to:

    1. Analyze changed files for code duplication
    2. Identify opportunities to extract shared logic
    3. Suggest refactoring to improve maintainability

    **Scope**: Files changed in this spec implementation
    **Goal**: Eliminate duplication, improve code quality

    Use the **code-duplication-detector** skill to identify duplicate patterns.

    ---

    *Automated request from TDD validation workflow - This is a proactive quality improvement step.*"

    echo "✅ Refactoring review comment posted to issue #$ISSUE_NUMBER"
  env:
    GH_TOKEN: ${{ github.token }}
```

**Benefits Achieved**:

1. ✅ **Proactive code quality**: Automatically triggers refactoring analysis after each successful spec
2. ✅ **Reduced technical debt**: Catches duplication early before it spreads
3. ✅ **Non-blocking**: Runs as a separate comment, doesn't block spec completion
4. ✅ **Skill integration**: Explicitly mentions `code-duplication-detector` skill for targeted analysis

**Files Modified**:

- Modified: `.github/workflows/tdd-validate.yml` (added post-completion step at lines 283-313)

### Phase 2.3: Dependency Tracking with dependency-tracker ✅

**Status**: ✅ Implemented (2025-01-30)

**Priority**: MEDIUM
**Actual Effort**: ~2 hours

**Objective**: Track which specs depend on each other and optimize processing order.

**Implementation**:

Created `scripts/tdd-automation/analyze-spec-dependencies.ts` that:
1. Reads all spec files from `tdd-queue-scan.json`
2. Analyzes test file imports to identify dependencies
3. Determines which dependencies exist vs. missing
4. Categorizes dependencies by layer (domain/application/infrastructure/presentation)
5. Stores dependency graph in `.github/tdd-queue-dependencies.json`

Modified `scripts/tdd-automation/queue-manager.ts` (`getNextSpec` function, lines 546-656):
1. Loads dependency graph if it exists
2. Separates ready specs (no missing dependencies) from blocked specs
3. Prioritizes ready specs over blocked specs
4. Warns if selected spec has missing dependencies

Integrated into `.github/workflows/tdd-queue-populate.yml` (lines 73-78):
```yaml
- name: Analyze spec dependencies
  id: dependencies
  run: |
    echo "🔗 Analyzing spec dependencies..."
    bun run scripts/tdd-automation/analyze-spec-dependencies.ts
  continue-on-error: false
```

**Example dependency graph output**:

```json
{
  "APP-PAGES-PRODUCT-007": {
    "specId": "APP-PAGES-PRODUCT-007",
    "testFile": "specs/app/pages/product.spec.ts",
    "dependencies": [
      {
        "file": "src/domain/models/product.ts",
        "exists": false,
        "layer": "domain"
      }
    ],
    "missingDependencies": ["src/domain/models/product.ts"],
    "canImplement": false,
    "blockedBy": []
  },
  "APP-TABLE-SCHEMA-001": {
    "specId": "APP-TABLE-SCHEMA-001",
    "testFile": "specs/app/table/schema.spec.ts",
    "dependencies": [],
    "missingDependencies": [],
    "canImplement": true,
    "blockedBy": []
  }
}
```

**Queue priority logic** (queue-manager.ts lines 595-635):

```typescript
// Separate ready specs from blocked specs
const readySpecs: typeof queuedSpecs = []
const blockedSpecs: typeof queuedSpecs = []

for (const spec of queuedSpecs) {
  const depInfo = dependencyGraph[spec.specId]
  if (depInfo && depInfo.canImplement) {
    readySpecs.push(spec)
  } else if (depInfo && !depInfo.canImplement) {
    blockedSpecs.push(spec)
  } else {
    // If not in dependency graph, treat as ready (backward compatibility)
    readySpecs.push(spec)
  }
}

// Prioritize ready specs
prioritizedSpecs = [...readySpecs, ...blockedSpecs]

if (readySpecs.length > 0) {
  yield* logInfo(`✅ ${readySpecs.length} spec(s) ready to implement`)
}
```

**Benefits Achieved**:

1. ✅ **Reduced implementation failures**: Specs with missing dependencies are deprioritized
2. ✅ **Optimized implementation order**: Ready specs are processed first
3. ✅ **Visibility into blockers**: Shows which specs are blocked and why
4. ✅ **Layer-aware analysis**: Categorizes dependencies by architectural layer
5. ✅ **Backward compatible**: Falls back to FIFO if dependency graph doesn't exist

**Files Created/Modified**:

- Created: `scripts/tdd-automation/analyze-spec-dependencies.ts` (280 lines)
- Modified: `scripts/tdd-automation/queue-manager.ts` (getNextSpec function, added 110 lines)
- Modified: `.github/workflows/tdd-queue-populate.yml` (added dependency analysis step)

### Phase 2.4: Enhanced Failure Reporting

**Priority**: LOW
**Estimated Effort**: ~2-3 hours

**Objective**: Provide richer failure context when validation fails.

**Implementation**:

1. Create `scripts/tdd-automation/generate-failure-report.ts`
2. Integrate into `tdd-validate.yml` workflow on failure
3. Generate structured failure report with:
   - Test output with colorized diffs
   - Relevant log snippets
   - Suggested fixes based on error patterns
   - Links to relevant documentation

**Example failure report**:

```markdown
## ❌ Validation Failure Report

**Spec ID**: APP-PAGES-PRODUCT-007
**Failure Type**: Spec Test Failed

### Test Output

\`\`\`
Expected: <ProductCard title="Product A" />
Received: <ProductCard title="undefined" />

Difference:

- title="Product A"

* title="undefined"
  \`\`\`

### Likely Cause

The `title` prop is not being passed to the `ProductCard` component.

### Suggested Fix

Check the Product schema and ensure the `title` field is included in the query result.

### Relevant Documentation

- [Product Schema](docs/specifications/schemas/tables/products.schema.json)
- [React Props Best Practices](docs/infrastructure/ui/react.md#props)
```

**Benefit**: Reduces debugging time for failed implementations.

**Files to create**:

- Create: `scripts/tdd-automation/generate-failure-report.ts`
- Modify: `.github/workflows/tdd-validate.yml` (add report generation on failure)

---

## Phase 3: Observability (PLANNED)

**Goal**: Improve monitoring, metrics collection, and decision-making.

**Status**: 📋 Planned (not yet implemented)

**Estimated Effort**: ~12-16 hours

### Phase 3.1: Metrics Collection and Dashboard

**Priority**: HIGH
**Estimated Effort**: ~4-5 hours

**Objective**: Track pipeline performance metrics for continuous improvement.

**Implementation**:

1. Create `scripts/tdd-automation/collect-metrics.ts`
2. Collect metrics on each workflow run:
   - Spec processing time (queue → completion)
   - Success rate (first attempt vs. retries)
   - Failure types (test, quality, security, regression)
   - Queue depth over time
3. Store metrics in `.github/tdd-metrics.json`
4. Generate dashboard in `TDD-METRICS.md`

**Metrics to track**:

```json
{
  "timestamp": "2025-01-30T10:00:00Z",
  "queue": {
    "total": 500,
    "queued": 120,
    "in_progress": 1,
    "completed": 350,
    "failed": 29
  },
  "performance": {
    "avg_processing_time_minutes": 18.5,
    "success_rate_first_attempt": 0.72,
    "retry_rate": 0.23,
    "failure_rate": 0.05
  },
  "failures_by_type": {
    "spec_test": 15,
    "regression": 8,
    "quality": 4,
    "security": 2
  }
}
```

**Dashboard example**:

```markdown
# TDD Pipeline Metrics

**Last Updated**: 2025-01-30 10:00 AM

## Queue Status

- Total specs: 500
- ✅ Completed: 350 (70%)
- 🏃 In Progress: 1
- 📋 Queued: 120 (24%)
- ❌ Failed: 29 (6%)

## Performance

- Avg processing time: 18.5 minutes
- Success rate (first attempt): 72%
- Retry rate: 23%
- Failure rate: 5%

## Failure Analysis

- Spec test failures: 15 (52%)
- Regression failures: 8 (28%)
- Quality failures: 4 (14%)
- Security failures: 2 (7%)

## Trends (7 days)

- Processing time: ⬇️ -12% (improving)
- Success rate: ⬆️ +8% (improving)
- Queue depth: ⬇️ -45% (decreasing)
```

**Benefit**: Data-driven pipeline improvements, identify bottlenecks, track progress.

**Files to create**:

- Create: `scripts/tdd-automation/collect-metrics.ts`
- Create: `scripts/tdd-automation/generate-dashboard.ts`
- Modify: All workflows to call `collect-metrics.ts` on completion

### Phase 3.2: Configuration Audit with config-validator

**Priority**: MEDIUM
**Estimated Effort**: ~3-4 hours

**Objective**: Validate TDD pipeline configuration files for correctness and consistency.

**Implementation**:

1. Create `scripts/tdd-automation/validate-pipeline-config.ts`
2. Invoke `config-validator` skill to check:
   - GitHub Actions workflow syntax
   - Label consistency across workflows
   - Script paths and commands
   - Environment variable usage
3. Run validation on config changes (pre-commit or CI)

**Validations**:

- All `gh issue` commands use correct labels
- All `bun run` commands reference existing scripts
- All environment variables are defined
- Workflow step dependencies are correct
- Timeout values are reasonable

**Benefit**: Prevents configuration errors from breaking the pipeline.

**Files to create**:

- Create: `scripts/tdd-automation/validate-pipeline-config.ts`
- Add to: `.github/workflows/` (pre-merge validation)

### Phase 3.3: Complexity Estimation Before Processing

**Priority**: LOW
**Estimated Effort**: ~4-5 hours

**Objective**: Estimate spec complexity before processing to better manage expectations.

**Implementation**:

1. Create `scripts/tdd-automation/estimate-complexity.ts`
2. Analyze spec characteristics:
   - Number of test assertions
   - Dependencies on other files
   - Schema complexity
   - New vs. existing functionality
3. Add complexity label to issue (`complexity:low`, `complexity:medium`, `complexity:high`)
4. Adjust retry limits based on complexity

**Complexity factors**:

```typescript
const complexity = {
  assertions: countAssertions(test), // More assertions = more complex
  dependencies: countDependencies(test), // More dependencies = more complex
  schemaFields: countSchemaFields(schema), // Larger schema = more complex
  isNew: !existingFile(implementation), // New file = more complex
}

const score =
  complexity.assertions * 1 +
  complexity.dependencies * 2 +
  complexity.schemaFields * 0.5 +
  (complexity.isNew ? 10 : 0)

const level = score < 10 ? 'low' : score < 25 ? 'medium' : 'high'
```

**Retry limits by complexity**:

- `complexity:low`: 3 retries
- `complexity:medium`: 5 retries
- `complexity:high`: 8 retries (or skip automated implementation)

**Benefit**: Better retry strategies, identifies specs that may need manual implementation.

**Files to create**:

- Create: `scripts/tdd-automation/estimate-complexity.ts`
- Modify: `scripts/tdd-automation/queue-manager.ts` (add complexity estimation in `populate`)
- Modify: `.github/workflows/tdd-validate.yml` (adjust retry logic based on complexity label)

---

## Implementation Priority

### Immediate (Phase 2.1 - Week 1)

1. **Duplication Detection Pre-Queue** - Highest ROI, prevents root cause issue

### Short-term (Phase 2.2-2.4 - Weeks 2-3)

2. **Auto-Refactor Trigger** - Reduces technical debt
3. **Dependency Tracking** - Improves success rate
4. **Enhanced Failure Reporting** - Reduces debugging time

### Medium-term (Phase 3.1-3.2 - Weeks 4-5)

5. **Metrics Collection** - Enables data-driven improvements
6. **Configuration Audit** - Prevents config errors

### Long-term (Phase 3.3 - Week 6)

7. **Complexity Estimation** - Fine-tunes retry strategies

---

## Success Metrics

After implementing all phases, we expect to see:

**Quality Improvements**:

- 📉 Schema validation errors: **-100%** (blocked at queue entry)
- 📉 Security vulnerabilities: **-80%** (caught early)
- 📉 Framework anti-patterns: **-60%** (guided by best-practices-checker)

**Efficiency Improvements**:

- 📉 Duplicate issues: **-100%** (detected before creation)
- 📈 First-attempt success rate: **+20%** (better dependencies, complexity awareness)
- 📉 Average processing time: **-15%** (optimized queue order)

**Observability Improvements**:

- 📊 Pipeline metrics dashboard: **Available**
- 📊 Failure analysis reports: **Automated**
- 📊 Configuration validation: **Automated**

---

## Maintenance

**Review Schedule**:

- **Monthly**: Review metrics dashboard, identify new optimization opportunities
- **Quarterly**: Audit pipeline configuration for correctness
- **Yearly**: Major refactor based on accumulated learnings

**Ownership**:

- Pipeline maintainers should review this roadmap quarterly
- Update status as phases are completed
- Add new phases as requirements evolve

---

## Related Documentation

- [TDD Automation Pipeline](./tdd-automation-pipeline.md) - Main TDD pipeline documentation
- [TDD Queue Manager](../../scripts/tdd-automation/queue-manager.ts) - Queue management script
- [GitHub Workflows](../../.github/workflows/) - Pipeline workflows
- [Claude Code Agents](./../.claude/agents/) - Available agents
- [Claude Code Skills](./../.claude/skills/) - Available skills

---

**Last Updated**: 2025-01-30
**Next Review**: 2025-02-30
