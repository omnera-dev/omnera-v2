## Interop with Effect

The `Option` type works as a subtype of the `Effect` type, allowing you to use it with functions from the `Effect` module. While these functions are built to handle `Effect` values, they can also manage `Option` values correctly.

### How Option Maps to Effect

| Option Variant | Mapped to Effect                        | Description                        |
| -------------- | --------------------------------------- | ---------------------------------- |
| `None`         | `Effect<never, NoSuchElementException>` | Represents the absence of a value  |
| `Some<A>`      | `Effect<A>`                             | Represents the presence of a value |

**Example** (Combining `Option` with `Effect`)

```ts twoslash
import { Effect, Option } from "effect"

// Function to get the head of an array, returning Option
const head = <A>(array: ReadonlyArray<A>): Option.Option<A> =>
  array.length > 0 ? Option.some(array[0]) : Option.none()

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
