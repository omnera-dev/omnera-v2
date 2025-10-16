## Filtering the Success Channel

The Effect library provides several operators to filter values on the success channel based on a given predicate.

These operators offer different strategies for handling cases where the predicate fails:

| API                                  | Description                                                                                                                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filterOrFail`                       | This operator filters the values on the success channel based on a predicate. If the predicate fails for any value, the original effect fails with an error.                                                                                      |
| `filterOrDie` / `filterOrDieMessage` | These operators also filter the values on the success channel based on a predicate. If the predicate fails for any value, the original effect terminates abruptly. The `filterOrDieMessage` variant allows you to provide a custom error message. |
| `filterOrElse`                       | This operator filters the values on the success channel based on a predicate. If the predicate fails for any value, an alternative effect is executed instead.                                                                                    |

**Example** (Filtering Success Values)

```ts twoslash
import { Effect, Random, Cause } from 'effect'

// Fail with a custom error if predicate is false
const task1 = Effect.filterOrFail(
  Random.nextRange(-1, 1),
  (n) => n >= 0,
  () => 'random number is negative'
)

// Die with a custom exception if predicate is false
const task2 = Effect.filterOrDie(
  Random.nextRange(-1, 1),
  (n) => n >= 0,
  () => new Cause.IllegalArgumentException('random number is negative')
)

// Die with a custom error message if predicate is false
const task3 = Effect.filterOrDieMessage(
  Random.nextRange(-1, 1),
  (n) => n >= 0,
  'random number is negative'
)

// Run an alternative effect if predicate is false
const task4 = Effect.filterOrElse(
  Random.nextRange(-1, 1),
  (n) => n >= 0,
  () => task3
)
```

It's important to note that depending on the specific filtering operator used, the effect can either fail, terminate abruptly, or execute an alternative effect when the predicate fails. Choose the appropriate operator based on your desired error handling strategy and program logic.

The filtering APIs can also be combined with [user-defined type guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) to improve type safety and code clarity. This ensures that only valid types pass through.

**Example** (Using a Type Guard)

```ts twoslash {15}
import { Effect, pipe } from 'effect'

// Define a user interface
interface User {
  readonly name: string
}

// Simulate an asynchronous authentication function
declare const auth: () => Promise<User | null>

const program = pipe(
  Effect.promise(() => auth()),
  // Use filterOrFail with a custom type guard to ensure user is not null
  Effect.filterOrFail(
    (user): user is User => user !== null, // Type guard
    () => new Error('Unauthorized')
  ),
  // 'user' now has the type `User` (not `User | null`)
  Effect.andThen((user) => user.name)
)
```

In the example above, a guard is used within the `filterOrFail` API to ensure that the `user` is of type `User` rather than `User | null`.

If you prefer, you can utilize a pre-made guard like [Predicate.isNotNull](https://effect-ts.github.io/effect/effect/Predicate.ts.html#isnotnull) for simplicity and consistency.
