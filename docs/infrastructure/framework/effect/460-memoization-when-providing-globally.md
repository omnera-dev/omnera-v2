## Memoization When Providing Globally

One important feature of an Effect application is that layers are shared by default. This means that if the same layer is used twice, and if we provide the layer globally, the layer will only be allocated a single time. For every layer in our dependency graph, there is only one instance of it that is shared between all the layers that depend on it.

**Example**

For example, assume we have the three services `A`, `B`, and `C`. The implementation of both `B` and `C` is dependent on the `A` service:

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
  Layer.merge(Layer.provide(BLive, ALive), Layer.provide(CLive, ALive))
)

Effect.runPromise(runnable)
/*
Output:
timestamp=... level=INFO fiber=#2 message=initialized
*/
```

Although both `BLive` and `CLive` layers require the `ALive` layer, the `ALive` layer is instantiated only once. It is shared with both `BLive` and `CLive`.
