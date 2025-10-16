## Joining Fibers

One common operation with fibers is **joining** them. By using the `Fiber.join` function, you can wait for a fiber to complete and retrieve its result. The joined fiber will either succeed or fail, and the `Effect` returned by `join` reflects the outcome of the fiber.

**Example** (Joining a Fiber)

```ts twoslash
import { Effect, Fiber } from 'effect'

const fib = (n: number): Effect.Effect<number> =>
  n < 2 ? Effect.succeed(n) : Effect.zipWith(fib(n - 1), fib(n - 2), (a, b) => a + b)

//      ┌─── Effect<RuntimeFiber<number, never>, never, never>
//      ▼
const fib10Fiber = Effect.fork(fib(10))

const program = Effect.gen(function* () {
  // Retrieve the fiber
  const fiber = yield* fib10Fiber
  // Join the fiber and get the result
  const n = yield* Fiber.join(fiber)
  console.log(n)
})

Effect.runFork(program) // Output: 55
```
