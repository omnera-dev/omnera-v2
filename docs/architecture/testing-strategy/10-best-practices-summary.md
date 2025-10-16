# Testing Strategy - E2E-First TDD with Test-After Unit Tests

> **Note**: This is part 10 of the split documentation. See navigation links below.

## Best Practices Summary

### E2E Tests (Playwright) - Test-Driven Development (TDD)

1. **Fast**: Mock APIs, parallel workers, focused critical paths
2. **Isolated**: Separate contexts, unique test data, no shared state
3. **Repeatable**: Mock time-sensitive operations, fixed test data
4. **Self-Validating**: Playwright assertions, verify UI state
5. **Timely**: Write E2E tests FIRST (before implementation) as executable specifications
6. **Given-When-Then**: Structure user workflows clearly
7. **User-Visible Behavior**: Test what users see, not implementation details
8. **Role-Based Locators**: Use `getByRole`, `getByLabel`, `getByText` over CSS selectors
9. **Web-First Assertions**: Use `await expect()` for auto-waiting and retries
10. **No Manual Waits**: Avoid `waitForTimeout()`, trust auto-waiting
    **E2E-First Development Flow:**

```
1. Write E2E test (defines feature completion)
2. Implement until E2E passes
3. Add unit test coverage (see below)
```

### Unit Tests (Bun) - Test-After Development

1. **Fast**: Test pure functions, mock I/O, run in parallel
2. **Isolated**: Use `beforeEach` for setup, avoid shared state
3. **Repeatable**: Mock time/random, use deterministic data
4. **Self-Validating**: Explicit assertions, clear error messages
5. **Timely**: Write unit tests AFTER implementation (documents actual solution)
6. **Given-When-Then**: Structure tests into setup, action, assertion
   **Unit-After Development Flow:**

```
1. Feature implemented (E2E test passing)
2. Write unit tests for internal logic
3. Test edge cases, error paths, boundary conditions
4. Unit tests enable confident refactoring
```

---

## Navigation

[← Part 9](./09-test-execution-strategies.md) | [Part 11 →](./11-anti-patterns-to-avoid.md)

**Parts**: [Part 1](./01-start.md) | [Part 2](./02-overview.md) | [Part 3](./03-testing-approach.md) | [Part 4](./04-managing-red-tests-with-fixme.md) | [Part 5](./05-quick-reference-when-to-write-tests.md) | [Part 6](./06-test-file-naming-convention.md) | [Part 7](./07-testing-principles.md) | [Part 8](./08-playwright-best-practices.md) | [Part 9](./09-test-execution-strategies.md) | **Part 10** | [Part 11](./11-anti-patterns-to-avoid.md) | [Part 12](./12-enforcement-and-code-review.md) | [Part 13](./13-references.md)
