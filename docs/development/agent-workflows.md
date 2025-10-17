# Agent Workflows for Omnera Development

## Overview

Omnera uses a sophisticated agent ecosystem to implement features through Test-Driven Development (TDD), maintain documentation, and ensure code quality. This guide explains how all 8 agents collaborate to form cohesive development workflows.

### Agent Taxonomy

**TDD Agents** (Feature Implementation):

- `spec-coherence-guardian` - Product specification architecture
- `schema-architect` - Effect Schema implementation
- `e2e-red-test-writer` - RED test creation
- `e2e-test-fixer` - GREEN implementation
- `codebase-refactor-auditor` - Code optimization and refactoring

**Documentation Agents** (Knowledge Management):

- `architecture-docs-maintainer` - WHY patterns exist (rationale, enforcement)
- `infrastructure-docs-maintainer` - WHAT tools are configured (versions, setup)

**Meta Agent** (Agent Maintenance):

- `agent-maintainer` - Reviews and maintains all agent configurations

### When to Use Agents vs. Direct Tools

**Use Agents When**:

- Following complete TDD workflow (spec → schema → test → implement → refactor)
- Making architectural or infrastructure changes requiring documentation
- Conducting systematic code audits and refactoring
- Maintaining specification coherence across artifacts
- Reviewing agent configurations for quality

**Use Direct Tools When**:

- Simple, localized edits (single file, single function)
- Quick bug fixes not requiring full TDD cycle
- Reading/exploring codebase
- Running tests or builds
- Committing changes to git

---

## Core Development Workflows

### 1. Complete TDD Implementation Pipeline

**Use Case**: Implementing a new feature from user requirement to production-ready code

**Pipeline Overview**:

```
User Requirement
      ↓
1. spec-coherence-guardian
   • Updates docs/specifications/specs.schema.json
   • Validates: bun run scripts/validate-schema.ts
   • Generates roadmap: bun run scripts/generate-roadmap.ts
   • Validates user stories with user
   • Creates docs/specifications/roadmap/{property}.md
      ↓ (HANDOFF: Roadmap file created with VALIDATED status)
      ↓
2A. schema-architect (parallel)    |    2B. e2e-red-test-writer (parallel)
    • Reads Effect Schema blueprint |        • Reads E2E user stories
    • Implements                    |        • Creates tests/app/{property}.spec.ts
      src/domain/models/app/        |        • Writes multiple @spec tests (test.fixme)
      {property}.ts                 |        • Writes ONE @regression test (test.fixme)
    • Creates {property}.test.ts    |        • Optional @critical test (test.fixme)
    • Runs CLAUDECODE=1 bun         |
      test:unit                     |
      ↓──────────────────────────────↓
      (HANDOFF: Schema implemented + RED tests exist)
      ↓
3. e2e-test-fixer
   • Removes test.fixme() from first @spec test
   • Implements minimal code to make test GREEN
   • Runs: bun test:e2e -- tests/app/{property}.spec.ts
   • Repeats for each @spec test (one at a time)
   • Makes @regression test GREEN
   • Makes @critical test GREEN (if exists)
   • After N fixes (typically 3+), documents code duplication
      ↓ (HANDOFF: All tests GREEN, duplication noted)
      ↓
4. codebase-refactor-auditor
   • Phase 0: Establishes E2E test baseline (@critical, @regression)
   • Analyzes recent commits (Phase 1.1: >100 lines OR >5 files)
   • Immediately refactors files from recent commits
   • Analyzes older code (Phase 1.2: recommendations only)
   • Phase 5: Validates all tests still pass
   • Result: Optimized code, no duplication, tests still GREEN
```

**Step-by-Step Workflow**:

#### Step 1: Specification & Roadmap Generation

**Agent**: `spec-coherence-guardian`

**Trigger**: User describes new feature or modifies `docs/specifications/specs.schema.json`

**Commands**:

```bash
# After user modifies specs.schema.json
bun run scripts/validate-schema.ts         # MANDATORY
bun run scripts/generate-roadmap.ts        # MANDATORY
```

**Input**:

- User requirements
- docs/specifications/specs.schema.json (source of truth)

**Actions**:

1. User or agent updates specs.schema.json with new property
2. Agent runs validation script (must pass)
3. Agent runs roadmap generation script
4. Agent presents auto-generated user stories to user
5. Agent asks validation questions (completeness, correctness, clarity)
6. Agent refines stories based on user feedback
7. Agent marks stories as VALIDATED in property detail file

**Output**:

- ROADMAP.md (updated high-level overview)
- docs/specifications/roadmap/{property}.md (Effect Schema blueprints + E2E user stories)
- User-validated stories marked with date

**Completion Criteria**:

- ✅ Schema validation passes
- ✅ Roadmap files generated
- ✅ User stories validated by user
- ✅ VALIDATED marker added to property detail file

