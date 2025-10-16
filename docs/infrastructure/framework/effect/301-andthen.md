## andThen

Chains two actions, where the second action can depend on the result of the first.

**Syntax**

```ts showLineNumbers=false
const transformedEffect = pipe(myEffect, Effect.andThen(anotherEffect))
// or
const transformedEffect = Effect.andThen(myEffect, anotherEffect)
// or
const transformedEffect = myEffect.pipe(Effect.andThen(anotherEffect))
```

Use `andThen` when you need to run multiple actions in sequence, with the
second action depending on the result of the first. This is useful for
combining effects or handling computations that must happen in order.

The second action can be:

1. A value (similar to `Effect.as`)
2. A function returning a value (similar to `Effect.map`)
3. A `Promise`
4. A function returning a `Promise`
5. An `Effect`
6. A function returning an `Effect` (similar to `Effect.flatMap`)

**Example** (Applying a Discount Based on Fetched Amount)

Let's look at an example comparing `Effect.andThen` with `Effect.map` and `Effect.flatMap`:

```ts twoslash
import { pipe, Effect } from "effect"

// Function to apply a discount safely to a transaction amount
const applyDiscount = (
  total: number,
  discountRate: number
): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error("Discount rate cannot be zero"))
    : Effect.succeed(total - (total * discountRate) / 100)

// Simulated asynchronous task to fetch a transaction amount from database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100))

// Using Effect.map and Effect.flatMap
const result1 = pipe(
  fetchTransactionAmount,
  Effect.map((amount) => amount * 2),
  Effect.flatMap((amount) => applyDiscount(amount, 5))
)

Effect.runPromise(result1).then(console.log) // Output: 190

// Using Effect.andThen
const result2 = pipe(
  fetchTransactionAmount,
  Effect.andThen((amount) => amount * 2),
  Effect.andThen((amount) => applyDiscount(amount, 5))
)

Effect.runPromise(result2).then(console.log) // Output: 190
```

### Option and Either with andThen

Both [Option](/docs/data-types/option/#interop-with-effect) and [Either](/docs/data-types/either/#interop-with-effect) are commonly used for handling optional or missing values or simple error cases. These types integrate well with `Effect.andThen`. When used with `Effect.andThen`, the operations are categorized as scenarios 5 and 6 (as discussed earlier) because both `Option` and `Either` are treated as effects in this context.

**Example** (with Option)

```ts twoslash
import { pipe, Effect, Option } from "effect"

// Simulated asynchronous task fetching a number from a database
const fetchNumberValue = Effect.tryPromise(() => Promise.resolve(42))

//      ┌─── Effect<number, UnknownException | NoSuchElementException, never>
//      ▼
const program = pipe(
  fetchNumberValue,
  Effect.andThen((x) => (x > 0 ? Option.some(x) : Option.none()))
)
```

You might expect the type of `program` to be `Effect<Option<number>, UnknownException, never>`, but it is actually `Effect<number, UnknownException | NoSuchElementException, never>`.

This is because `Option<A>` is treated as an effect of type `Effect<A, NoSuchElementException>`, and as a result, the possible errors are combined into a union type.

<Aside type="tip" title="Option As Effect">
A value of type `Option<A>` is interpreted as an effect of type `Effect<A, NoSuchElementException>`.
</Aside>

**Example** (with Either)

```ts twoslash
import { pipe, Effect, Either } from "effect"

// Function to parse an integer from a string that can fail
const parseInteger = (input: string): Either.Either<number, string> =>
  isNaN(parseInt(input))
    ? Either.left("Invalid integer")
    : Either.right(parseInt(input))

// Simulated asynchronous task fetching a string from database
const fetchStringValue = Effect.tryPromise(() => Promise.resolve("42"))

//      ┌─── Effect<number, string | UnknownException, never>
//      ▼
const program = pipe(
  fetchStringValue,
  Effect.andThen((str) => parseInteger(str))
)
```

Although one might expect the type of `program` to be `Effect<Either<number, string>, UnknownException, never>`, it is actually `Effect<number, string | UnknownException, never>`.

This is because `Either<A, E>` is treated as an effect of type `Effect<A, E>`, meaning the errors are combined into a union type.

<Aside type="tip" title="Either As Effect">
A value of type `Either<A, E>` is interpreted as an effect of type `Effect<A, E>`.
</Aside>
