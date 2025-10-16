## Forking Effects

You can create a new fiber by **forking** an effect. This starts the effect in a new fiber, and you receive a reference to that fiber.

**Example** (Forking a Fiber)

In this example, the Fibonacci calculation is forked into its own fiber, allowing it to run independently of the main fiber. The reference to the `fib10Fiber` can be used later to join or interrupt the fiber.

```ts twoslash
import { Effect } from "effect"

const fib = (n: number): Effect.Effect<number> =>
  n < 2
    ? Effect.succeed(n)
    : Effect.zipWith(fib(n - 1), fib(n - 2), (a, b) => a + b)

//      ┌─── Effect<RuntimeFiber<number, never>, never, never>
//      ▼
const fib10Fiber = Effect.fork(fib(10))
```
