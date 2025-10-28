# Agent Workflows for Omnera Development

## Overview

Omnera uses a sophisticated agent and skills ecosystem to implement features through Test-Driven Development (TDD), maintain documentation, and ensure code quality. This guide explains how agents and skills collaborate to form cohesive development workflows.

### Ecosystem Taxonomy

**Agents (8)** - Collaborative workflows requiring user input and strategic decisions
**Skills (8)** - Autonomous utilities for deterministic tasks

#### TDD Pipeline

**CREATIVE Agents**:

- `json-schema-editor` - Collaborative schema design guide
- `e2e-test-fixer` - GREEN implementation
- `codebase-refactor-auditor` - Code optimization and refactoring

**Skills (Mechanical Translation)**:

- `effect-schema-generator` - JSON Schema → Effect Schema (autonomous)
- `e2e-test-generator` - specs arrays → Playwright tests (autonomous)

#### Documentation Agents

- `architecture-docs-maintainer` - WHY patterns exist (rationale, enforcement)
- `infrastructure-docs-maintainer` - WHAT tools are configured (versions, setup)

#### Utility Skills

- `config-validator` - Validates eslint.config.ts, tsconfig.json
- `json-schema-validator` - Validates JSON Schema/OpenAPI compliance
- `security-scanner` - Identifies security vulnerabilities
- `code-duplication-detector` - Detects duplicate code patterns
- `dependency-tracker` - Tracks package.json alignment
- `best-practices-checker` - Validates framework-specific patterns

#### Meta Tools

- `agent-maintainer` (agent) - Reviews and maintains agent configurations
- `admin-specs-designer` (agent) - Admin dashboard design and specs

### Creative Agents vs. Mechanical Skills

The TDD pipeline uses CREATIVE agents for collaborative design and MECHANICAL skills for autonomous translation:

**CREATIVE Agents** (Require User Collaboration):

1. **json-schema-editor** - Collaborative schema design
   - Asks user questions about validation rules
   - Makes architectural decisions with user
   - Crafts business rules and user stories
   - Validates constraints collaboratively
   - **OUTPUT**: Fully designed JSON Schema with Triple-Documentation Pattern

2. **e2e-test-fixer** - Feature implementation
   - Chooses how to implement features
   - Makes code structure decisions
   - Writes actual application logic
   - **OUTPUT**: Working code that makes tests GREEN

**MECHANICAL Skills** (Autonomous Execution):

1. **effect-schema-generator** - JSON Schema → Effect Schema
   - Reads validated JSON Schema from specs.schema.json
   - Applies established Effect Schema patterns
   - Translates Triple-Documentation to JSDoc annotations
   - Creates unit tests following template
   - **NO DECISIONS**: Refuses if input incomplete, never designs
   - **AUTONOMOUS**: Claude invokes automatically when appropriate
   - **INPUT → OUTPUT**: Pure mechanical translation

2. **e2e-test-generator** - specs arrays → Playwright tests
   - Reads validated specs arrays from .schema.json files
   - Applies established Playwright test patterns
   - Translates GIVEN-WHEN-THEN to test code
   - Adds test.fixme() markers automatically
   - **NO DECISIONS**: Refuses if specs incomplete, never creates scenarios
   - **AUTONOMOUS**: Claude invokes automatically when appropriate
   - **INPUT → OUTPUT**: Pure mechanical translation

**Understanding This Distinction**:

✅ **Ask design questions to**: `json-schema-editor` (creative agent)
✅ **Ask implementation questions to**: `e2e-test-fixer` (creative agent)
✅ **Request translation**: Claude automatically uses skills (e.g., "translate specs to tests")
❌ **Don't expect skills to make decisions**: They follow patterns exactly
❌ **Don't ask skills design questions**: They'll refuse with "missing input"

**Key Difference**: Skills are model-invoked (Claude decides when to use them), while agents require explicit invocation or user collaboration.

**Decision Tree: Agent vs. Skill**

