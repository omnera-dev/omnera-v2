# Triple-Documentation Pattern

## Overview

The `docs/specifications/specs.schema.json` file implements a revolutionary **Triple-Documentation Pattern** that transforms a technical JSON Schema into a living specification serving three distinct audiences:

1. **What** (description + examples): Technical developers understand data structures and formats
2. **Why** (x-business-rules): Engineers understand constraints, rationale, and system behavior
3. **Who/When** (x-user-stories): Product teams, QA, and AI agents understand user scenarios and acceptance criteria

This three-lens approach bridges the gap between business requirements, implementation details, and test scenarios, enabling **true Test-Driven Development (TDD) at scale**.

## The Problem This Solves

Traditional JSON Schemas excel at describing data structure but fail to capture:

- **Business Context**: Why do these constraints exist?
- **User Scenarios**: When would users encounter this validation?
- **Test Acceptance Criteria**: What does "correct behavior" look like in practice?

The Triple-Documentation Pattern solves this by embedding business rules and user stories directly into the schema itself, creating a **single source of truth** that serves developers, engineers, QA teams, product managers, and AI agents simultaneously.

## The Three Documentation Layers

### Layer 1: What (Technical Structure)

**Purpose**: Describe the data structure, format, and valid values

**Standard JSON Schema Properties**:

- `type`: Data type (string, number, boolean, array, object)
- `description`: Clear explanation of what this property represents
- `title`: Human-readable name
- `examples`: Concrete valid values
- `pattern`, `minLength`, `maxLength`, `minimum`, `maximum`, `enum`: Validation constraints

**Audience**: Technical developers implementing schemas and data models

**Example**:

```json
{
  "name": {
    "type": "string",
    "title": "Automation Name",
    "description": "Internal identifier name for the automation. Used in logs, UI displays, and API responses.",
    "minLength": 3,
    "maxLength": 100,
    "examples": ["Send Welcome Email", "Update Inventory", "Generate Monthly Report"]
  }
}
```

**What Developers Learn**:

- `name` is a string
- Minimum 3 characters, maximum 100 characters
- Used for internal identification
- See realistic examples

---

### Layer 2: Why (Business Rules & Constraints)

**Purpose**: Explain the rationale behind validation rules and business constraints

**Custom Property**: `x-business-rules` (array of strings)

**Content**:

- Why does this validation rule exist?
- What business requirement does it enforce?
- How does this property affect system behavior?
- What are the consequences of violating this rule?

**Audience**: Engineers understanding system design and business logic

**Example**:

```json
{
  "name": {
    "type": "string",
    "minLength": 3,
    "x-business-rules": [
      "Minimum 3 characters required to ensure automations have meaningful, distinguishable names in the UI",
      "Names should clearly describe the automation's purpose to aid in debugging and maintenance",
      "Names are displayed in automation lists, logs, and error messages where clarity is essential",
      "Maximum 100 characters prevents overflow in UI components and database storage optimization",
      "Names are used for filtering and searching, so descriptive names improve user experience"
    ]
  }
}
```

**What Engineers Learn**:

- **Why 3 characters minimum?** Ensures meaningful names, not just "a" or "ab"
- **Why 100 characters maximum?** UI constraints and database optimization
- **Business Impact**: Names appear in logs, UI, error messages - clarity matters
- **System Behavior**: Used for filtering and searching

---

### Layer 3: Who/When (User Stories & Acceptance Criteria)

**Purpose**: Define user scenarios and executable acceptance criteria for testing

**Custom Property**: `x-user-stories` (array of strings in GIVEN-WHEN-THEN format)

**Format**: Behavior-Driven Development (BDD) user stories

```
GIVEN {setup/precondition}
WHEN {action/trigger}
THEN {expected outcome/assertion}
```

**Audience**:

- **QA Teams**: Understand test scenarios and acceptance criteria
- **Product Teams**: Validate that implementation matches user needs
- **AI Agents** (e2e-red-test-writer): Automatically generate failing Playwright tests
- **Developers**: Understand real-world usage patterns

**Example**:

