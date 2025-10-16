## Requirements Management

To access a service while using `Micro.gen`, you need to wrap the service tag using the `Micro.service` function:

**Example** (Accessing a Service in `Micro.gen`)

```ts twoslash
import { Micro, Context } from "effect"

class Random extends Context.Tag("MyRandomService")<
  Random,
  { readonly next: Micro.Micro<number> }
>() {}

const program = Micro.gen(function* () {
  // const random = yield* Random // this doesn't work
  const random = yield* Micro.service(Random)
  const randomNumber = yield* random.next
  console.log(`random number: ${randomNumber}`)
})

const runnable = Micro.provideService(program, Random, {
  next: Micro.sync(() => Math.random())
})

Micro.runPromise(runnable)
/*
Example Output:
random number: 0.8241872233134417
*/
```