```
Does the task involve DESIGN or COLLABORATION?
├─ YES → Use CREATIVE agent (json-schema-editor or e2e-test-fixer)
└─ NO → Is it deterministic translation?
          ├─ YES → Claude will use appropriate SKILL automatically
          └─ NO → Direct tool usage or other agent

Is the JSON Schema already validated and complete?
├─ YES → Claude uses skills for translation
└─ NO → Use json-schema-editor to complete design first
```

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
1. json-schema-editor (CREATIVE AGENT: Design & Validation)
   • Helps user edit docs/specifications/specs.schema.json
   • Asks permission to validate: bun run scripts/validate-schema.ts
   • User decides when to generate roadmap
   • Validates user stories collaboratively
   • Guides creation of docs/specifications/roadmap/{property}.md
      ↓ (HANDOFF: Validated JSON Schema with Triple-Documentation)
      ↓
┌─────┴─────┐
│ PARALLEL  │
↓           ↓
2A. effect-schema-generator           |    2B. e2e-test-generator
    (MECHANICAL SKILL: JSON→Effect)   |         (MECHANICAL SKILL: specs→Tests)
    • Claude invokes autonomously     |         • Claude invokes autonomously
    • Reads JSON Schema constraints   |         • Reads specs arrays
    • Translates to Effect Schema     |         • Translates to Playwright tests
      src/domain/models/app/          |         • Creates specs/{property}.spec.ts
      {property}.ts                   |         • Applies test.fixme() markers
    • Creates {property}.test.ts      |         • Multiple @spec + ONE @regression
    • Runs CLAUDECODE=1 bun test:unit |
      ↓──────────────────────────────↓
      (HANDOFF: Schema translated + RED tests translated)
      ↓
3. e2e-test-fixer (CREATIVE AGENT: Implementation)
   • Removes test.fixme() from first @spec test
   • Implements minimal code to make test GREEN
   • Runs: bun test:e2e -- specs/{property}.spec.ts
   • Repeats for each @spec test (one at a time)
   • Makes @regression test GREEN
   • Makes @spec test GREEN (if exists)
   • After N fixes (typically 3+), documents code duplication
      ↓ (HANDOFF: All tests GREEN, duplication noted)
      ↓
4. codebase-refactor-auditor (CREATIVE AGENT: Refactoring)
   • Phase 0: Establishes E2E test baseline (@spec, @regression)
   • Analyzes recent commits (Phase 1.1: >100 lines OR >5 files)
   • Immediately refactors files from recent commits
   • Analyzes older code (Phase 1.2: recommendations only)
   • Phase 5: Validates all tests still pass
   • Result: Optimized code, no duplication, tests still GREEN
