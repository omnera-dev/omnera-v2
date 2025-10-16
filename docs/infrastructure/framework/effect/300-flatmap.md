## flatMap

Chains effects to produce new `Effect` instances, useful for combining operations that depend on previous results.

**Syntax**

```ts showLineNumbers=false
const flatMappedEffect = pipe(myEffect, Effect.flatMap(transformation))
// or
const flatMappedEffect = Effect.flatMap(myEffect, transformation)
// or
const flatMappedEffect = myEffect.pipe(Effect.flatMap(transformation))
```

In the code above, `transformation` is the function that takes a value and returns an `Effect`, and `myEffect` is the initial `Effect` being transformed.

Use `Effect.flatMap` when you need to chain multiple effects, ensuring that each
step produces a new `Effect` while flattening any nested effects that may
occur.

It is similar to `flatMap` used with arrays but works
specifically with `Effect` instances, allowing you to avoid deeply nested
effect structures.

<Aside type="note" title="Effects are Immutable">
  It's important to note that effects are immutable, meaning that the
  original effect is not modified. Instead, a new effect is returned with
  the updated value.
</Aside>

**Example** (Applying a Discount)

```ts twoslash
import { pipe, Effect } from 'effect'

// Function to apply a discount safely to a transaction amount
const applyDiscount = (total: number, discountRate: number): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error('Discount rate cannot be zero'))
    : Effect.succeed(total - (total * discountRate) / 100)

// Simulated asynchronous task to fetch a transaction amount from database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

// Chaining the fetch and discount application using `flatMap`
const finalAmount = pipe(
  fetchTransactionAmount,
  Effect.flatMap((amount) => applyDiscount(amount, 5))
)

Effect.runPromise(finalAmount).then(console.log)
// Output: 95
```

### Ensure All Effects Are Considered

Make sure that all effects within `Effect.flatMap` contribute to the final computation. If you ignore an effect, it can lead to unexpected behavior:

```ts {3} showLineNumbers=false
Effect.flatMap((amount) => {
  // This effect will be ignored
  Effect.sync(() => console.log(`Apply a discount to: ${amount}`))
  return applyDiscount(amount, 5)
})
```

In this case, the `Effect.sync` call is ignored and does not affect the result of `applyDiscount(amount, 5)`. To handle effects correctly, make sure to explicitly chain them using functions like `Effect.map`, `Effect.flatMap`, `Effect.andThen`, or `Effect.tap`.
