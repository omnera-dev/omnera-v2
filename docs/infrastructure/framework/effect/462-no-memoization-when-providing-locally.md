## No Memoization When Providing Locally

If we don't provide a layer globally but instead provide them locally, that layer doesn't support memoization by default.

**Example**

In the following example, we provided the `ALive` layer two times locally, and Effect doesn't memoize the construction of the `ALive` layer.
So, it will be initialized two times:

```ts twoslash
import { Effect, Context, Layer } from 'effect'

class A extends Context.Tag('A')<A, { readonly a: number }>() {}

const Alive = Layer.effect(
  A,
  Effect.succeed({ a: 5 }).pipe(Effect.tap(() => Effect.log('initialized')))
)

const program = Effect.gen(function* () {
  yield* Effect.provide(A, Alive)
  yield* Effect.provide(A, Alive)
})

Effect.runPromise(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message=initialized
timestamp=... level=INFO fiber=#0 message=initialized
*/
```
