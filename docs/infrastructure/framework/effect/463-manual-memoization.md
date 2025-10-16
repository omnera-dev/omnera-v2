## Manual Memoization

We can memoize a layer manually using the `Layer.memoize` function.
It will return a scoped effect that, if evaluated, will return the lazily computed result of this layer.

**Example**

```ts twoslash
import { Effect, Context, Layer } from "effect"

class A extends Context.Tag("A")<A, { readonly a: number }>() {}

const ALive = Layer.effect(
  A,
  Effect.succeed({ a: 5 }).pipe(
    Effect.tap(() => Effect.log("initialized"))
  )
)

const program = Effect.scoped(
  Layer.memoize(ALive).pipe(
    Effect.andThen((memoized) =>
      Effect.gen(function* () {
        yield* Effect.provide(A, memoized)
        yield* Effect.provide(A, memoized)
      })
    )
  )
)

Effect.runPromise(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message=initialized
*/
```

# [Managing Layers](https://effect.website/docs/requirements-management/layers/)