**Handoff**: Notify schema-architect and e2e-red-test-writer that roadmap is ready

---

#### Step 2A: Schema Implementation (Parallel)

**Agent**: `schema-architect`

**Trigger**: Roadmap file exists at `docs/specifications/roadmap/{property}.md` with VALIDATED status

**Input**:

- docs/specifications/roadmap/{property}.md (Effect Schema Blueprint section)

**Actions**:

1. Read Effect Schema Structure from roadmap file
2. Create src/domain/models/app/{property}.ts
3. Copy Effect Schema blueprint (exact patterns)
4. Implement validation rules with exact error messages
5. Add annotations (title, description, examples)
6. Create src/domain/models/app/{property}.test.ts
7. Run CLAUDECODE=1 bun test:unit
8. Add property to AppSchema in src/domain/models/app/index.ts
9. Run bun run scripts/export-schema.ts

**Output**:

- src/domain/models/app/{property}.ts (Effect Schema implementation)
- src/domain/models/app/{property}.test.ts (unit tests)
- Updated src/domain/models/app/index.ts (integrated into AppSchema)
- Updated schemas/0.0.1/app.schema.json (exported JSON Schema)

**Completion Criteria**:

- ✅ Schema file created with validation rules
- ✅ Unit tests pass (CLAUDECODE=1 bun test:unit)
- ✅ Property added to AppSchema
- ✅ JSON Schema exported successfully

**Parallel Work**: e2e-red-test-writer works simultaneously on tests

---

#### Step 2B: RED Test Creation (Parallel)

**Agent**: `e2e-red-test-writer`

**Trigger**: Roadmap file exists at `docs/specifications/roadmap/{property}.md` with VALIDATED status

**Input**:

- docs/specifications/roadmap/{property}.md (E2E Test Blueprint section)

**Actions**:

1. Read E2E user stories from roadmap file
2. Create tests/app/{property}.spec.ts
3. Write multiple @spec tests (granular behaviors, each with test.fixme())
4. Write EXACTLY ONE @regression test (consolidates all @spec tests, with test.fixme())
5. Write optional @critical test (essential features only, with test.fixme())
6. Use data-testid patterns from roadmap
7. Include exact error messages from roadmap

**Output**:

- tests/app/{property}.spec.ts
  - Multiple @spec tests (all with test.fixme())
  - ONE @regression test (with test.fixme())
  - Optional @critical test (with test.fixme())

**Completion Criteria**:

- ✅ Test file created with proper structure
- ✅ Multiple @spec tests written
- ✅ EXACTLY ONE @regression test written
- ✅ All tests use test.fixme() (RED phase)
- ✅ data-testid patterns match roadmap
- ✅ Error messages match roadmap exactly

**Parallel Work**: schema-architect works simultaneously on Effect Schema

**Handoff**: Notify e2e-test-fixer that RED tests are ready

---

#### Step 3: GREEN Implementation

**Agent**: `e2e-test-fixer`

**Trigger**: tests/app/{property}.spec.ts exists with test.fixme() on all tests

**Input**:

- tests/app/{property}.spec.ts (RED tests)
- Optional: docs/specifications/roadmap/{property}.md (implementation guidance)
- src/domain/models/app/{property}.ts (schema from schema-architect)

**Actions**:

1. Remove test.fixme() from first @spec test
2. Run test: `bun test:e2e -- tests/app/{property}.spec.ts`
3. Implement minimal code to make test GREEN
4. Run regression tests: `bun test:e2e:regression`
5. Repeat steps 1-4 for each remaining @spec test
6. Remove test.fixme() from @regression test, make it GREEN
7. Remove test.fixme() from @critical test (if exists), make it GREEN

**Output**:

- src/ files modified (minimal implementation)
- All E2E tests passing (GREEN)
- Possible code duplication across implementations

**Completion Criteria**:

- ✅ All @spec tests GREEN
- ✅ @regression test GREEN
- ✅ @critical test GREEN (if exists)
- ✅ Regression tests still passing
- ✅ No test logic modified

**Decision Point**: After N test fixes (typically 3+), evaluate if code duplication emerged

**Handoff Condition**:

- Fixed 3+ tests with emerging duplication
- Copy-pasted code blocks across implementations
- Similar validation logic repeated
- User requests: "clean up the code"

**Handoff Action**:

```bash
git commit -m "feat: implement {feature} E2E tests

Completed {N} test fixes. All tests GREEN.

Code duplication noted in:
- {area 1}: {description}
- {area 2}: {description}

Ready for systematic refactoring via codebase-refactor-auditor."
```

**Handoff**: Notify codebase-refactor-auditor that code is ready for refactoring

---

#### Step 4: Code Optimization & Refactoring

**Agent**: `codebase-refactor-auditor`

