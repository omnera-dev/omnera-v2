## Creating a matcher

You can create a `Matcher` using either:

- `Match.type<T>()`: Matches against a specific type.
- `Match.value(value)`: Matches against a specific value.

### Matching by Type

The `Match.type` constructor defines a `Matcher` that operates on a specific type. Once created, you can use patterns like `Match.when` to define conditions for handling different cases.

**Example** (Matching Numbers and Strings)

```ts twoslash
import { Match } from "effect"

// Create a matcher for values that are either strings or numbers
//
//      ┌─── (u: string | number) => string
//      ▼
const match = Match.type<string | number>().pipe(
  // Match when the value is a number
  Match.when(Match.number, (n) => `number: ${n}`),
  // Match when the value is a string
  Match.when(Match.string, (s) => `string: ${s}`),
  // Ensure all possible cases are handled
  Match.exhaustive
)

console.log(match(0))
// Output: "number: 0"

console.log(match("hello"))
// Output: "string: hello"
```

### Matching by Value

Instead of creating a matcher for a type, you can define one directly from a specific value using `Match.value`.

**Example** (Matching an Object by Property)

```ts twoslash
import { Match } from "effect"

const input = { name: "John", age: 30 }

// Create a matcher for the specific object
const result = Match.value(input).pipe(
  // Match when the 'name' property is "John"
  Match.when(
    { name: "John" },
    (user) => `${user.name} is ${user.age} years old`
  ),
  // Provide a fallback if no match is found
  Match.orElse(() => "Oh, not John")
)

console.log(result)
// Output: "John is 30 years old"
```

### Enforcing a Return Type

You can use `Match.withReturnType<T>()` to ensure that all branches return a specific type.

**Example** (Validating Return Type Consistency)

This example enforces that every matching branch returns a `string`.

```ts twoslash
import { Match } from "effect"

const match = Match.type<{ a: number } | { b: string }>().pipe(
  // Ensure all branches return a string
  Match.withReturnType<string>(),
  // ❌ Type error: returns a number
// @errors: 2322
  Match.when({ a: Match.number }, (_) => _.a),
  // ✅ Correct: returns a string
  Match.when({ b: Match.string }, (_) => _.b),
  Match.exhaustive
)
```

<Aside type="note" title="Must Be First in the Pipeline">
  The `Match.withReturnType<T>()` call must be the first instruction in the pipeline.
  If placed later, TypeScript will not properly enforce return type consistency.
</Aside>