```json
{
  "name": {
    "type": "string",
    "minLength": 3,
    "x-user-stories": [
      "GIVEN user provides name with at least 3 characters WHEN validating input THEN value should be accepted",
      "GIVEN user provides name shorter than 3 characters WHEN validating input THEN error should require minimum length of 3",
      "GIVEN user provides name longer than 100 characters WHEN validating input THEN error should require maximum length of 100",
      "GIVEN automation exists with a specific name WHEN user searches by name THEN matching automations should be displayed in results",
      "GIVEN automation name is displayed in UI WHEN user views automation list THEN name should be clearly visible and not truncated",
      "GIVEN automation fails during execution WHEN error is logged THEN automation name should appear in error message for easy identification"
    ]
  }
}
```

**What AI Agents Generate** (e2e-red-test-writer):

```typescript
// tests/app/name.spec.ts
test.fixme(
  'should accept name with at least 3 characters',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: user provides name with at least 3 characters
    await startServerWithSchema({ name: 'Send Welcome Email' })

    // WHEN: validating input
    await page.goto('/')

    // THEN: value should be accepted
    await expect(page.locator('[data-testid="app-name"]')).toHaveText('Send Welcome Email')
  }
)

test.fixme(
  'should reject name shorter than 3 characters',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: user provides name shorter than 3 characters
    await startServerWithSchema({ name: 'ab' })

    // WHEN: validating input
    await page.goto('/')

    // THEN: error should require minimum length of 3
    await expect(page.locator('[data-testid="name-error"]')).toHaveText(
      'Automation name must be at least 3 characters'
    )
  }
)
```

---

## How the Three Layers Work Together

### Complete Property Example

Here's how all three layers combine to create a comprehensive specification:

```json
{
  "definitions": {
    "id": {
      "type": "integer",
      "title": "ID",
      "description": "Unique positive integer identifier assigned automatically by the system",
      "minimum": 1,
      "maximum": 9007199254740991,
      "examples": [1, 2, 3, 100, 1000],

      "x-business-rules": [
        "IDs are auto-generated by the system using auto-increment sequences",
        "IDs must be unique within their parent collection scope (e.g., table IDs unique per app, row IDs unique per table)",
        "IDs are immutable once assigned - cannot be changed or reused",
        "Maximum value enforced to ensure JavaScript number safety (Number.MAX_SAFE_INTEGER)",
        "Minimum value of 1 ensures all IDs are positive and truthy in conditional checks"
      ],

      "x-user-stories": [
        "GIVEN a new entity is created WHEN the system assigns an ID THEN it should be unique within the parent collection",
        "GIVEN an entity has been assigned an ID WHEN the entity is updated THEN the ID should remain unchanged",
        "GIVEN multiple entities exist in a collection WHEN querying by ID THEN the correct entity should be retrieved",
        "GIVEN an attempt to manually set an ID WHEN creating an entity THEN the system should ignore it and auto-generate a new ID"
      ]
    }
  }
}
```

### How Each Audience Benefits

| Audience                           | Layer Used                         | Benefit                                                                                             |
| ---------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Frontend Developer**             | What (description, type, examples) | "I need to render an ID - it's an integer between 1 and 9007199254740991"                           |
| **Backend Engineer**               | Why (x-business-rules)             | "IDs are auto-generated and immutable - I shouldn't allow manual assignment"                        |
| **QA Tester**                      | Who/When (x-user-stories)          | "I need to test that IDs remain unchanged after updates"                                            |
| **Product Manager**                | All three layers                   | "IDs are auto-generated (What), to ensure uniqueness (Why), and users can't change them (Who/When)" |
| **AI Agent (e2e-red-test-writer)** | Who/When (x-user-stories)          | "Generate a test: GIVEN entity updated WHEN ID checked THEN ID unchanged"                           |
| **AI Agent (schema-architect)**    | What + Why                         | "Implement Effect Schema with min(1), max(MAX_SAFE_INTEGER), and auto-generation logic"             |

---

## BDD-Ready: From Schema to Tests

### The TDD Pipeline

The Triple-Documentation Pattern enables **automated Test-Driven Development**:

1. **Product Specification** → Define requirements in `specs.schema.json`
2. **Schema Validation** → Run `bun run scripts/validate-schema.ts`
3. **User Story Generation** → Run `bun run scripts/add-user-stories.ts` (if needed)
4. **Roadmap Generation** → Run `bun run scripts/generate-roadmap.ts`
5. **RED Tests** → `e2e-red-test-writer` agent generates failing Playwright tests from x-user-stories
6. **GREEN Implementation** → `e2e-test-fixer` agent implements minimal code to pass tests
7. **REFACTOR** → `codebase-refactor-auditor` agent optimizes and removes duplication

### From User Story to Failing Test