**Trigger**: e2e-test-fixer completed 3+ test fixes with noted code duplication

**Input**:

- Working code (all tests GREEN)
- Recent commit history (test fixes from e2e-test-fixer)
- Identified areas of code duplication

**Actions**:

**Phase 0: Establish Baseline**

```bash
bun test:e2e --grep @critical    # Must pass 100%
bun test:e2e --grep @regression  # Must pass 100%
# Document baseline results with timestamps
```

**Phase 1.1: Recent Changes Analysis (Immediate Refactoring)**

```bash
# Identify recent commits
git log -10 --stat --oneline

# Extract files from major commits (>100 lines OR >5 files in src/)
# Prioritize these files for immediate refactoring
```

1. Analyze recent commits from e2e-test-fixer
2. Identify code duplication patterns
3. Extract common logic into shared utilities
4. Eliminate copy-pasted code blocks
5. Verify best practices compliance
6. Run Phase 5 validation after each refactoring

**Phase 1.2: Older Code Review (Recommendations Only)**

1. Scan remaining src/ files (excluding Phase 1.1 files)
2. Identify architectural issues
3. Flag best practices violations
4. Calculate benefit-to-effort ratio
5. Present prioritized recommendations (Quick Wins, High Impact, Nice to Have)
6. **AWAIT user approval** before implementing Phase 1.2

**Phase 5: Validation**

```bash
CLAUDECODE=1 bun test:unit       # All unit tests
bun test:e2e --grep @critical    # Compare to Phase 0 baseline
bun test:e2e --grep @regression  # Compare to Phase 0 baseline
```

**Output**:

- **Phase 1.1**: Refactored recent code (immediately implemented)
- **Phase 1.2**: Recommendations for older code (awaiting approval)
- Audit report with measurable metrics:
  - Code reduction percentage
  - Duplication instances eliminated
  - Violations fixed
  - Test baseline maintained (100% passing)

**Completion Criteria**:

- ✅ Phase 0 baseline established (all tests passing)
- ✅ Phase 1.1 refactorings implemented
- ✅ Phase 1.2 recommendations documented
- ✅ Phase 5 validation passes (all baseline tests still GREEN)
- ✅ Code reduction measurable (e.g., 12% fewer lines)

**Rollback Protocol**: If ANY test fails in Phase 5, immediately rollback refactorings

---

### 2. Documentation Maintenance Workflow

**Use Case**: Documenting architectural decisions or tech stack changes

#### 2.1 Architecture Pattern Documentation

**Agent**: `architecture-docs-maintainer`

**Trigger**: New architectural pattern implemented or decision made

**Input**:

- Architectural decision or pattern description
- Codebase examples
- Rationale and trade-offs

**Actions**:

1. Create or update docs/architecture/{pattern}.md
2. Document WHY the pattern exists (rationale)
3. Validate enforcement via eslint.config.ts (boundaries rules)
4. Validate enforcement via tsconfig.json (strict mode, path aliases)
5. Add ✅/❌ code examples
6. Document common pitfalls
7. Cross-reference related docs

**Output**:

- docs/architecture/{pattern}.md
- Enforcement validation confirmed

**Coordination**: Notify infrastructure-docs-maintainer if ESLint/TypeScript configs need updates

---

#### 2.2 Infrastructure Tool Documentation

**Agent**: `infrastructure-docs-maintainer`

**Trigger**: New tool added or existing tool updated

**Input**:

- Tool name and version
- Configuration files (package.json, tsconfig.json, etc.)
- Setup and usage patterns

**Actions**:

1. Create or update docs/infrastructure/{category}/{tool}.md
2. Document WHAT tool is configured (version, settings)
3. Validate configuration matches documentation
4. Add installation commands
5. Add common usage patterns
6. Document integration with other tools
7. Add troubleshooting section

**Output**:

- docs/infrastructure/{category}/{tool}.md
- Configuration validation confirmed

**Coordination**: Notify architecture-docs-maintainer if architectural patterns are affected

---

#### 2.3 Bidirectional Docs Validation

**Agents**: `architecture-docs-maintainer` ↔ `infrastructure-docs-maintainer`

**Workflow**:

1. Architecture-docs-maintainer documents pattern
2. Architecture-docs-maintainer validates ESLint/TypeScript enforce the pattern
3. Infrastructure-docs-maintainer documents ESLint/TypeScript configuration
4. Infrastructure-docs-maintainer validates configs match documented setup
5. Both agents cross-reference each other's docs

**Example**:

- Architecture-docs: "Domain layer must be pure (zero dependencies)"
- ESLint config: `boundaries/element-types` prevents Domain imports
- Infrastructure-docs: "eslint-plugin-boundaries v9.0.0 configured with 4 layers"
- Validation: Both confirm pattern is documented AND enforced

---

