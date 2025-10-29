---
name: TDD Auto-Fix Task
about: Automated TDD implementation task for Claude Code
title: '🤖 TDD: Fix tests in [FEATURE]'
labels: tdd-automation, needs-implementation
assignees: ''
---

## 🤖 Automated TDD Task

### Configuration

- **Test file:** `[TEST_FILE_PATH]`
- **Feature:** [FEATURE_NAME]
- **Tests with .fixme:** [FIXME_COUNT]
- **Max tests this run:** [MAX_TESTS]
- **Branch:** `[BRANCH_NAME]`
- **Triggered by:** @[ACTOR]
- **Workflow run:** [#RUN_NUMBER](RUN_URL)

### Instructions for @claude

Please follow these steps to fix the failing tests:

1. **Checkout the branch:**

   ```bash
   git checkout [BRANCH_NAME]
   ```

2. **Run the e2e-test-fixer agent:**
   Use the Task tool with `subagent_type="e2e-test-fixer"` to:
   - Remove test.fixme() from up to [MAX_TESTS] tests
   - Implement minimal code to make tests pass
   - Follow the Omnera architecture patterns (Effect.ts, layer-based)

3. **Validate the implementation:**

   ```bash
   # Run the specific test file
   CLAUDECODE=1 bun test:e2e [TEST_FILE_PATH]

   # Run regression tests
   bun test:e2e:regression

   # Check code quality
   bun run lint && bun run typecheck
   ```

4. **If more than 3 tests were fixed, run refactoring:**
   Use the Task tool with `subagent_type="codebase-refactor-auditor"` to:
   - Eliminate code duplication
   - Optimize the implementation
   - Ensure tests still pass

5. **Commit the changes:**

   ```bash
   bun run license  # Add copyright headers
   git add -A
   git commit -m "fix: implement [FEATURE_NAME] functionality

   - Fixed [NUMBER] tests in [TEST_FILE]
   - Followed Effect.ts patterns and layer architecture
   - All E2E and regression tests passing"
   ```

### Success Criteria

- ✅ Up to [MAX_TESTS] tests fixed (test.fixme removed)
- ✅ All modified tests pass
- ✅ Regression tests pass
- ✅ TypeScript compiles without errors
- ✅ ESLint passes
- ✅ Implementation follows Omnera patterns

### Progress Tracking

- [ ] Tests analyzed
- [ ] Code implemented
- [ ] Tests passing
- [ ] Code refactored (if applicable)
- [ ] Changes committed

### Related PR

- Pull Request: #[PR_NUMBER]

---

_This issue was created automatically by the TDD pipeline._
