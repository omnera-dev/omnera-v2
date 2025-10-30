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

## Phase 2: Automation Enhancement (PLANNED)

**Goal**: Reduce manual intervention and improve automation intelligence.

**Status**: 📋 Planned (not yet implemented)

**Estimated Effort**: ~12-16 hours

### Phase 2.1: Duplication Detection Pre-Queue

**Priority**: HIGH
**Estimated Effort**: ~2-3 hours

**Objective**: Prevent duplicate spec issues from being created.

**Implementation**:
1. Create `scripts/tdd-automation/detect-duplicates-before-create.ts`
2. Integrate into `tdd-queue-populate.yml` workflow **before** creating issues
3. Check existing open issues for spec ID collision

**Logic**:
```typescript
// Before creating issue for spec ID "APP-PAGES-PRODUCT-007":
const existingIssues = await gh.issues.list({
  labels: ['tdd-automation'],
  state: 'open',
  search: 'APP-PAGES-PRODUCT-007'
})

if (existingIssues.length > 0) {
  console.log('⚠️  Issue already exists for APP-PAGES-PRODUCT-007 (Issue #X), skipping')
  continue
}
```

**Benefit**: Eliminates duplicate spec issues at creation time (root cause fix).

**Files to modify**:
- Create: `scripts/tdd-automation/detect-duplicates-before-create.ts`
- Modify: `.github/workflows/tdd-queue-populate.yml` (add step before populate)

### Phase 2.2: Auto-Refactor Trigger After Completion

**Priority**: MEDIUM
**Estimated Effort**: ~3-4 hours

**Objective**: Automatically invoke codebase-refactor-auditor after spec implementation to clean up code duplication.

**Implementation**:
1. Add post-completion step in `tdd-validate.yml`
2. When spec validation passes, create a comment invoking codebase-refactor-auditor agent
3. Agent analyzes changed files and suggests refactoring opportunities

**Workflow addition** (in `tdd-validate.yml` after "Mark spec as completed"):
```yaml
- name: Trigger refactoring review
  if: steps.result.outputs.success == 'true' && steps.issue.outputs.has_issue == 'true'
  run: |
    gh issue comment "$ISSUE_NUMBER" --body "@claude

    ## 🔄 Post-Implementation Refactoring Review

    The spec **$SPEC_ID** has been implemented successfully. Please use the **codebase-refactor-auditor** agent to:

    1. Analyze changed files for code duplication
    2. Identify opportunities to extract shared logic
    3. Suggest refactoring to improve maintainability

    **Scope**: Files changed in this spec implementation
    **Goal**: Eliminate duplication, improve code quality

    Use the **code-duplication-detector** skill to identify duplicate patterns."
```

**Benefit**: Proactive code quality improvement, reduces technical debt accumulation.

**Files to modify**:
- Modify: `.github/workflows/tdd-validate.yml` (add post-completion step)

### Phase 2.3: Dependency Tracking with dependency-tracker

**Priority**: MEDIUM
**Estimated Effort**: ~3-4 hours

**Objective**: Track which specs depend on each other and optimize processing order.

**Implementation**:
1. Create `scripts/tdd-automation/analyze-spec-dependencies.ts`
2. Invoke `dependency-tracker` skill to analyze test file dependencies
3. Store dependency graph in `.github/tdd-queue-dependencies.json`
4. Queue manager uses graph to prioritize specs with no dependencies

**Example dependency graph**:
```json
{
  "APP-PAGES-PRODUCT-007": {
    "dependsOn": ["APP-TABLE-SCHEMA-001"],
    "blockedBy": [],
    "canImplement": false
  },
  "APP-TABLE-SCHEMA-001": {
    "dependsOn": [],
    "blockedBy": ["APP-PAGES-PRODUCT-007"],
    "canImplement": true
  }
}
```

**Queue priority logic**:
```typescript
// Prioritize specs with no dependencies
const readySpecs = allSpecs.filter(spec =>
  dependencies[spec.id].canImplement === true
).sort((a, b) => {
  // Specs with more dependent specs get higher priority
  return dependencies[b.id].blockedBy.length - dependencies[a.id].blockedBy.length
})
```

**Benefit**: Reduces failed implementations due to missing dependencies, optimizes implementation order.

**Files to create**:
- Create: `scripts/tdd-automation/analyze-spec-dependencies.ts`
- Modify: `scripts/tdd-automation/queue-manager.ts` (use dependency graph in `next` command)

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
+ title="undefined"
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
  assertions: countAssertions(test),  // More assertions = more complex
  dependencies: countDependencies(test),  // More dependencies = more complex
  schemaFields: countSchemaFields(schema),  // Larger schema = more complex
  isNew: !existingFile(implementation)  // New file = more complex
}

const score = (
  complexity.assertions * 1 +
  complexity.dependencies * 2 +
  complexity.schemaFields * 0.5 +
  (complexity.isNew ? 10 : 0)
)

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
