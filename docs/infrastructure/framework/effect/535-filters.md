## Filters

When generating random values, `Arbitrary` tries to follow the schema's constraints. It uses the most appropriate `fast-check` primitives and applies constraints if the primitive supports them.

For instance, if you define an `age` property as:

```ts showLineNumbers=false
Schema.Int.pipe(Schema.between(1, 80))
```

the arbitrary generation will use:

```ts showLineNumbers=false
FastCheck.integer({ min: 1, max: 80 })
```

to produce values within that range.

<Aside type="note" title="Avoiding Conflicts in Filters">
When using multiple filters, be aware that conflicting filters might lead to hangs during arbitrary data generation. This can occur when the constraints make it difficult or impossible to produce valid values.

For guidance on mitigating these issues, refer to [this discussion](https://github.com/dubzzz/fast-check/discussions/4659).

</Aside>

### Patterns

To generate efficient arbitraries for strings that must match a certain pattern, use the `Schema.pattern` filter instead of writing a custom filter:

**Example** (Using `Schema.pattern` for Pattern Constraints)

```ts twoslash
import { Schema } from 'effect'

// ❌ Without using Schema.pattern (less efficient)
const Bad = Schema.String.pipe(Schema.filter((s) => /^[a-z]+$/.test(s)))

// ✅ Using Schema.pattern (more efficient)
const Good = Schema.String.pipe(Schema.pattern(/^[a-z]+$/))
```

By using `Schema.pattern`, arbitrary generation will rely on `FastCheck.stringMatching(regexp)`, which is more efficient and directly aligned with the defined pattern.

When multiple patterns are used, they are combined into a union. For example:

```ts
(?:${pattern1})|(?:${pattern2})
```

This approach ensures all patterns have an equal chance of generating values when using `FastCheck.stringMatching`.
