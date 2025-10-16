## What is a Stream?

Think of a `Stream` as an extension of an `Effect`. While an `Effect<A, E, R>` represents a program that requires a context of type `R`, may encounter an error of type `E`, and always produces a single result of type `A`, a `Stream<A, E, R>` takes this further by allowing the emission of zero or more values of type `A`.

To clarify, let's examine some examples using `Effect`:

```ts twoslash
import { Effect, Chunk, Option } from "effect"

// An Effect that fails with a string error
const failedEffect = Effect.fail("fail!")

// An Effect that produces a single number
const oneNumberValue = Effect.succeed(3)

// An Effect that produces a chunk of numbers
const oneListValue = Effect.succeed(Chunk.make(1, 2, 3))

// An Effect that produces an optional number
const oneOption = Effect.succeed(Option.some(1))
```

In each case, the `Effect` always ends with **exactly one value**. There is no variability; you always get one result.