### 3. Specification Evolution Workflow

**Use Case**: Product requirements change, specs.schema.json needs updates

**Agent**: `spec-coherence-guardian`

**Workflow**:

1. User describes requirement change
2. Agent updates docs/specifications/specs.schema.json
3. Agent runs `bun run scripts/validate-schema.ts` (MANDATORY)
4. If validation passes, agent runs `bun run scripts/generate-roadmap.ts` (MANDATORY)
5. Agent presents auto-generated user stories to user
6. Agent validates stories with user (completeness, correctness, clarity)
7. Agent refines stories based on feedback
8. Agent marks stories as VALIDATED
9. Agent commits all changes together

**Preservation Strategy**: If property detail file already exists with validated stories:

1. Extract validated stories from existing file
2. Generate new property detail file from updated schema
3. Replace auto-generated stories with validated stories
4. Keep validation marker intact
5. Only regenerate Effect Schema blueprint and validation rules

**Handoff**: After validation complete, notify schema-architect and e2e-red-test-writer

---

### 4. Refactoring After Implementation

**Use Case**: Feature implemented with TDD, but code needs systematic cleanup

**Agent**: `codebase-refactor-auditor`

**Trigger**: e2e-test-fixer completed multiple test fixes (3+) with code duplication

**Workflow**: See Step 4 in TDD Pipeline above

**Key Points**:

- ALWAYS run Phase 0 baseline before any refactoring
- Two-phase approach: Recent changes (immediate) vs Older code (recommendations)
- ALWAYS run Phase 5 validation after refactoring
- Rollback immediately if any test fails

**Coordination**:

- If best practices violations found → infrastructure-docs-maintainer may need to update docs
- If architectural violations found → architecture-docs-maintainer may need to update docs

---

## Agent Reference Matrix

### Complete Agent Overview

| Agent                              | Primary Responsibility       | Trigger Example               | Input Files                  | Output Files                        | Collaborates With                                  |
| ---------------------------------- | ---------------------------- | ----------------------------- | ---------------------------- | ----------------------------------- | -------------------------------------------------- |
| **spec-coherence-guardian**        | Product spec architecture    | "Update specs.schema.json"    | specs.schema.json, vision.md | ROADMAP.md, roadmap/\*.md           | → schema-architect, e2e-red-test-writer            |
| **schema-architect**               | Effect Schema implementation | "Implement {property} schema" | roadmap/{property}.md        | src/domain/models/app/{property}.ts | ← spec-coherence-guardian, → e2e-red-test-writer   |
| **e2e-red-test-writer**            | RED test creation            | "Write tests for {property}"  | roadmap/{property}.md        | tests/app/{property}.spec.ts        | ← spec-coherence-guardian, → e2e-test-fixer        |
| **e2e-test-fixer**                 | GREEN implementation         | "Fix failing E2E test"        | tests/app/{property}.spec.ts | src/ (implementation)               | ← e2e-red-test-writer, → codebase-refactor-auditor |
| **codebase-refactor-auditor**      | Code optimization            | "Audit and refactor code"     | src/ (working code)          | src/ (refactored)                   | ← e2e-test-fixer, ↔ docs maintainers              |
| **architecture-docs-maintainer**   | WHY patterns exist           | "Document {pattern}"          | Architectural decision       | docs/architecture/                  | ↔ infrastructure-docs-maintainer                  |
| **infrastructure-docs-maintainer** | WHAT tools configured        | "Document {tool} setup"       | Config files                 | docs/infrastructure/                | ↔ architecture-docs-maintainer                    |
| **agent-maintainer**               | Agent config review          | "Review {agent}"              | .claude/agents/\*.md         | .claude/agents/\*.md                | (meta-level for all)                               |

---

## Handoff Protocols

### 1. spec-coherence-guardian → schema-architect

**Completion Criteria**:

- ✅ specs.schema.json validated (bun run scripts/validate-schema.ts)
- ✅ Roadmap generated (bun run scripts/generate-roadmap.ts)
- ✅ User stories validated by user
- ✅ VALIDATED marker added to docs/specifications/roadmap/{property}.md

**File Artifact**: `docs/specifications/roadmap/{property}.md` with VALIDATED status

**Handoff Command**: "Implement {property} schema from roadmap blueprint at docs/specifications/roadmap/{property}.md"

**What schema-architect Receives**:

- Effect Schema Structure (exact code patterns)
- Validation Rules (with error messages)
- Annotations (title, description, examples)
- Valid/Invalid configuration examples

**Success Criteria**: schema-architect can implement without clarification questions

---

### 2. spec-coherence-guardian → e2e-red-test-writer

**Completion Criteria**:

- ✅ specs.schema.json validated
- ✅ Roadmap generated
- ✅ User stories validated by user
- ✅ VALIDATED marker added to docs/specifications/roadmap/{property}.md

