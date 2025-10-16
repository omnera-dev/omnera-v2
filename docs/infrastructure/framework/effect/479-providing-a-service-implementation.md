## Providing a Service Implementation

In order to provide an actual implementation of the `Random` service, we can utilize the `Effect.provideService` function.

**Example** (Providing a Random Number Implementation)

```ts twoslash
import { Effect, Context } from "effect"

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag("MyRandomService")<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

// Using the service
const program = Effect.gen(function* () {
  const random = yield* Random
  const randomNumber = yield* random.next
  console.log(`random number: ${randomNumber}`)
})

// Providing the implementation
//
//      ┌─── Effect<void, never, never>
//      ▼
const runnable = Effect.provideService(program, Random, {
  next: Effect.sync(() => Math.random())
})

// Run successfully
Effect.runPromise(runnable)
/*
Example Output:
random number: 0.8241872233134417
*/
```

In the code above, we provide the `program` we defined earlier with an implementation of the `Random` service.

We use the `Effect.provideService` function to associate the `Random` tag with its implementation, an object with a `next` operation that generates a random number.

Notice that the `Requirements` type parameter of the `runnable` effect is now `never`. This indicates that the effect no longer requires any service to be provided.

With the implementation of the `Random` service in place, we are able to run the program without any further requirements.
