## Using Multiple Services

When we require the usage of more than one service, the process remains similar to what we've learned in defining a service, repeated for each service needed.

**Example** (Using Random and Logger Services)

Let's examine an example where we need two services, namely `Random` and `Logger`:

```ts twoslash
import { Effect, Context } from "effect"

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag("MyRandomService")<
  Random,
  {
    readonly next: Effect.Effect<number>
  }
>() {}

// Declaring a tag for the logging service
class Logger extends Context.Tag("MyLoggerService")<
  Logger,
  {
    readonly log: (message: string) => Effect.Effect<void>
  }
>() {}

const program = Effect.gen(function* () {
  // Acquire instances of the 'Random' and 'Logger' services
  const random = yield* Random
  const logger = yield* Logger

  const randomNumber = yield* random.next

  yield* logger.log(String(randomNumber))
})
```

The `program` effect now has a `Requirements` type parameter of `Random | Logger`:

```ts showLineNumbers=false "Random | Logger"
const program: Effect<void, never, Random | Logger>
```

indicating that it requires both the `Random` and `Logger` services to be provided.

To execute the `program`, we need to provide implementations for both services:

**Example** (Providing Multiple Services)

```ts twoslash collapse={3-24}
import { Effect, Context } from "effect"

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag("MyRandomService")<
  Random,
  {
    readonly next: Effect.Effect<number>
  }
>() {}

// Declaring a tag for the logging service
class Logger extends Context.Tag("MyLoggerService")<
  Logger,
  {
    readonly log: (message: string) => Effect.Effect<void>
  }
>() {}

const program = Effect.gen(function* () {
  const random = yield* Random
  const logger = yield* Logger
  const randomNumber = yield* random.next
  return yield* logger.log(String(randomNumber))
})

// Provide service implementations for 'Random' and 'Logger'
const runnable = program.pipe(
  Effect.provideService(Random, {
    next: Effect.sync(() => Math.random())
  }),
  Effect.provideService(Logger, {
    log: (message) => Effect.sync(() => console.log(message))
  })
)
```

Alternatively, instead of calling `provideService` multiple times, we can combine the service implementations into a single `Context` and then provide the entire context using the `Effect.provide` function:

**Example** (Combining Service Implementations)

```ts twoslash collapse={3-24}
import { Effect, Context } from "effect"

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag("MyRandomService")<
  Random,
  {
    readonly next: Effect.Effect<number>
  }
>() {}

// Declaring a tag for the logging service
class Logger extends Context.Tag("MyLoggerService")<
  Logger,
  {
    readonly log: (message: string) => Effect.Effect<void>
  }
>() {}

const program = Effect.gen(function* () {
  const random = yield* Random
  const logger = yield* Logger
  const randomNumber = yield* random.next
  return yield* logger.log(String(randomNumber))
})

// Combine service implementations into a single 'Context'
const context = Context.empty().pipe(
  Context.add(Random, { next: Effect.sync(() => Math.random()) }),
  Context.add(Logger, {
    log: (message) => Effect.sync(() => console.log(message))
  })
)

// Provide the entire context
const runnable = Effect.provide(program, context)
```