**File Artifact**: `docs/specifications/roadmap/{property}.md` with VALIDATED status

**Handoff Command**: "Write RED tests for {property} from roadmap user stories at docs/specifications/roadmap/{property}.md"

**What e2e-red-test-writer Receives**:

- E2E Test Blueprint (exact Playwright patterns)
- User Stories (GIVEN-WHEN-THEN format)
- Test Scenarios (@spec, @regression, @critical)
- data-testid Patterns
- Expected Error Messages

**Success Criteria**: e2e-red-test-writer can create tests without clarification questions

---

### 3. e2e-red-test-writer → e2e-test-fixer

**Completion Criteria**:

- ✅ tests/app/{property}.spec.ts created
- ✅ Multiple @spec tests written (all with test.fixme())
- ✅ EXACTLY ONE @regression test written (with test.fixme())
- ✅ Optional @critical test written (with test.fixme())
- ✅ data-testid patterns consistent
- ✅ Error messages match roadmap

**File Artifact**: `tests/app/{property}.spec.ts` with test.fixme() on all tests

**Handoff Command**: "Implement code to make RED tests GREEN at tests/app/{property}.spec.ts"

**What e2e-test-fixer Receives**:

- Complete test file with clear GIVEN-WHEN-THEN structure
- Specific data-testid patterns to implement
- Expected behaviors and error messages
- Test categorization (@spec, @regression, @critical)

**Success Criteria**: e2e-test-fixer can implement without modifying test logic

---

### 4. e2e-test-fixer → codebase-refactor-auditor

**Completion Criteria**:

- ✅ All E2E tests GREEN (no test.fixme() remaining)
- ✅ Fixed 3+ tests for same feature
- ✅ Code duplication documented in commits
- ✅ Regression tests passing (bun test:e2e:regression)

**File Artifacts**:

- Working src/ code (all tests passing)
- Git commit history showing test fixes
- Commit messages noting code duplication

**Handoff Command**: "Audit and refactor recent implementations. Code duplication noted in {areas}."

**What codebase-refactor-auditor Receives**:

- Working code (all tests GREEN)
- Recent commit history (last 5-10 commits)
- Identified areas of code duplication
- Baseline of passing tests

**Success Criteria**: All tests remain GREEN after refactoring

---

## Decision Trees

### Decision Tree 1: "I Want to Add a New Feature"

```
START: User wants to add feature (e.g., "theme" property)
  ↓
Q1: Does it require schema changes?
  ├─ YES → Use Complete TDD Pipeline
  │         1. spec-coherence-guardian (specs.schema.json + roadmap)
  │         2. schema-architect + e2e-red-test-writer (parallel)
  │         3. e2e-test-fixer (make tests GREEN)
  │         4. codebase-refactor-auditor (optimize after 3+ fixes)
  │
  └─ NO → Q2: Is it just UI or styling?
           ├─ YES → Direct implementation (no agent needed)
           └─ NO → Q3: Does it require new tests?
                     ├─ YES → e2e-red-test-writer + e2e-test-fixer
                     └─ NO → Direct implementation
```

---

### Decision Tree 2: "I Want to Clean Up Code"

```
START: User wants to refactor/clean code
  ↓
Q1: Are all tests currently passing?
  ├─ NO → Fix tests first (e2e-test-fixer or direct fix)
  │       Then return to Q1
  │
  └─ YES → Q2: Is this after multiple test fixes?
             ├─ YES → codebase-refactor-auditor
             │         (Two-phase: recent + older code)
             │
             └─ NO → Q3: Is it localized to one file/function?
                       ├─ YES → Direct refactoring (no agent)
                       └─ NO → codebase-refactor-auditor
                                 (Systematic audit of src/)
```

---

### Decision Tree 3: "I Want to Document Something"

```
START: User wants to document
  ↓
Q1: What are you documenting?
  ├─ New architectural pattern/decision
  │   → architecture-docs-maintainer
  │     (WHY pattern exists, enforcement validation)
  │
  ├─ New tool or tool update
  │   → infrastructure-docs-maintainer
  │     (WHAT tool configured, version, commands)
  │
  ├─ Product specification/feature
  │   → spec-coherence-guardian
  │     (specs.schema.json + roadmap generation)
  │
  └─ Agent configuration
      → agent-maintainer
        (Agent review and updates)
```

---

## Troubleshooting Multi-Agent Workflows

### Issue 1: Handoff Not Triggering

**Symptom**: Next agent in pipeline doesn't start automatically

**Cause**: File artifacts not created or completion criteria not met

**Resolution**:

1. Check completion criteria for previous agent
2. Verify file artifacts exist:
   - spec-coherence-guardian: docs/specifications/roadmap/{property}.md with VALIDATED marker
   - e2e-red-test-writer: tests/app/{property}.spec.ts with test.fixme()
   - e2e-test-fixer: All tests GREEN (no test.fixme() remaining)
