## Composing Fibers

The `Fiber.zip` and `Fiber.zipWith` functions allow you to combine two fibers into one. The resulting fiber will produce the results of both input fibers. If either fiber fails, the combined fiber will also fail.

**Example** (Combining Fibers with `Fiber.zip`)

In this example, both fibers run concurrently, and the results are combined into a tuple.

```ts twoslash
import { Effect, Fiber } from "effect"

const program = Effect.gen(function* () {
  // Fork two fibers that each produce a string
  const fiber1 = yield* Effect.fork(Effect.succeed("Hi!"))
  const fiber2 = yield* Effect.fork(Effect.succeed("Bye!"))

  // Combine the two fibers using Fiber.zip
  const fiber = Fiber.zip(fiber1, fiber2)

  // Join the combined fiber and get the result as a tuple
  const tuple = yield* Fiber.join(fiber)
  console.log(tuple)
})

Effect.runFork(program)
/*
Output:
[ 'Hi!', 'Bye!' ]
*/
```

Another way to compose fibers is by using `Fiber.orElse`. This function allows you to provide an alternative fiber that will execute if the first one fails. If the first fiber succeeds, its result will be returned. If it fails, the second fiber will run instead, and its result will be returned regardless of its outcome.

**Example** (Providing a Fallback Fiber with `Fiber.orElse`)

```ts twoslash
import { Effect, Fiber } from "effect"

const program = Effect.gen(function* () {
  // Fork a fiber that will fail
  const fiber1 = yield* Effect.fork(Effect.fail("Uh oh!"))
  // Fork another fiber that will succeed
  const fiber2 = yield* Effect.fork(Effect.succeed("Hurray!"))
  // If fiber1 fails, fiber2 will be used as a fallback
  const fiber = Fiber.orElse(fiber1, fiber2)
  const message = yield* Fiber.join(fiber)
  console.log(message)
})

Effect.runFork(program)
/*
Output:
Hurray!
*/
```