**Schema** (`specs.schema.json`):

```json
{
  "theme": {
    "type": "string",
    "enum": ["light", "dark", "system"],
    "default": "system",
    "x-user-stories": [
      "GIVEN app configured with theme 'dark' WHEN user navigates to homepage THEN UI should use dark mode styles",
      "GIVEN app configured with theme 'light' WHEN user navigates to homepage THEN UI should use light mode styles",
      "GIVEN app configured with theme 'system' WHEN user navigates to homepage THEN UI should detect and apply system preference"
    ]
  }
}
```

**Generated Roadmap** (`docs/specifications/roadmap/theme.md`):

```markdown
#### E2E Test Blueprint

**Story 1: Dark Mode**
GIVEN: app configured with theme 'dark'
WHEN: user navigates to homepage
THEN: UI should use dark mode styles
data-testid: `theme-indicator`, `app-container`
```

**Generated RED Test** (`tests/app/theme.spec.ts`):

```typescript
test.fixme(
  'should use dark mode styles when theme is dark',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: app configured with theme 'dark'
    await startServerWithSchema({ name: 'test-app', theme: 'dark' })

    // WHEN: user navigates to homepage
    await page.goto('/')

    // THEN: UI should use dark mode styles
    await expect(page.locator('[data-testid="app-container"]')).toHaveClass(/dark-mode/)
  }
)
```

**Implemented Code** (by e2e-test-fixer agent):

```typescript
// src/presentation/components/app-container.tsx
import { useTheme } from '@/hooks/use-theme'

export function AppContainer() {
  const theme = useTheme() // Returns 'light' | 'dark' | 'system'
  const className = theme === 'dark' ? 'dark-mode' : 'light-mode'

  return (
    <div data-testid="app-container" className={className}>
      {/* App content */}
    </div>
  )
}
```

---

## Context-Aware Story Generation

The `scripts/add-user-stories.ts` tool generates intelligent, context-aware user stories based on property type and validation rules.

### ID Properties

**Schema Pattern**:

```json
{
  "id": {
    "type": "integer",
    "minimum": 1
  }
}
```

**Generated Stories**:

- "GIVEN a new entity is created WHEN the system assigns an ID THEN it should be unique within the parent collection"
- "GIVEN an entity has been assigned an ID WHEN the entity is updated THEN the ID should remain unchanged"
- "GIVEN multiple entities exist WHEN querying by ID THEN the correct entity should be retrieved"

### OAuth Credentials

**Schema Pattern**:

```json
{
  "clientId": {
    "type": "string",
    "pattern": "^[a-zA-Z0-9_-]+$"
  }
}
```

**Generated Stories**:

- "GIVEN valid OAuth client credentials WHEN authenticating THEN access token should be returned"
- "GIVEN invalid client ID WHEN authenticating THEN authentication should fail with clear error"
- "GIVEN expired credentials WHEN accessing protected resource THEN user should be prompted to re-authenticate"

### Boolean Flags

**Schema Pattern**:

```json
{
  "isActive": {
    "type": "boolean",
    "default": false
  }
}
```

**Generated Stories**:

- "GIVEN isActive is true WHEN processing entity THEN corresponding behavior should be enforced"
- "GIVEN isActive is false WHEN processing entity THEN behavior should be disabled"
- "GIVEN isActive is not specified WHEN creating entity THEN default value false should be used"

### Enum Properties

**Schema Pattern**:

```json
{
  "status": {
    "type": "string",
    "enum": ["draft", "published", "archived"]
  }
}
```

**Generated Stories**:

- "GIVEN status is 'draft' WHEN rendering UI THEN draft-specific styling should be applied"
- "GIVEN status is 'published' WHEN rendering UI THEN published-specific styling should be applied"
- "GIVEN invalid status value WHEN validating THEN error should list valid options: draft, published, archived"

### Webhook Paths

**Schema Pattern**:

```json
{
  "webhookPath": {
    "type": "string",
    "pattern": "^/webhooks/[a-z0-9-]+$"
  }
}
```

**Generated Stories**:

- "GIVEN webhook configured with valid path WHEN HTTP request arrives at that path THEN webhook handler should be invoked"
- "GIVEN webhook path conflicts with existing route WHEN server starts THEN error should prevent server startup"
- "GIVEN webhook receives POST request WHEN data is valid THEN automation should be triggered"

---

## Test-Extracted Stories vs. Auto-Generated Stories

