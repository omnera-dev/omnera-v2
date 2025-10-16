## Interop with Effect

The `Either` type works as a subtype of the `Effect` type, allowing you to use it with functions from the `Effect` module. While these functions are built to handle `Effect` values, they can also manage `Either` values correctly.

### How Either Maps to Effect

| Either Variant | Mapped to Effect   | Description          |
| -------------- | ------------------ | -------------------- |
| `Left<L>`      | `Effect<never, L>` | Represents a failure |
| `Right<R>`     | `Effect<R>`        | Represents a success |

**Example** (Combining `Either` with `Effect`)

```ts twoslash
import { Effect, Either } from "effect"

// Function to get the head of an array, returning Either
const head = <A>(array: ReadonlyArray<A>): Either.Either<A, string> =>
  array.length > 0 ? Either.right(array[0]) : Either.left("empty array")

// Simulated fetch function that returns Effect
const fetchData = (): Effect.Effect<string, string> => {
  const success = Math.random() > 0.5
  return success
    ? Effect.succeed("some data")
    : Effect.fail("Failed to fetch data")
}

// Mixing Either and Effect
const program = Effect.all([head([1, 2, 3]), fetchData()])

Effect.runPromise(program).then(console.log)
/*
Example Output:
[ 1, 'some data' ]
*/
```
