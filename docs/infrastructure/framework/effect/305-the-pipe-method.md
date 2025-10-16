## The pipe method

Effect provides a `pipe` method that works similarly to the `pipe` method found in [rxjs](https://rxjs.dev/api/index/function/pipe). This method allows you to chain multiple operations together, making your code more concise and readable.

**Syntax**

```ts showLineNumbers=false
const result = effect.pipe(func1, func2, ..., funcN)
```

This is equivalent to using the `pipe` **function** like this:

```ts showLineNumbers=false
const result = pipe(effect, func1, func2, ..., funcN)
```

The `pipe` method is available on all effects and many other data types, eliminating the need to import the `pipe` function and saving you some keystrokes.

**Example** (Using the `pipe` Method)

Let's rewrite an [earlier example](#build-your-first-pipeline), this time using the `pipe` method.

```ts twoslash collapse={3-15}
import { Effect } from 'effect'

const addServiceCharge = (amount: number) => amount + 1

const applyDiscount = (total: number, discountRate: number): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error('Discount rate cannot be zero'))
    : Effect.succeed(total - (total * discountRate) / 100)

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

const fetchDiscountRate = Effect.promise(() => Promise.resolve(5))

const program = Effect.all([fetchTransactionAmount, fetchDiscountRate]).pipe(
  Effect.andThen(([transactionAmount, discountRate]) =>
    applyDiscount(transactionAmount, discountRate)
  ),
  Effect.andThen(addServiceCharge),
  Effect.andThen((finalAmount) => `Final amount to charge: ${finalAmount}`)
)
```
