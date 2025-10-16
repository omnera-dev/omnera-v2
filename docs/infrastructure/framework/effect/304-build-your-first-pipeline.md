## Build your first pipeline

Let's now combine the `pipe` function, `Effect.all`, and `Effect.andThen` to create a pipeline that performs a sequence of transformations.

**Example** (Building a Transaction Pipeline)

```ts twoslash
import { Effect, pipe } from 'effect'

// Function to add a small service charge to a transaction amount
const addServiceCharge = (amount: number) => amount + 1

// Function to apply a discount safely to a transaction amount
const applyDiscount = (total: number, discountRate: number): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error('Discount rate cannot be zero'))
    : Effect.succeed(total - (total * discountRate) / 100)

// Simulated asynchronous task to fetch a transaction amount from database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

// Simulated asynchronous task to fetch a discount rate
// from a configuration file
const fetchDiscountRate = Effect.promise(() => Promise.resolve(5))

// Assembling the program using a pipeline of effects
const program = pipe(
  // Combine both fetch effects to get the transaction amount
  // and discount rate
  Effect.all([fetchTransactionAmount, fetchDiscountRate]),

  // Apply the discount to the transaction amount
  Effect.andThen(([transactionAmount, discountRate]) =>
    applyDiscount(transactionAmount, discountRate)
  ),

  // Add the service charge to the discounted amount
  Effect.andThen(addServiceCharge),

  // Format the final result for display
  Effect.andThen((finalAmount) => `Final amount to charge: ${finalAmount}`)
)

// Execute the program and log the result
Effect.runPromise(program).then(console.log)
// Output: "Final amount to charge: 96"
```

This pipeline demonstrates how you can structure your code by combining different effects into a clear, readable flow.
