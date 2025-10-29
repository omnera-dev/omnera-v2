# Codebase Refactor Auditor Agent Instructions

## Context

You are the codebase-refactor-auditor agent for the Omnera™ project. Your task is to refactor the recent TDD implementation to eliminate code duplication and improve code quality.

**Feature**: `{feature_name}`
**Recent commits**: `{commit_list}`
**Tests fixed**: `{tests_fixed_count}`
**Code duplication areas**: `{duplication_notes}`

## Your Mission

Refactor the recent implementation following your two-phase approach while maintaining all test baselines.

## Workflow

### PHASE 0: Establish Baseline

Record the current state of all tests:

```bash
# Save current test results
echo "=== SPEC TESTS BASELINE ===" > baseline-spec.txt
bun test:e2e --grep @spec >> baseline-spec.txt 2>&1
echo "SPEC EXIT CODE: $?" >> baseline-spec.txt

echo "=== REGRESSION TESTS BASELINE ===" > baseline-regression.txt
bun test:e2e:regression >> baseline-regression.txt 2>&1
echo "REGRESSION EXIT CODE: $?" >> baseline-regression.txt

# Count passing tests
SPEC_PASS=$(grep -c "✓" baseline-spec.txt || echo "0")
REGRESSION_PASS=$(grep -c "✓" baseline-regression.txt || echo "0")

echo "Baseline established: $SPEC_PASS spec tests, $REGRESSION_PASS regression tests"
```

### PHASE 1: Analyze Recent Implementation

#### 1.1 Immediate Refactoring (Recent Commits)

Analyze the recent TDD implementation:

```bash
# View recent commits
git log --oneline -10

# See what files were changed
git diff --stat HEAD~{commit_count}..HEAD

# Analyze specific files from commits
git show --stat {commit_hashes}
```

Look for:

- **Code duplication**: Similar patterns repeated across files
- **Long functions**: Functions > 30 lines that could be decomposed
- **Missing abstractions**: Common patterns that should be extracted
- **Layer violations**: Code in wrong architectural layer
- **Effect.ts opportunities**: Places where Effect patterns would improve code

#### 1.2 Recommendations (Older Code)

Scan related older code:

- Files in the same feature area
- Files that import/export to the new code
- Similar patterns in other features

**DO NOT refactor older code** - only document recommendations.

### PHASE 2: Apply Refactoring Patterns

Apply these Omnera-specific patterns:

#### Pattern 1: Extract Effect Programs

```typescript
// Before: Inline logic
const handler = (input) => {
  // validation
  // business logic
  // error handling
}

// After: Effect program
const processInput = (input: Input) =>
  Effect.gen(function* () {
    const validated = yield* Schema.decode(InputSchema)(input)
    const result = yield* businessLogic(validated)
    return yield* formatOutput(result)
  })
```

#### Pattern 2: Layer Separation

```typescript
// Move from presentation to domain
// Before: src/presentation/api/routes/feature.ts
const calculateTotal = (items) => {
  /* logic */
}

// After: src/domain/feature/calculations.ts
export const calculateTotal = (items: readonly Item[]): Total => pipe(items, Array.reduce(/*...*/))
```

#### Pattern 3: Schema Consolidation

```typescript
// Before: Multiple similar schemas
const UserInput = Schema.Struct({ name: Schema.String })
const UserOutput = Schema.Struct({ name: Schema.String, id: Schema.String })

// After: Composed schemas
const UserBase = Schema.Struct({ name: Schema.String })
const UserOutput = Schema.extend(UserBase, Schema.Struct({ id: Schema.String }))
```

#### Pattern 4: Extract Custom Hooks (UI)

```typescript
// Before: Logic in component
const Component = () => {
  const [state, setState] = useState()
  // complex logic

// After: Custom hook
const useFeature = () => {
  // extracted logic
  return { state, actions }
}
```

### PHASE 3: Implement Refactoring

1. **Create new abstractions first**
   - Extract common functions
   - Create shared schemas
   - Define interfaces

2. **Update existing code to use abstractions**
   - Replace duplicated code with function calls
   - Use shared schemas
   - Implement interfaces

3. **Remove old code**
   - Delete duplicated implementations
   - Remove unused imports
   - Clean up comments

### PHASE 4: Validation

Ensure all tests still pass:

```bash
# Run the same tests as Phase 0
echo "=== SPEC TESTS AFTER ===" > after-spec.txt
bun test:e2e --grep @spec >> after-spec.txt 2>&1
echo "SPEC EXIT CODE: $?" >> after-spec.txt

echo "=== REGRESSION TESTS AFTER ===" > after-regression.txt
bun test:e2e:regression >> after-regression.txt 2>&1
echo "REGRESSION EXIT CODE: $?" >> after-regression.txt

# Compare baselines
diff baseline-spec.txt after-spec.txt
diff baseline-regression.txt after-regression.txt

# Ensure no test count decreased
SPEC_PASS_AFTER=$(grep -c "✓" after-spec.txt || echo "0")
REGRESSION_PASS_AFTER=$(grep -c "✓" after-regression.txt || echo "0")

if [ "$SPEC_PASS_AFTER" -lt "$SPEC_PASS" ]; then
  echo "ERROR: Spec tests regressed!"
  exit 1
fi

if [ "$REGRESSION_PASS_AFTER" -lt "$REGRESSION_PASS" ]; then
  echo "ERROR: Regression tests failed!"
  exit 1
fi
```

### PHASE 5: Commit

If all tests pass, commit the refactoring:

```bash
# Add copyright headers to new files
bun run license

# Final quality check
bun run lint && bun run typecheck

# Commit
git add -A
git commit -m "refactor: optimize {feature_name} implementation

- Eliminated code duplication in {areas}
- Extracted {count} shared functions
- Improved layer separation
- Maintained all test baselines
- Reduced codebase by {lines} lines"
```

## Important Rules

1. **NEVER** change functionality - only structure
2. **ALWAYS** maintain test baselines
3. **STOP** immediately if any test fails
4. **DOCUMENT** recommendations for older code (don't refactor)
5. **FOLLOW** Omnera patterns strictly

## Success Metrics

Report the following after refactoring:

- **Code reduction**: `{percentage}%` fewer lines
- **Duplication eliminated**: `{count}` instances
- **Functions extracted**: `{count}`
- **Schemas consolidated**: `{count}`
- **Layer violations fixed**: `{count}`
- **Test baseline**: `maintained ✅` or `failed ❌`

## Error Recovery

If tests fail after refactoring:

1. **Identify** which refactoring caused the failure
2. **Revert** that specific change
3. **Re-test** to confirm fix
4. **Document** why that refactoring didn't work
5. **Continue** with other refactorings if possible

## Recommendations Format

For older code recommendations, use this format:

```markdown
## Refactoring Recommendations (Future Work)

### File: src/domain/other-feature/logic.ts

- **Issue**: Similar pattern to what we just refactored
- **Suggestion**: Extract shared function `processItems()`
- **Impact**: Would reduce ~30 lines of duplication
- **Risk**: Low - well-tested area

### File: src/presentation/ui/components/old-component.tsx

- **Issue**: Contains business logic that belongs in domain layer
- **Suggestion**: Move calculations to `src/domain/calculations.ts`
- **Impact**: Better separation of concerns
- **Risk**: Medium - requires careful testing
```

## Final Checklist

Before committing, ensure:

- [ ] All test baselines maintained
- [ ] No functionality changed
- [ ] Code duplication reduced
- [ ] Layer architecture followed
- [ ] Effect.ts patterns applied
- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] Copyright headers added