### Test-Extracted Stories (High Quality)

For **critical root properties** (name, version, description), user stories are extracted directly from existing E2E tests:

**Source**: `tests/app/name.spec.ts`

```typescript
test('should display app name as main heading', async ({ page, startServerWithSchema }) => {
  await startServerWithSchema({ name: 'My Awesome App' })
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('My Awesome App')
})
```

**Extracted Story**:

```
"GIVEN a server configured with a specific app name WHEN user navigates to the homepage THEN the app name should be displayed as the main h1 heading"
```

**Advantages**:

- Derived from real, passing tests
- Verified behavior that actually works
- Matches exact implementation patterns
- High confidence in accuracy

### Auto-Generated Stories (Contextual)

For **all other properties**, stories are generated based on schema analysis:

**Source**: `specs.schema.json`

```json
{
  "maxRetries": {
    "type": "integer",
    "minimum": 0,
    "maximum": 10,
    "default": 3
  }
}
```

**Generated Stories**:

```
"GIVEN maxRetries is set to a value between 0 and 10 WHEN validation runs THEN value should be accepted"
"GIVEN maxRetries exceeds 10 WHEN validation runs THEN error should indicate maximum value is 10"
"GIVEN maxRetries is not specified WHEN creating entity THEN default value 3 should be used"
```

**Advantages**:

- Consistent format across all properties
- Covers validation rules systematically
- Scales to hundreds of properties
- Foundation for human refinement

**Recommended Workflow**:

1. Run `bun run scripts/add-user-stories.ts` to generate initial stories
2. Review auto-generated stories for accuracy
3. Refine stories based on domain knowledge
4. Extract stories from actual tests when available
5. Validate refined stories with product/QA teams
6. Regenerate roadmap with validated stories

---

## AI Agent Integration

### How e2e-red-test-writer Consumes Stories

**Input**: `docs/specifications/specs.schema.json` with property definitions containing `x-user-stories`

**Process**:

1. Reads specs.schema.json
2. Navigates to property definition (e.g., `properties.description`)
3. Extracts `x-user-stories` array (GIVEN-WHEN-THEN format)
4. Maps stories to Playwright test structure
5. Generates test.fixme() tests (RED phase)
6. Assigns test tags (@spec, @regression, @critical)

**Output**: `tests/app/{property}.spec.ts` with failing tests

**Example Transformation**:

**specs.schema.json Story** (from `properties.description.x-user-stories`):

```json
"x-user-stories": [
  "GIVEN user provides description with at least 10 characters WHEN validating input THEN value should be accepted"
]
```

**Generated Test**:

```typescript
test.fixme(
  'should accept description with at least 10 characters',
  { tag: '@spec' },
  async ({ page, startServerWithSchema }) => {
    // GIVEN: user provides description with at least 10 characters
    await startServerWithSchema({
      name: 'test-app',
      description: 'This is a valid description with enough characters',
    })

    // WHEN: validating input
    await page.goto('/')

    // THEN: value should be accepted
    await expect(page.locator('[data-testid="app-description"]')).toHaveText(
      'This is a valid description with enough characters'
    )
  }
)
```

### How schema-architect Consumes Business Rules

**Input**: `docs/specifications/specs.schema.json` with property definitions containing constraints and `x-business-rules`

**Process**:

1. Reads specs.schema.json
2. Navigates to property definition (e.g., `properties.description`)
3. Extracts JSON Schema constraints (type, minLength, maxLength, pattern, etc.)
4. Reads `x-business-rules` to understand WHY constraints exist
5. Implements Effect Schema with validation rules
6. Adds annotations (title, description, examples) from schema metadata
7. Creates unit tests based on constraints and x-business-rules

**Output**: `src/domain/models/app/{property}.ts` with working schema

**Example Transformation**:

**specs.schema.json Definition** (from `properties.description`):

```json
{
  "description": {
    "description": "Brief explanation of what the application does",
    "type": "string",
    "minLength": 10,
    "maxLength": 500,
    "examples": [
      "A task management system for remote teams",
      "Customer relationship management platform"
    ],
    "x-business-rules": [
      "Description must be long enough to be meaningful (10+ chars)",
      "Description must fit in UI cards (500 char limit)"
    ]
  }
}
```

**Implemented Schema**:

```typescript
// src/domain/models/app/description.ts
import { Schema } from 'effect'

export const DescriptionSchema = Schema.String.pipe(
  Schema.minLength(10, {
    message: () => 'Description must be at least 10 characters',
  }),
  Schema.maxLength(500, {
    message: () => 'Description must not exceed 500 characters',
  }),
  Schema.annotations({
    title: 'App Description',
    description: 'Brief explanation of what the application does',
    examples: [
      'A task management system for remote teams',
      'Customer relationship management platform',
    ],
  })
)

export type Description = Schema.Schema.Type<typeof DescriptionSchema>
```

---

## Benefits of the Triple-Documentation Pattern

### 1. Single Source of Truth

**Problem**: Documentation scattered across Jira tickets, Confluence docs, code comments, test files
**Solution**: Everything in `specs.schema.json` - one file, always in sync

### 2. Automated Test Generation

**Problem**: Writing E2E tests is manual, time-consuming, and inconsistent
**Solution**: AI agents auto-generate tests from x-user-stories in GIVEN-WHEN-THEN format

### 3. Business Context in Code

**Problem**: Developers don't understand WHY validation rules exist
**Solution**: x-business-rules explain rationale directly in the schema

### 4. Living Specification

**Problem**: Documentation becomes stale as code evolves
**Solution**: Schema drives code generation → code changes require schema updates → documentation stays current

### 5. Cross-Functional Alignment

**Problem**: Product, engineering, and QA teams work from different documentation
**Solution**: All teams reference the same schema with layers tailored to their needs

### 6. Scalable TDD

**Problem**: TDD doesn't scale to hundreds of features and properties
**Solution**: Auto-generate tests from user stories → implement → refactor

### 7. Onboarding Efficiency

**Problem**: New developers need weeks to understand business rules and validation logic
**Solution**: Read x-business-rules and x-user-stories to understand WHY and WHEN

### 8. Regression Prevention

**Problem**: Changes break existing behavior without warning
**Solution**: User stories define acceptance criteria → tests fail if behavior changes

---

## Workflow: From Schema to Implementation

### Step 1: Define Product Specification

Product team updates `specs.schema.json`:

```json
{
  "timeout": {
    "type": "integer",
    "minimum": 100,
    "maximum": 60000,
    "default": 5000,
    "title": "Request Timeout",
    "description": "Maximum time in milliseconds to wait for a response",
    "examples": [1000, 5000, 30000],
    "x-business-rules": [
      "Minimum 100ms prevents unrealistic timeout values that would always fail",
      "Maximum 60000ms (60 seconds) prevents indefinite hangs in automation workflows",
      "Default 5000ms (5 seconds) balances responsiveness with reliability for typical API calls"
    ]
  }
}
```

### Step 2: Validate Schema

```bash
bun run scripts/validate-schema.ts
```

Output:

```
✅ Schema validation passed
```

### Step 3: Generate User Stories

```bash
bun run scripts/add-user-stories.ts
```

Output:

```
✅ Added x-user-stories to 1 property (timeout)
Generated 4 user stories:
- GIVEN timeout is set between 100ms and 60000ms WHEN validating THEN value should be accepted
- GIVEN timeout is below 100ms WHEN validating THEN error should indicate minimum is 100ms
- GIVEN timeout exceeds 60000ms WHEN validating THEN error should indicate maximum is 60000ms
- GIVEN timeout is not specified WHEN creating request THEN default 5000ms should be used
```

### Step 4: Regenerate Roadmap

```bash
bun run scripts/generate-roadmap.ts
```

Output:

```
✅ Generated roadmap for 1 property
Created: docs/specifications/roadmap/timeout.md
```

### Step 5: Validate User Stories with Product/QA

Review `docs/specifications/roadmap/timeout.md`:

- Are stories complete?
- Are stories correct?
- Are stories clear?
- Any missing scenarios?

Refine stories based on feedback.

### Step 6: Generate RED Tests

Invoke `e2e-red-test-writer` agent:

```
User: "Generate E2E tests for timeout property"
```

Agent creates `tests/app/timeout.spec.ts` with 4 test.fixme() tests.

### Step 7: Implement Schema

Invoke `schema-architect` agent:

```
User: "Implement TimeoutSchema based on roadmap"
```

Agent creates `src/domain/models/app/timeout.ts` with Effect Schema.

### Step 8: Make Tests Pass

Invoke `e2e-test-fixer` agent:

```
User: "Fix failing tests for timeout property"
```

Agent implements minimal code to make tests pass (GREEN phase).