```

**Step-by-Step Workflow**:

#### Step 1: Specification & Roadmap Generation

**Agent**: `json-schema-editor`

**Trigger**: User requests help editing schema or adding properties to `docs/specifications/specs.schema.json`

**Collaborative Commands**:

```bash
# Agent asks permission before running:
bun run scripts/validate-schema.ts         # Only with user approval
bun run scripts/generate-roadmap.ts        # User decides when to run
```

**Input**:

- User requirements and schema editing requests
- docs/specifications/specs.schema.json (source of truth)

**Actions**:

1. Agent helps user understand how to edit specs.schema.json
2. User makes schema changes (or agent makes them with permission)
3. Agent asks: "Would you like me to validate the schema now?"
4. If approved, agent runs validation script
5. Agent asks: "Should I generate the roadmap with these changes?"
6. If approved, agent runs roadmap generation script
7. Agent presents auto-generated user stories to user
8. Agent asks validation questions (completeness, correctness, clarity)
9. Agent refines stories based on user feedback
10. User approves final stories for validation marker

**Output**:

- ROADMAP.md (updated high-level overview, with user approval)
- docs/specifications/roadmap/{property}.md (Effect Schema blueprints + E2E user stories, with user approval)
- User-validated stories marked with date (only after explicit approval)

**Completion Criteria**:

- ✅ Schema validation passes (with user permission)
- ✅ Roadmap files generated (user chose to generate)
- ✅ User stories validated collaboratively
- ✅ User explicitly approves adding VALIDATED marker

**Handoff**: Claude will autonomously invoke effect-schema-generator and e2e-test-generator skills when roadmap is ready

---

#### Step 2A: Schema Implementation (Parallel)

**Skill**: `effect-schema-generator` (autonomously invoked by Claude)

**Trigger**: User requests schema translation or Claude detects validated roadmap ready for translation

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

**Parallel Work**: e2e-test-generator skill works simultaneously on tests (autonomously invoked)

---

#### Step 2B: RED Test Creation (Parallel)

**Skill**: `e2e-test-generator` (autonomously invoked by Claude)

**Trigger**: User requests test generation or Claude detects specs array ready for translation

**Input**:

- docs/specifications/roadmap/{property}.md (E2E Test Blueprint section)

**Actions**:

1. Read E2E user stories from roadmap file
2. Create tests/app/{property}.spec.ts
3. Write multiple @spec tests (granular behaviors, each with test.fixme())
4. Write EXACTLY ONE @regression test (consolidates all @spec tests, with test.fixme())
5. Write optional @spec test (essential features only, with test.fixme())
6. Use data-testid patterns from roadmap
7. Include exact error messages from roadmap

**Output**:

- tests/app/{property}.spec.ts
  - Multiple @spec tests (all with test.fixme())
  - ONE @regression test (with test.fixme())
  - Optional @spec test (with test.fixme())

**Completion Criteria**:

- ✅ Test file created with proper structure
- ✅ Multiple @spec tests written
- ✅ EXACTLY ONE @regression test written
- ✅ All tests use test.fixme() (RED phase)
- ✅ data-testid patterns match roadmap
- ✅ Error messages match roadmap exactly

**Parallel Work**: effect-schema-generator skill works simultaneously on Effect Schema (autonomously invoked)

**Handoff**: Once tests are created, user can request e2e-test-fixer agent to implement features

---

#### Step 3: GREEN Implementation

**Agent**: `e2e-test-fixer`

**Trigger**: tests/app/{property}.spec.ts exists with test.fixme() on all tests

**Input**:

- tests/app/{property}.spec.ts (RED tests)
- Optional: docs/specifications/roadmap/{property}.md (implementation guidance)
- src/domain/models/app/{property}.ts (schema from effect-schema-generator skill)

**Actions**:

1. Remove test.fixme() from first @spec test
2. Run test: `bun test:e2e -- tests/app/{property}.spec.ts`
3. Implement minimal code to make test GREEN
4. Run regression tests: `bun test:e2e:regression`
5. Repeat steps 1-4 for each remaining @spec test
6. Remove test.fixme() from @regression test, make it GREEN
7. Remove test.fixme() from @spec test (if exists), make it GREEN

**Output**:

- src/ files modified (minimal implementation)
- All E2E tests passing (GREEN)
- Possible code duplication across implementations

**Completion Criteria**:

- ✅ All @spec tests GREEN
- ✅ @regression test GREEN
- ✅ @spec test GREEN (if exists)
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
bun test:e2e --grep @spec    # Must pass 100%
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
bun test:e2e --grep @spec    # Compare to Phase 0 baseline
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

**Agent**: `json-schema-editor`

**Workflow**:

1. User describes requirement change to json-schema-editor
2. Agent helps user edit docs/specifications/specs.schema.json (collaborative editing)
3. Agent asks: "Would you like me to validate these changes?"
4. If approved, agent runs `bun run scripts/validate-schema.ts`
5. Agent asks: "Should I generate a new roadmap with these changes?"
6. If approved, agent runs `bun run scripts/generate-roadmap.ts`
7. Agent presents auto-generated user stories to user
8. Agent validates stories collaboratively (completeness, correctness, clarity)
9. Agent refines stories based on user feedback
10. User approves stories, agent marks them as VALIDATED
11. Agent asks: "Ready to commit these changes?"
12. If approved, agent commits all changes together

**Preservation Strategy**: If property detail file already exists with validated stories:

1. Extract validated stories from existing file
2. Generate new property detail file from updated schema
3. Replace auto-generated stories with validated stories
4. Keep validation marker intact
5. Only regenerate Effect Schema blueprint and validation rules

**Handoff**: After validation complete, Claude will autonomously invoke effect-schema-generator and e2e-test-generator skills as needed

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

| Tool/Agent                         | Type  | Primary Responsibility       | Trigger Example              | Input Files                  | Output Files                        |
| ---------------------------------- | ----- | ---------------------------- | ---------------------------- | ---------------------------- | ----------------------------------- |
| **json-schema-editor**             | Agent | Collaborative schema design  | "Help me edit schemas"       | specs.schema.json, vision.md | ROADMAP.md, roadmap/\*.md           |
| **effect-schema-generator**        | Skill | Effect Schema implementation | "Translate schema to Effect" | roadmap/{property}.md        | src/domain/models/app/{property}.ts |
| **e2e-test-generator**             | Skill | RED test creation            | "Generate tests from specs"  | specs arrays in .schema.json | specs/{property}.spec.ts            |
| **e2e-test-fixer**                 | Agent | GREEN implementation         | "Fix failing E2E test"       | specs/{property}.spec.ts     | src/ (implementation)               |
| **codebase-refactor-auditor**      | Agent | Code optimization            | "Audit and refactor code"    | src/ (working code)          | src/ (refactored)                   |
| **architecture-docs-maintainer**   | Agent | WHY patterns exist           | "Document {pattern}"         | Architectural decision       | docs/architecture/                  |
| **infrastructure-docs-maintainer** | Agent | WHAT tools configured        | "Document {tool} setup"      | Config files                 | docs/infrastructure/                |
| **agent-maintainer**               | Agent | Agent config review          | "Review {agent}"             | .claude/agents/\*.md         | .claude/agents/\*.md                |
| **config-validator**               | Skill | Config compliance            | "Validate configs"           | eslint.config.ts, tsconfig   | Validation report                   |
| **json-schema-validator**          | Skill | Schema compliance            | "Validate JSON Schema"       | .schema.json files           | Validation report                   |
| **security-scanner**               | Skill | Security vulnerabilities     | "Check security"             | src/ files                   | Security report                     |
| **code-duplication-detector**      | Skill | Duplicate code detection     | "Find duplicates"            | src/ files                   | Duplication report                  |
| **dependency-tracker**             | Skill | Dependency alignment         | "Check dependencies"         | package.json, docs/          | Dependency report                   |
| **best-practices-checker**         | Skill | Framework pattern validation | "Check best practices"       | src/ files, docs/            | Best practices report               |

---

## Handoff Protocols

### 1. json-schema-editor → effect-schema-generator (Skill)

**Completion Criteria**:

- ✅ specs.schema.json edited collaboratively with user
- ✅ User approved schema validation (bun run scripts/validate-schema.ts)
- ✅ User approved roadmap generation (bun run scripts/generate-roadmap.ts)
- ✅ User stories validated collaboratively
- ✅ User approved adding VALIDATED marker to docs/specifications/roadmap/{property}.md

**File Artifact**: `docs/specifications/roadmap/{property}.md` with VALIDATED status (user-approved)

**Handoff**: User requests "translate schema to Effect" or similar → Claude autonomously invokes skill

**What effect-schema-generator Receives**:

- Effect Schema Structure (exact code patterns)
- Validation Rules (with error messages)
- Annotations (title, description, examples)
- Valid/Invalid configuration examples

**Success Criteria**: Skill can implement without clarification questions (or refuses with clear error message)

---

### 2. json-schema-editor → e2e-test-generator (Skill)

**Completion Criteria**:

- ✅ specs.schema.json edited collaboratively with user
- ✅ User approved schema validation
- ✅ User approved roadmap generation
- ✅ User stories validated collaboratively
- ✅ User approved adding VALIDATED marker to docs/specifications/roadmap/{property}.md

**File Artifact**: `docs/specifications/roadmap/{property}.md` OR `specs arrays` in .schema.json files

**Handoff**: User requests "generate tests from specs" or similar → Claude autonomously invokes skill

**What e2e-test-generator Receives**:

- E2E Test Blueprint OR specs arrays
- User Stories (GIVEN-WHEN-THEN format)
- Test Scenarios (@spec, @regression)
- data-testid Patterns
- Expected Error Messages

**Success Criteria**: Skill can create tests without clarification questions (or refuses with clear error message)

---

### 3. e2e-test-generator (Skill) → e2e-test-fixer (Agent)

**Completion Criteria**:

- ✅ tests/app/{property}.spec.ts created
- ✅ Multiple @spec tests written (all with test.fixme())
- ✅ EXACTLY ONE @regression test written (with test.fixme())
- ✅ Optional @spec test written (with test.fixme())
- ✅ data-testid patterns consistent
- ✅ Error messages match roadmap

**File Artifact**: `tests/app/{property}.spec.ts` with test.fixme() on all tests

**Handoff Command**: "Implement code to make RED tests GREEN at tests/app/{property}.spec.ts"

**What e2e-test-fixer Receives**:

- Complete test file with clear GIVEN-WHEN-THEN structure
- Specific data-testid patterns to implement
- Expected behaviors and error messages
- Test categorization (@spec, @regression, @spec)

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
  │         1. spec-editor (help user edit schemas collaboratively)
  │         2. effect-schema-translator + e2e-test-translator (parallel)
  │         3. e2e-test-fixer (make tests GREEN)
  │         4. codebase-refactor-auditor (optimize after 3+ fixes)
  │
  └─ NO → Q2: Is it just UI or styling?
           ├─ YES → Direct implementation (no agent needed)
           └─ NO → Q3: Does it require new tests?
                     ├─ YES → e2e-test-translator + e2e-test-fixer
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
  │   → spec-editor
  │     (help user edit schemas + collaborative validation)
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
   - spec-editor: docs/specifications/roadmap/{property}.md with VALIDATED marker (user-approved)
   - e2e-test-translator: tests/app/{property}.spec.ts with test.fixme()
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
   - spec-editor: Skipped user collaboration → Re-validate with user interactively
   - effect-schema-translator: Skipped unit tests → Create {property}.test.ts
   - e2e-test-fixer: Skipped regression tests → Run bun test:e2e:regression
3. Complete the missing step
4. Verify completion criteria before proceeding

---

### Issue 3: Agents Working on Same Thing

**Symptom**: Multiple agents modifying same files

**Cause**: Parallel execution not coordinated

**Resolution**:

1. Review agent boundaries:
   - spec-editor: docs/specifications/ only (collaborative editing with user)
   - effect-schema-translator: src/domain/models/app/ only
   - e2e-test-translator: tests/app/ only
   - e2e-test-fixer: src/ (implementation) only
   - codebase-refactor-auditor: src/ (refactoring after GREEN) only
2. Identify which agent should own the file
3. Cancel duplicate work
4. Follow handoff protocol

---

### Issue 4: Unclear Which Agent to Use

**Symptom**: Multiple agents seem applicable

**Resolution**: Use decision trees above or consult this table:

| User Intent                      | Correct Tool/Agent                                 |
| -------------------------------- | -------------------------------------------------- |
| "Add new property to app config" | json-schema-editor (agent - collaborative editing) |
| "Translate schema to Effect"     | effect-schema-generator (skill - autonomous)       |
| "Generate tests from specs"      | e2e-test-generator (skill - autonomous)            |
| "Fix failing E2E test"           | e2e-test-fixer (agent)                             |
| "Clean up code duplication"      | codebase-refactor-auditor (agent)                  |
| "Document {pattern}"             | architecture-docs-maintainer (agent)               |
| "Document {tool}"                | infrastructure-docs-maintainer (agent)             |
| "Review agent config"            | agent-maintainer (agent)                           |
| "Validate configs"               | config-validator (skill - autonomous)              |
| "Check security"                 | security-scanner (skill - autonomous)              |
| "Find duplicates"                | code-duplication-detector (skill - autonomous)     |
| "Check dependencies"             | dependency-tracker (skill - autonomous)            |

---

## Complete Examples

### Example 1: Adding "theme" Property (Complete TDD Pipeline)

**User Request**: "I want to add a theme property to the app schema that supports light/dark/system modes"

#### Phase 1: Specification (spec-editor)

**User**: "I want to add a theme property to the app schema that supports light/dark/system modes"

**Agent**: "I'll help you add the theme property to specs.schema.json. Here's what I suggest:

```json
{
  "theme": {
    "type": "string",
    "enum": ["light", "dark", "system"],
    "default": "system",
    "description": "UI theme mode for the application"
  }
}
```

Would you like me to add this to specs.schema.json?"

**User**: "Yes, please add it"

**Agent**: "Added! Would you like me to validate the schema now?"

**User**: "Yes"

```bash
# Agent runs validation with permission
bun run scripts/validate-schema.ts
# ✅ Schema validation passed
```

**Agent**: "Validation passed! Should I generate the roadmap with user stories?"

**User**: "Yes, generate it"

```bash
# Agent generates roadmap with permission
bun run scripts/generate-roadmap.ts
# ✅ Generated docs/specifications/roadmap/theme.md
```

**Agent**: "I've generated user stories for the theme property. Let me show you:

Story 1: User views theme configuration
GIVEN: App configured with theme: 'dark'
WHEN: User loads homepage
THEN: Theme badge displays 'Dark Mode'

Story 2: Invalid theme value rejected
GIVEN: App configured with theme: 'invalid'
WHEN: Server validates configuration
THEN: Display error 'Theme must be light, dark, or system'

Do these stories accurately capture how you want theme to work?"

**User**: "Yes, but add a story for system theme defaulting to user's OS preference"

**Agent**: "I'll add that story:

Story 3: System theme respects OS preference
GIVEN: App configured with theme: 'system'
WHEN: User's OS is in dark mode
THEN: Theme badge displays 'Dark Mode (System)'

Does this capture what you described?"

**User**: "Perfect!"

**Agent**: "Great! Should I mark these stories as VALIDATED?"

**User**: "Yes"

**Agent**: "Marking stories as VALIDATED. Ready to commit these changes?"

**User**: "Yes, commit them"

**Agent**: "Committing roadmap with validated user stories."

````

**Files Created**:

- docs/specifications/roadmap/theme.md (with VALIDATED marker)
- ROADMAP.md (updated)

---

#### Phase 2A: Schema Implementation (effect-schema-translator)

```bash
# Agent reads docs/specifications/roadmap/theme.md
# Agent creates src/domain/models/app/theme.ts
````

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

