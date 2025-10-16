## Comparing Effect.gen with async/await

If you are familiar with `async`/`await`, you may notice that the flow of writing code is similar.

Let's compare the two approaches:

<Tabs syncKey="promises-vs-generators">

<TabItem label="Using Effect.gen">

```ts twoslash
import { Effect } from 'effect'

const addServiceCharge = (amount: number) => amount + 1

const applyDiscount = (total: number, discountRate: number): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error('Discount rate cannot be zero'))
    : Effect.succeed(total - (total * discountRate) / 100)

const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

const fetchDiscountRate = Effect.promise(() => Promise.resolve(5))

export const program = Effect.gen(function* () {
  const transactionAmount = yield* fetchTransactionAmount
  const discountRate = yield* fetchDiscountRate
  const discountedAmount = yield* applyDiscount(transactionAmount, discountRate)
  const finalAmount = addServiceCharge(discountedAmount)
  return `Final amount to charge: ${finalAmount}`
})
```

</TabItem>

<TabItem label="Using Async / Await">

```ts twoslash
const addServiceCharge = (amount: number) => amount + 1

const applyDiscount = (total: number, discountRate: number): Promise<number> =>
  discountRate === 0
    ? Promise.reject(new Error('Discount rate cannot be zero'))
    : Promise.resolve(total - (total * discountRate) / 100)

const fetchTransactionAmount = Promise.resolve(100)

const fetchDiscountRate = Promise.resolve(5)

export const program = async function () {
  const transactionAmount = await fetchTransactionAmount
  const discountRate = await fetchDiscountRate
  const discountedAmount = await applyDiscount(transactionAmount, discountRate)
  const finalAmount = addServiceCharge(discountedAmount)
  return `Final amount to charge: ${finalAmount}`
}
```

</TabItem>

</Tabs>

It's important to note that although the code appears similar, the two programs are not identical. The purpose of comparing them side by side is just to highlight the resemblance in how they are written.
