# ADR-002: Domain Feature Isolation Pattern

## Status

Accepted (Enforcement Fixed)

## Context

The domain layer contains multiple feature models that could potentially depend on each other:

- **Table models** - Database table configurations
- **Page models** - UI page configurations
- **Automation models** - Workflow automation configurations

Without clear boundaries, these features could become tightly coupled, making the codebase difficult to maintain and evolve independently.

## Decision

We will enforce **strict feature isolation** within the domain models:

1. Features are organized in separate directories: `table/`, `page/`, `automation/`
2. Features **cannot import from each other** (enforced by ESLint boundaries)
3. Shared functionality goes in `common/` directory
4. Root aggregation files (`tables.ts`, `pages.ts`) can import from features to re-export

## Rationale

### Why Feature Isolation

1. **Independent Evolution**: Each feature can be developed, tested, and deployed independently
2. **Clear Boundaries**: Developers know exactly where code belongs
3. **Prevent Coupling**: Features cannot accidentally depend on each other's internals
4. **Parallel Development**: Teams can work on different features without conflicts
5. **Future Modularity**: Features could become separate packages if needed

### Why Strict Enforcement

Initially, the ESLint boundaries were misconfigured (looking for plural directory names when actual directories were singular). This meant the intended isolation was **not being enforced**, allowing potential coupling to creep in.

By fixing the ESLint configuration, we now have:

- Compile-time prevention of cross-feature imports
- Clear error messages when violations occur
- Automated enforcement in CI/CD

## Implementation

### Directory Structure

```
src/domain/models/app/
├── table/              # Table feature (isolated)
│   ├── index.ts
│   ├── fields.ts
│   └── field-types/
├── page/               # Page feature (isolated)
│   ├── layout/
│   ├── meta/
│   └── sections.ts
├── automation/         # Automation feature (isolated)
│   └── triggers/
├── common/             # Shared across features
├── tables.ts          # Aggregates table exports
├── pages.ts           # Aggregates page exports
└── index.ts           # Main entry point
```

### ESLint Boundaries Configuration

```typescript
// Fixed configuration (singular directory names)
{
  type: 'domain-model-table',
  pattern: 'src/domain/models/app/table/**/*'
},
{
  type: 'domain-model-page',
  pattern: 'src/domain/models/app/page/**/*'
},
{
  type: 'domain-model-automation',
  pattern: 'src/domain/models/app/automation/**/*'
}
```

## Consequences

### Positive

- ✅ Features remain decoupled and maintainable
- ✅ Clear code organization and ownership
- ✅ Easier to onboard new developers
- ✅ Reduced risk of unintended dependencies
- ✅ Foundation for future modularization

### Negative

- ❌ Cannot share code directly between features
- ❌ Some duplication might occur
- ❌ More complex initial setup
- ❌ Requires discipline to maintain

### Mitigation Strategies

1. **Common Directory**: Shared utilities and types go in `common/`
2. **Root Aggregation**: Root files can compose features together
3. **Documentation**: Clear guidelines on where code belongs
4. **Code Reviews**: Ensure new code follows the pattern

## Bug Discovery

During documentation review (2025-01-29), we discovered the ESLint boundaries were misconfigured:

- **Bug**: Patterns used plural names (`tables/`, `pages/`) but directories were singular
- **Impact**: Feature isolation was not being enforced at all
- **Fix**: Updated patterns to match actual directory names
- **Verification**: `bun run lint` now properly enforces boundaries

This highlights the importance of:

1. Testing that enforcement rules actually work
2. Regular architecture audits
3. Automated validation of configuration

## Alternatives Considered

### Alternative 1: Monolithic Domain Model

- Single file or directory with all models
- **Rejected**: Would become unmaintainable as features grow

### Alternative 2: Microservices

- Separate services for each feature
- **Rejected**: Premature optimization, too much operational overhead

### Alternative 3: Soft Boundaries

- Guidelines without enforcement
- **Rejected**: Guidelines tend to be violated over time without enforcement

### Alternative 4: npm Workspaces

- Each feature as separate package
- **Rejected**: Too much complexity for current project size

## References

- [Feature Sliced Design](https://feature-sliced.design/)
- [ESLint Plugin Boundaries](https://github.com/javierbrea/eslint-plugin-boundaries)
- [Domain Driven Design](https://martinfowler.com/bliki/BoundedContext.html)

## Decision Date

2025-01-29 (Enforcement Fixed)

## Decision Makers

- Development Team
- Architecture Team

## Review Date

2025-04-01 (3 months)

---

**Note**: The discovery that boundaries weren't being enforced emphasizes the need for architecture validation tests. Consider adding automated tests that verify ESLint rules are actually preventing the imports they claim to prevent.