3. Explicitly invoke next agent with handoff command
4. Example: "Implement {property} schema from roadmap blueprint"

---

### Issue 2: Agent Skipped a Step

**Symptom**: Agent didn't follow complete workflow

**Cause**: Missing validation step or file artifact

**Resolution**:

1. Identify which step was skipped
2. Common skips:
   - spec-coherence-guardian: Skipped user story validation → Re-validate with user
   - schema-architect: Skipped unit tests → Create {property}.test.ts
   - e2e-test-fixer: Skipped regression tests → Run bun test:e2e:regression
3. Complete the missing step
4. Verify completion criteria before proceeding

---

### Issue 3: Agents Working on Same Thing

**Symptom**: Multiple agents modifying same files

**Cause**: Parallel execution not coordinated

**Resolution**:

1. Review agent boundaries:
   - spec-coherence-guardian: docs/specifications/ only
   - schema-architect: src/domain/models/app/ only
   - e2e-red-test-writer: tests/app/ only
   - e2e-test-fixer: src/ (implementation) only
   - codebase-refactor-auditor: src/ (refactoring after GREEN) only
2. Identify which agent should own the file
3. Cancel duplicate work
4. Follow handoff protocol

---

### Issue 4: Unclear Which Agent to Use

**Symptom**: Multiple agents seem applicable

**Resolution**: Use decision trees above or consult this table:

| User Intent                       | Correct Agent                               |
| --------------------------------- | ------------------------------------------- |
| "Add new property to app config"  | spec-coherence-guardian (full TDD pipeline) |
| "Implement schema for {property}" | schema-architect (if roadmap exists)        |
| "Write tests for {property}"      | e2e-red-test-writer (if roadmap exists)     |
| "Fix failing E2E test"            | e2e-test-fixer                              |
| "Clean up code duplication"       | codebase-refactor-auditor                   |
| "Document {pattern}"              | architecture-docs-maintainer                |
| "Document {tool}"                 | infrastructure-docs-maintainer              |
| "Review agent config"             | agent-maintainer                            |

---

## Complete Examples

### Example 1: Adding "theme" Property (Complete TDD Pipeline)

**User Request**: "I want to add a theme property to the app schema that supports light/dark/system modes"

#### Phase 1: Specification (spec-coherence-guardian)

```bash
# Agent updates specs.schema.json
# Agent runs validation
bun run scripts/validate-schema.ts
# ✅ Schema validation passed

# Agent generates roadmap
bun run scripts/generate-roadmap.ts
# ✅ Generated docs/specifications/roadmap/theme.md
```

**User Story Validation**:

```
Agent: "I've generated user stories for the theme property. Let me show you:

Story 1: User views theme configuration
  GIVEN: App configured with theme: 'dark'
  WHEN: User loads homepage
  THEN: Theme badge displays 'Dark Mode'

Story 2: Invalid theme value rejected
  GIVEN: App configured with theme: 'invalid'
  WHEN: Server validates configuration
  THEN: Display error 'Theme must be light, dark, or system'

Do these stories accurately capture how you want theme to work?"

User: "Yes, but add a story for system theme defaulting to user's OS preference"

Agent: "I'll add that story:

Story 3: System theme respects OS preference
  GIVEN: App configured with theme: 'system'
  WHEN: User's OS is in dark mode
  THEN: Theme badge displays 'Dark Mode (System)'

Does this capture what you described?"

User: "Perfect!"

Agent: "Marking stories as VALIDATED and committing roadmap."
```

**Files Created**:

- docs/specifications/roadmap/theme.md (with VALIDATED marker)
- ROADMAP.md (updated)

---

#### Phase 2A: Schema Implementation (schema-architect)

```bash
# Agent reads docs/specifications/roadmap/theme.md
# Agent creates src/domain/models/app/theme.ts
```

**Code Created**:

```typescript
// src/domain/models/app/theme.ts
import { Schema } from 'effect'

export const ThemeSchema = Schema.Literal('light', 'dark', 'system').pipe(
  Schema.annotations({
    title: 'Theme',
    description: 'UI theme mode for the application',
    examples: ['light', 'dark', 'system'],
  })
)

export type Theme = Schema.Schema.Type<typeof ThemeSchema>
```

```typescript
// src/domain/models/app/theme.test.ts
import { describe, test, expect } from 'bun:test'
import { Schema } from 'effect'
import { ThemeSchema } from './theme'

describe('ThemeSchema', () => {
  test('should accept valid themes', () => {
    expect(Schema.decodeUnknownSync(ThemeSchema)('light')).toBe('light')
    expect(Schema.decodeUnknownSync(ThemeSchema)('dark')).toBe('dark')
    expect(Schema.decodeUnknownSync(ThemeSchema)('system')).toBe('system')
  })

  test('should reject invalid themes', () => {
    expect(() => {
      Schema.decodeUnknownSync(ThemeSchema)('invalid')
    }).toThrow()
  })
})
```

