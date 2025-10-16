## Extracting Inferred Types

By using the utility types `Effect.Success`, `Effect.Error`, and `Effect.Context`, you can extract the corresponding types from an effect.

**Example** (Extracting Success, Error, and Context Types)

```ts twoslash
import { Effect, Context } from "effect"

class SomeContext extends Context.Tag("SomeContext")<SomeContext, {}>() {}

// Assume we have an effect that succeeds with a number,
// fails with an Error, and requires SomeContext
declare const program: Effect.Effect<number, Error, SomeContext>

// Extract the success type, which is number
type A = Effect.Effect.Success<typeof program>

// Extract the error type, which is Error
type E = Effect.Effect.Error<typeof program>

// Extract the context type, which is SomeContext
type R = Effect.Effect.Context<typeof program>
```

# [Why Effect?](https://effect.website/docs/getting-started/why-effect/)
