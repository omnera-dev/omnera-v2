## Defining patterns

### when

The `Match.when` function allows you to define conditions for matching values. It supports both direct value comparisons and predicate functions.

**Example** (Matching with Values and Predicates)

```ts twoslash
import { Match } from 'effect'

// Create a matcher for objects with an "age" property
const match = Match.type<{ age: number }>().pipe(
  // Match when age is greater than 18
  Match.when({ age: (age) => age > 18 }, (user) => `Age: ${user.age}`),
  // Match when age is exactly 18
  Match.when({ age: 18 }, () => 'You can vote'),
  // Fallback case for all other ages
  Match.orElse((user) => `${user.age} is too young`)
)

console.log(match({ age: 20 }))
// Output: "Age: 20"

console.log(match({ age: 18 }))
// Output: "You can vote"

console.log(match({ age: 4 }))
// Output: "4 is too young"
```

### not

The `Match.not` function allows you to exclude specific values while matching all others.

**Example** (Ignoring a Specific Value)

```ts twoslash
import { Match } from 'effect'

// Create a matcher for string or number values
const match = Match.type<string | number>().pipe(
  // Match any value except "hi", returning "ok"
  Match.not('hi', () => 'ok'),
  // Fallback case for when the value is "hi"
  Match.orElse(() => 'fallback')
)

console.log(match('hello'))
// Output: "ok"

console.log(match('hi'))
// Output: "fallback"
```

### tag

The `Match.tag` function allows pattern matching based on the `_tag` field in a [Discriminated Union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions). You can specify multiple tags to match within a single pattern.

**Example** (Matching a Discriminated Union by Tag)

```ts twoslash
import { Match } from 'effect'

type Event =
  | { readonly _tag: 'fetch' }
  | { readonly _tag: 'success'; readonly data: string }
  | { readonly _tag: 'error'; readonly error: Error }
  | { readonly _tag: 'cancel' }

// Create a Matcher for Either<number, string>
const match = Match.type<Event>().pipe(
  // Match either "fetch" or "success"
  Match.tag('fetch', 'success', () => `Ok!`),
  // Match "error" and extract the error message
  Match.tag('error', (event) => `Error: ${event.error.message}`),
  // Match "cancel"
  Match.tag('cancel', () => 'Cancelled'),
  Match.exhaustive
)

console.log(match({ _tag: 'success', data: 'Hello' }))
// Output: "Ok!"

console.log(match({ _tag: 'error', error: new Error('Oops!') }))
// Output: "Error: Oops!"
```

<Aside type="caution" title="Tag Field Naming Convention">
  The `Match.tag` function relies on the convention within the Effect
  ecosystem of naming the tag field as `"_tag"`. Ensure that your
  discriminated unions follow this naming convention for proper
  functionality.
</Aside>

### Built-in Predicates

The `Match` module provides built-in predicates for common types, such as `Match.number`, `Match.string`, and `Match.boolean`. These predicates simplify the process of matching against primitive types.

**Example** (Using Built-in Predicates for Property Keys)

```ts twoslash
import { Match } from 'effect'

const matchPropertyKey = Match.type<PropertyKey>().pipe(
  // Match when the value is a number
  Match.when(Match.number, (n) => `Key is a number: ${n}`),
  // Match when the value is a string
  Match.when(Match.string, (s) => `Key is a string: ${s}`),
  // Match when the value is a symbol
  Match.when(Match.symbol, (s) => `Key is a symbol: ${String(s)}`),
  // Ensure all possible cases are handled
  Match.exhaustive
)

console.log(matchPropertyKey(42))
// Output: "Key is a number: 42"

console.log(matchPropertyKey('username'))
// Output: "Key is a string: username"

console.log(matchPropertyKey(Symbol('id')))
// Output: "Key is a symbol: Symbol(id)"
```

| Predicate                 | Description                                                                   |
| ------------------------- | ----------------------------------------------------------------------------- |
| `Match.string`            | Matches values of type `string`.                                              |
| `Match.nonEmptyString`    | Matches non-empty strings.                                                    |
| `Match.number`            | Matches values of type `number`.                                              |
| `Match.boolean`           | Matches values of type `boolean`.                                             |
| `Match.bigint`            | Matches values of type `bigint`.                                              |
| `Match.symbol`            | Matches values of type `symbol`.                                              |
| `Match.date`              | Matches values that are instances of `Date`.                                  |
| `Match.record`            | Matches objects where keys are `string` or `symbol` and values are `unknown`. |
| `Match.null`              | Matches the value `null`.                                                     |
| `Match.undefined`         | Matches the value `undefined`.                                                |
| `Match.defined`           | Matches any defined (non-null and non-undefined) value.                       |
| `Match.any`               | Matches any value without restrictions.                                       |
| `Match.is(...values)`     | Matches a specific set of literal values (e.g., `Match.is("a", 42, true)`).   |
| `Match.instanceOf(Class)` | Matches instances of a given class.                                           |