```bash
# Agent runs tests
CLAUDECODE=1 bun test:unit src/domain/models/app/theme.test.ts
# ✅ All tests passing

# Agent integrates into AppSchema
# Updates src/domain/models/app/index.ts
# Runs bun run scripts/export-schema.ts
```

---

#### Phase 2B: RED Test Creation (e2e-red-test-writer, parallel with 2A)

```bash
# Agent reads docs/specifications/roadmap/theme.md
# Agent creates tests/app/theme.spec.ts
```

**Code Created**:

```typescript
// tests/app/theme.spec.ts
import { test, expect } from '../fixtures'

test.describe('AppSchema - Theme', () => {
  test.fixme(
    'should display theme badge',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: App configured with dark theme
      await startServerWithSchema({
        name: 'test-app',
        theme: 'dark',
      })

      // WHEN: User loads homepage
      await page.goto('/')

      // THEN: Theme badge displays 'Dark Mode'
      await expect(page.locator('[data-testid="theme-badge"]')).toHaveText('Dark Mode')
    }
  )

  test.fixme(
    'should reject invalid theme',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: App configured with invalid theme
      await startServerWithSchema({
        name: 'test-app',
        theme: 'invalid',
      })

      // WHEN: Server attempts to start
      // THEN: Display validation error
      await page.goto('/')
      await expect(page.locator('[data-testid="theme-error"]')).toHaveText(
        'Theme must be light, dark, or system'
      )
    }
  )

  test.fixme(
    'should handle system theme',
    { tag: '@spec' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: App configured with system theme
      await startServerWithSchema({
        name: 'test-app',
        theme: 'system',
      })

      // WHEN: User loads homepage
      await page.goto('/')

      // THEN: Theme badge displays system preference
      await expect(page.locator('[data-testid="theme-badge"]')).toContainText('System')
    }
  )

  test.fixme(
    'user can view theme configuration',
    { tag: '@regression' },
    async ({ page, startServerWithSchema }) => {
      // GIVEN: Complete theme configuration
      await startServerWithSchema({
        name: 'test-app',
        theme: 'dark',
      })

      // WHEN: User interacts with complete workflow
      await page.goto('/')

      // THEN: All theme behaviors verified
      await expect(page.locator('[data-testid="theme-badge"]')).toBeVisible()
      await expect(page.locator('[data-testid="theme-badge"]')).toHaveText('Dark Mode')
    }
  )
})
```

**Handoff**: "RED tests ready for e2e-test-fixer at tests/app/theme.spec.ts"

---

#### Phase 3: GREEN Implementation (e2e-test-fixer)

```bash
# Agent removes test.fixme() from first @spec test
# Agent runs test
bun test:e2e -- tests/app/theme.spec.ts
# ❌ Test fails (as expected, RED)

# Agent implements minimal code
```

**Implementation**:

```typescript
// src/presentation/utils/render-homepage.tsx (modified)
// Add theme badge component
<div data-testid="theme-badge">
  {app.theme === 'dark' && 'Dark Mode'}
  {app.theme === 'light' && 'Light Mode'}
  {app.theme === 'system' && 'System'}
</div>
```

```bash
# Agent re-runs test
bun test:e2e -- tests/app/theme.spec.ts
# ✅ First @spec test passing (GREEN)

# Agent runs regression tests
bun test:e2e:regression
# ✅ All regression tests passing

# Agent commits
git commit -m "feat: add theme badge display for dark mode"

# Agent repeats for remaining @spec tests (test 2, test 3, @regression)
# After 3 test fixes, agent notes: "Code duplication in theme badge rendering"
```

**Handoff**: "Completed 4 test fixes. All tests GREEN. Code duplication in theme badge rendering. Ready for codebase-refactor-auditor."

---

#### Phase 4: Code Optimization (codebase-refactor-auditor)

```bash
# Agent runs Phase 0: Establish baseline
bun test:e2e --grep @critical    # ✅ 5/5 passing
bun test:e2e --grep @regression  # ✅ 4/4 passing (including new theme test)

# Agent analyzes recent commits
git log -10 --stat --oneline
# Identifies 4 commits from e2e-test-fixer (theme implementation)

# Agent identifies code duplication
# Theme badge rendering repeated in multiple places

# Phase 1.1: Immediate refactoring
```

**Refactoring**:

