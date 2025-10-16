## Fallback

### orElse

When a computation returns `None`, you might want to try an alternative computation that yields an `Option`. The `Option.orElse` function is helpful in such cases. It lets you chain multiple computations, moving on to the next if the current one results in `None`. This approach is often used in retry logic, attempting computations until one succeeds or all possibilities are exhausted.

**Example** (Attempting Alternative Computations)

```ts twoslash
import { Option } from "effect"

// Simulating a computation that may or may not produce a result
const computation = (): Option.Option<number> =>
  Math.random() < 0.5 ? Option.some(10) : Option.none()

// Simulates an alternative computation
const alternativeComputation = (): Option.Option<number> =>
  Math.random() < 0.5 ? Option.some(20) : Option.none()

// Attempt the first computation, then try an alternative if needed
const program = computation().pipe(
  Option.orElse(() => alternativeComputation())
)

const result = Option.match(program, {
  onNone: () => "Both computations resulted in None",
  // At least one computation succeeded
  onSome: (value) => `Computed value: ${value}`
})

console.log(result)
// Output: Computed value: 10
```

### firstSomeOf

You can also use `Option.firstSomeOf` to get the first `Some` value from an iterable of `Option` values:

**Example** (Retrieving the First `Some` Value)

```ts twoslash
import { Option } from "effect"

const first = Option.firstSomeOf([
  Option.none(),
  Option.some(2),
  Option.none(),
  Option.some(3)
])

console.log(first)
// Output: { _id: 'Option', _tag: 'Some', value: 2 }
```