### Step 9: Refactor & Optimize

Invoke `codebase-refactor-auditor` agent:

```
User: "Audit and optimize timeout implementation"
```

Agent removes duplication and improves code quality.

---

## Maintaining the Triple-Documentation Pattern

### When to Update specs.schema.json

**Add x-business-rules**:

- New validation rule added
- Constraint rationale changes
- Business requirement evolves
- System behavior is clarified

**Add x-user-stories**:

- New feature scenario identified
- Edge case discovered
- Test coverage gap found
- User workflow changes

**Update Examples**:

- Real-world usage patterns change
- More representative examples found
- Examples become outdated

### Validation Checklist

Before committing changes to `specs.schema.json`:

- [ ] All properties have `description` and `title`
- [ ] All properties have at least 2 `examples`
- [ ] All properties with validation rules have `x-business-rules` explaining WHY
- [ ] All properties have 2-4 `x-user-stories` in GIVEN-WHEN-THEN format
- [ ] Run `bun run scripts/validate-schema.ts` (must pass)
- [ ] Run `bun run scripts/generate-roadmap.ts` (must succeed)
- [ ] Review generated roadmap files for completeness

### Story Quality Standards

**Good User Story**:

```
GIVEN automation configured with valid webhook path WHEN HTTP POST request arrives THEN webhook handler should be invoked
```

**Bad User Story** (too vague):

```
GIVEN webhook WHEN request THEN works
```

**Good User Story** (specific, testable):

```
GIVEN user provides description shorter than 10 characters WHEN validating input THEN error should display 'Description must be at least 10 characters'
```

**Bad User Story** (no expected outcome):

```
GIVEN user provides short description WHEN validating THEN error
```

### File Structure

```
docs/specifications/
├── specs.schema.json              ← Triple-Documentation source (What + Why + Who/When)
├── vision.md                      ← High-level business goals
├── triple-documentation-pattern.md ← This document
└── roadmap/
    ├── name.md                    ← Generated from specs.schema.json
    ├── version.md
    ├── description.md
    └── {property}.md

scripts/
├── validate-schema.ts             ← Validates specs.schema.json structure
├── add-user-stories.ts            ← Generates x-user-stories for properties
└── generate-roadmap.ts            ← Creates roadmap/ files from specs.schema.json

tests/app/
├── name.spec.ts                   ← Generated by e2e-red-test-writer from roadmap/name.md
├── version.spec.ts
└── {property}.spec.ts

src/domain/models/app/
├── name.ts                        ← Implemented by schema-architect from roadmap/name.md
├── version.ts
└── {property}.ts
```

---

## Summary

The **Triple-Documentation Pattern** transforms `specs.schema.json` from a simple data structure definition into a comprehensive, living specification that:

1. **Describes WHAT** (structure) for developers
2. **Explains WHY** (business rules) for engineers
3. **Defines WHO/WHEN** (user stories) for QA, product, and AI agents

This pattern enables:

- **Automated TDD**: User stories → RED tests → GREEN implementation → REFACTOR
- **Cross-Functional Alignment**: One source of truth for all teams
- **Scalable Development**: AI agents generate tests and code from specifications
- **Living Documentation**: Schema changes cascade to tests and implementation
- **Onboarding Efficiency**: New developers understand WHAT, WHY, and WHO/WHEN from one file

By embedding business context and acceptance criteria directly into the schema, we create a self-documenting, test-driven system that scales from 3 properties (current) to 691 properties (vision) without manual overhead.

**Next Steps**:

1. Review `specs.schema.json` to see the pattern in action
2. Run `bun run scripts/add-user-stories.ts` to generate missing user stories
3. Run `bun run scripts/generate-roadmap.ts` to create implementation blueprints
4. Invoke AI agents to generate tests and implement features
5. See `@docs/development/agent-workflows.md` for complete TDD pipeline

---

**Related Documentation**:

- `@docs/specifications/specs.schema.json` - The schema file implementing this pattern
- `@docs/specifications/vision.md` - High-level product vision
- `@docs/development/agent-workflows.md` - Complete TDD pipeline with AI agents
- `@.claude/agents/spec-coherence-guardian.md` - Agent responsible for maintaining schema coherence
- `@.claude/agents/e2e-red-test-writer.md` - Agent that generates RED tests from user stories
- `@.claude/agents/schema-architect.md` - Agent that implements Effect Schemas from blueprints
