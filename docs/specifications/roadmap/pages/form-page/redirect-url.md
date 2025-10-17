# Pages.form-page.redirectUrl

> **Status**: ⏳ NOT STARTED
> **Completion**: 0%
> **Complexity**: 10 points

URL to redirect to after successful submission

## Implementation Status

⏳ **Not Started**

### Required Features

- All functionality

---

## Effect Schema Blueprint

> **For**: `schema-architect` agent

The following Effect Schema definition should be implemented in `src/domain/models/app/`.

### Pages.form-page.redirectUrl Schema

**Location**: `src/domain/models/app/pages.form-page.redirectUrl.ts`

**Imports**:

```typescript
import { Schema } from 'effect'
```

**Implementation**:

```typescript
/**
 *
 * URL to redirect to after successful submission
 */
export const Pages.form-page.redirectUrlSchema = Schema.String.pipe(
    Schema.minLength(1, { message: () => 'This field is required' }),
    Schema.pattern(/^/[a-z0-9-/]*$/, {
    message: () => 'URL path'
  }),
    Schema.annotations({
    title: "Path",
    description: "URL path"
  })
  )

export type Pages.form-page.redirectUrl = Schema.Schema.Type<typeof Pages.form-page.redirectUrlSchema>
```

---

## E2E Test Scenarios

> **For**: `e2e-red-test-writer` agent

The following user stories should be implemented as Playwright tests in `tests/app/`.

**Test File**: `tests/app/pages.form-page.redirect-url.spec.ts`

### @regression User Story (Complete Workflow)

This test consolidates ALL @spec tests into ONE comprehensive workflow.

**Complete Configuration Workflow**:

- **GIVEN**: user is configuring Pages.form-page.redirect url in the application
- **WHEN**: user completes full configuration workflow including all fields and validations
- **THEN**: configuration is saved successfully with all validations passing and data persists correctly
- **Tag**: `@regression`

---

## Definition of Done

This property is complete when:

- [ ] Effect Schema implemented and exported
- [ ] All 1 @regression E2E tests passing
- [ ] Unit test coverage >80%
- [ ] All TypeScript strict mode checks passing
- [ ] All ESLint checks passing
- [ ] All Prettier formatting checks passing
- [ ] JSON schema export updated via `bun run export:schema`

**Current Blockers**:

- None (ready to start)

---

## Related Documentation

- **Vision Schema**: [`docs/specifications/specs.schema.json`](../specs.schema.json)
- **Current Schema**: [`schemas/0.0.1/app.schema.json`](../../schemas/0.0.1/app.schema.json)
- **Testing Strategy**: [`docs/architecture/testing-strategy.md`](../../architecture/testing-strategy.md)
- **Main Roadmap**: [`ROADMAP.md`](../../../ROADMAP.md)
