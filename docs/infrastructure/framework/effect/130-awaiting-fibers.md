## Awaiting Fibers

The `Fiber.await` function is a helpful tool when working with fibers. It allows you to wait for a fiber to complete and retrieve detailed information about how it finished. The result is encapsulated in an [Exit](/docs/data-types/exit/) value, which gives you insight into whether the fiber succeeded, failed, or was interrupted.

**Example** (Awaiting Fiber Completion)

```ts twoslash
import { Effect, Fiber } from "effect"

const fib = (n: number): Effect.Effect<number> =>
  n < 2
    ? Effect.succeed(n)
    : Effect.zipWith(fib(n - 1), fib(n - 2), (a, b) => a + b)

//      ┌─── Effect<RuntimeFiber<number, never>, never, never>
//      ▼
const fib10Fiber = Effect.fork(fib(10))

const program = Effect.gen(function* () {
  // Retrieve the fiber
  const fiber = yield* fib10Fiber
  // Await its completion and get the Exit result
  const exit = yield* Fiber.await(fiber)
  console.log(exit)
})

Effect.runFork(program)
/*
Output:
{ _id: 'Exit', _tag: 'Success', value: 55 }
*/
```
