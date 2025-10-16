## Completing the match

### exhaustive

The `Match.exhaustive` method finalizes the pattern matching process by ensuring that all possible cases are accounted for. If any case is missing, TypeScript will produce a type error. This is particularly useful when working with unions, as it helps prevent unintended gaps in pattern matching.

**Example** (Ensuring All Cases Are Covered)

```ts twoslash
import { Match } from 'effect'

// Create a matcher for string or number values
const match = Match.type<string | number>().pipe(
  // Match when the value is a number
  Match.when(Match.number, (n) => `number: ${n}`),
  // Mark the match as exhaustive, ensuring all cases are handled
  // TypeScript will throw an error if any case is missing
  // @errors: 2345
  Match.exhaustive
)
```

### orElse

The `Match.orElse` method defines a fallback value to return when no other patterns match. This ensures that the matcher always produces a valid result.

**Example** (Providing a Default Value When No Patterns Match)

```ts twoslash
import { Match } from 'effect'

// Create a matcher for string or number values
const match = Match.type<string | number>().pipe(
  // Match when the value is "a"
  Match.when('a', () => 'ok'),
  // Fallback when no patterns match
  Match.orElse(() => 'fallback')
)

console.log(match('a'))
// Output: "ok"

console.log(match('b'))
// Output: "fallback"
```

### option

`Match.option` wraps the match result in an [Option](/docs/data-types/option/). If a match is found, it returns `Some(value)`, otherwise, it returns `None`.

**Example** (Extracting a User Role with Option)

```ts twoslash
import { Match } from 'effect'

type User = { readonly role: 'admin' | 'editor' | 'viewer' }

// Create a matcher to extract user roles
const getRole = Match.type<User>().pipe(
  Match.when({ role: 'admin' }, () => 'Has full access'),
  Match.when({ role: 'editor' }, () => 'Can edit content'),
  Match.option // Wrap the result in an Option
)

console.log(getRole({ role: 'admin' }))
// Output: { _id: 'Option', _tag: 'Some', value: 'Has full access' }

console.log(getRole({ role: 'viewer' }))
// Output: { _id: 'Option', _tag: 'None' }
```

### either

The `Match.either` method wraps the result in an [Either](/docs/data-types/either/), providing a structured way to distinguish between matched and unmatched cases. If a match is found, it returns `Right(value)`, otherwise, it returns `Left(no match)`.

**Example** (Extracting a User Role with Either)

```ts twoslash
import { Match } from 'effect'

type User = { readonly role: 'admin' | 'editor' | 'viewer' }

// Create a matcher to extract user roles
const getRole = Match.type<User>().pipe(
  Match.when({ role: 'admin' }, () => 'Has full access'),
  Match.when({ role: 'editor' }, () => 'Can edit content'),
  Match.either // Wrap the result in an Either
)

console.log(getRole({ role: 'admin' }))
// Output: { _id: 'Either', _tag: 'Right', right: 'Has full access' }

console.log(getRole({ role: 'viewer' }))
// Output: { _id: 'Either', _tag: 'Left', left: { role: 'viewer' } }
```

# [Basic Concurrency](https://effect.website/docs/concurrency/basic-concurrency/)
