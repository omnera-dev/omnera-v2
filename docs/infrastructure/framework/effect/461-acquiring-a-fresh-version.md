## Acquiring a Fresh Version

If we don't want to share a module, we should create a fresh, non-shared version of it through `Layer.fresh`.

**Example**

```ts twoslash
import { Effect, Context, Layer } from 'effect'

class A extends Context.Tag('A')<A, { readonly a: number }>() {}

class B extends Context.Tag('B')<B, { readonly b: string }>() {}

class C extends Context.Tag('C')<C, { readonly c: boolean }>() {}

const ALive = Layer.effect(
  A,
  Effect.succeed({ a: 5 }).pipe(Effect.tap(() => Effect.log('initialized')))
)

const BLive = Layer.effect(
  B,
  Effect.gen(function* () {
    const { a } = yield* A
    return { b: String(a) }
  })
)

const CLive = Layer.effect(
  C,
  Effect.gen(function* () {
    const { a } = yield* A
    return { c: a > 0 }
  })
)

const program = Effect.gen(function* () {
  yield* B
  yield* C
})

const runnable = Effect.provide(
  program,
  Layer.merge(Layer.provide(BLive, Layer.fresh(ALive)), Layer.provide(CLive, Layer.fresh(ALive)))
)

Effect.runPromise(runnable)
/*
Output:
timestamp=... level=INFO fiber=#2 message=initialized
timestamp=... level=INFO fiber=#3 message=initialized
*/
```
