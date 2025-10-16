## Adapter <Badge text="Deprecated" variant="caution" />

You may still come across some code snippets that use an adapter, typically indicated by `_` or `$` symbols.

In earlier versions of TypeScript, the generator "adapter" function was necessary to ensure correct type inference within generators. This adapter was used to facilitate the interaction between TypeScript's type system and generator functions.

**Example** (Adapter in Older Code)

```ts twoslash "$"
import { Effect } from 'effect'

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

// Older usage with an adapter for proper type inference
const programWithAdapter = Effect.gen(function* ($) {
  const transactionAmount = yield* $(fetchTransactionAmount)
})

// Current usage without an adapter
const program = Effect.gen(function* () {
  const transactionAmount = yield* fetchTransactionAmount
})
```

With advances in TypeScript (v5.5+), the adapter is no longer necessary for type inference. While it remains in the codebase for backward compatibility, it is anticipated to be removed in the upcoming major release of Effect.

# [The Effect Type](https://effect.website/docs/getting-started/the-effect-type/)