```typescript
// src/presentation/components/ui/theme-badge.tsx (NEW)
export function ThemeBadge({ theme }: { theme: 'light' | 'dark' | 'system' }) {
  const labels = {
    light: 'Light Mode',
    dark: 'Dark Mode',
    system: 'System'
  }

  return <div data-testid="theme-badge">{labels[theme]}</div>
}

// src/presentation/utils/render-homepage.tsx (REFACTORED)
import { ThemeBadge } from '@/components/ui/theme-badge'

// Replace duplicate code with component
<ThemeBadge theme={app.theme} />
```

```bash
# Agent runs Phase 5: Validation
CLAUDECODE=1 bun test:unit       # ✅ All passing
bun test:e2e --grep @critical    # ✅ 5/5 passing (baseline maintained)
bun test:e2e --grep @regression  # ✅ 4/4 passing (baseline maintained)

# Phase 1.2: Recommendations for older code
# (None applicable - theme is new feature)

# Agent commits
git commit -m "refactor: extract ThemeBadge component

Eliminates code duplication from theme implementation.
- Created reusable ThemeBadge component
- Reduced 45 lines to 15 lines (67% reduction)
- All tests remain GREEN

Metrics:
- Code reduction: 67%
- Duplication eliminated: 3 instances
- Test baseline: 100% maintained (9/9 passing)
"
```

**Result**: Feature complete with optimized code, all tests GREEN.

---

## Human Decision Points

### 1. When to Start TDD Workflow vs. Implement Directly

**Use TDD Workflow When**:

- Adding new configuration property to AppSchema
- Feature requires schema validation rules
- Feature needs E2E test coverage
- Feature will have multiple test scenarios

**Implement Directly When**:

- Simple UI styling changes
- One-off bug fixes not requiring schema changes
- Internal refactoring not affecting user-facing behavior
- Documentation updates only

**Rule of Thumb**: If it changes AppSchema or adds user-facing behavior → Use TDD workflow

---

### 2. When to Trigger Refactoring Audit

**Trigger codebase-refactor-auditor When**:

- e2e-test-fixer completed 3+ test fixes with duplication
- Major feature implementation complete
- User requests: "audit the codebase" or "clean up the code"
- Preparing for production deployment
- Quarterly code quality reviews

**Don't Trigger When**:

- Mid-implementation (tests not all GREEN yet)
- Single test fix with minimal code
- Already in refactoring phase
- Breaking changes without test coverage

---

### 3. When to Validate User Stories

**Always Validate When**:

- spec-coherence-guardian generates new roadmap files
- Modifying existing validated user stories
- User explicitly requests story review

**Validation Questions to Ask**:

1. **Completeness**: Any missing scenarios?
2. **Correctness**: Do outcomes match your vision?
3. **Clarity**: Are stories actionable for test writing?
4. **Prioritization**: Which are @critical vs @spec?

**Never Skip**: User story validation is mandatory in TDD workflow

---

### 4. When to Approve Phase 1.2 Recommendations

**codebase-refactor-auditor presents recommendations for older code** (not recent commits)

**Approval Decision Factors**:

- **Quick Wins** (high benefit, low effort): Usually approve
- **High Impact** (high benefit, high effort): Evaluate priority
- **Nice to Have** (low benefit): Defer unless time permits

**Evaluation Criteria**:

- Time available for refactoring
- Impact on upcoming features
- Risk level (breaking changes?)
- Test coverage confidence

**Response Options**:

- "Approve Quick Wins" (high-value, low-effort items)
- "Approve items 1, 3, 5" (specific items)
- "Defer Phase 1.2" (focus on new features)

---

## Integration with Claude Code

This workflow documentation is optimized for Claude Code consumption. When referencing agents, use the @ syntax:

- `@spec-coherence-guardian` - Product specification architecture
- `@schema-architect` - Effect Schema implementation
- `@e2e-red-test-writer` - RED test creation
- `@e2e-test-fixer` - GREEN implementation
- `@codebase-refactor-auditor` - Code optimization
- `@architecture-docs-maintainer` - WHY patterns exist
- `@infrastructure-docs-maintainer` - WHAT tools configured
- `@agent-maintainer` - Agent config review

Claude Code will understand these references and invoke the appropriate agents when workflow triggers are met.

---

## Summary

The Omnera agent ecosystem implements a complete TDD workflow with clear handoff protocols:

**TDD Pipeline**: spec → schema + tests (parallel) → implement → refactor

**Documentation**: architecture (WHY) ↔ infrastructure (WHAT)

**Meta**: agent-maintainer reviews all configurations

**Key Principles**:

1. **Explicit Handoffs**: Every agent knows when to hand off and to whom
2. **Clear Boundaries**: No overlapping responsibilities
3. **Validation Gates**: Tests pass before proceeding
4. **User Involvement**: Story validation ensures quality
5. **Systematic Refactoring**: Two-phase approach (recent + older)

Follow these workflows to leverage the full power of the agent ecosystem for implementing features, maintaining documentation, and ensuring code quality.