#### Phase 2B: RED Test Creation (e2e-test-translator, parallel with 2A)

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
bun test:e2e --grep @spec    # ✅ 5/5 passing
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
bun test:e2e --grep @spec    # ✅ 5/5 passing (baseline maintained)
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

- spec-editor helps generate new roadmap files
- Modifying existing validated user stories
- User explicitly requests story review

**Validation Questions to Ask**:

1. **Completeness**: Any missing scenarios?
2. **Correctness**: Do outcomes match your vision?
3. **Clarity**: Are stories actionable for test writing?
4. **Prioritization**: Which are @spec vs @spec?

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

This workflow documentation is optimized for Claude Code consumption.

**Agents (require @ syntax for explicit invocation)**:

- `@json-schema-editor` - Collaborative schema design guide
- `@e2e-test-fixer` - GREEN implementation
- `@codebase-refactor-auditor` - Code optimization
- `@architecture-docs-maintainer` - WHY patterns exist
- `@infrastructure-docs-maintainer` - WHAT tools configured
- `@agent-maintainer` - Agent config review

**Skills (autonomously invoked by Claude, no @ needed)**:

- `effect-schema-generator` - Effect Schema implementation
- `e2e-test-generator` - RED test creation
- `config-validator` - Configuration validation
- `json-schema-validator` - Schema compliance checking
- `security-scanner` - Security vulnerability detection
- `code-duplication-detector` - Duplicate code detection
- `dependency-tracker` - Dependency alignment tracking
- `best-practices-checker` - Framework pattern validation

Claude Code will automatically use skills when appropriate based on user requests.

---

## Summary

The Omnera agent ecosystem implements a complete TDD workflow with clear handoff protocols:

**TDD Pipeline**: json-schema-editor (design) → effect-schema-generator + e2e-test-generator (parallel skills) → e2e-test-fixer (implement) → codebase-refactor-auditor (refactor)

**Documentation**: architecture-docs-maintainer (WHY) ↔ infrastructure-docs-maintainer (WHAT)

**Utilities**: 6 autonomous skills for validation, security, and code quality

**Meta**: agent-maintainer reviews all agent configurations

**Key Principles**:

1. **Explicit Handoffs**: Every agent knows when to hand off and to whom
2. **Clear Boundaries**: No overlapping responsibilities
3. **Validation Gates**: Tests pass before proceeding
4. **User Involvement**: Story validation ensures quality
5. **Systematic Refactoring**: Two-phase approach (recent + older)

Follow these workflows to leverage the full power of the agent ecosystem for implementing features, maintaining documentation, and ensuring code quality.
