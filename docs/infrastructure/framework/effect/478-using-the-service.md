## Using the Service

Now that we have our service tag defined, let's see how we can use it by building a simple program.

**Example** (Using the Random Service)

<Tabs syncKey="pipe-vs-gen">

<TabItem label="Using Effect.gen">

```ts twoslash
import { Effect, Context } from 'effect'

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag('MyRandomService')<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

// Using the service
//
//      ┌─── Effect<void, never, Random>
//      ▼
const program = Effect.gen(function* () {
  const random = yield* Random
  const randomNumber = yield* random.next
  console.log(`random number: ${randomNumber}`)
})
```

In the code above, we can observe that we are able to yield the `Random` tag as if it were an effect itself.
This allows us to access the `next` operation of the service.

</TabItem>

<TabItem label="Using pipe">

```ts twoslash
import { Effect, Context, Console } from 'effect'

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag('MyRandomService')<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

// Using the service
//
//      ┌─── Effect<void, never, Random>
//      ▼
const program = Random.pipe(
  Effect.andThen((random) => random.next),
  Effect.andThen((randomNumber) => Console.log(`random number: ${randomNumber}`))
)
```

In the code above, we can observe that we are able to flat-map over the `Random` tag as if it were an effect itself.
This allows us to access the `next` operation of the service within the `Effect.andThen` callback.

</TabItem>

</Tabs>

It's worth noting that the type of the `program` variable includes `Random` in the `Requirements` type parameter:

```ts "Random" showLineNumbers=false
const program: Effect<void, never, Random>
```

This indicates that our program requires the `Random` service to be provided in order to execute successfully.

If we attempt to execute the effect without providing the necessary service we will encounter a type-checking error:

**Example** (Type Error Without Service Provision)

```ts twoslash
import { Effect, Context } from 'effect'

// Declaring a tag for a service that generates random numbers
class Random extends Context.Tag('MyRandomService')<
  Random,
  { readonly next: Effect.Effect<number> }
>() {}

// Using the service
const program = Effect.gen(function* () {
  const random = yield* Random
  const randomNumber = yield* random.next
  console.log(`random number: ${randomNumber}`)
})

// @errors: 2379
Effect.runSync(program)
```

To resolve this error and successfully execute the program, we need to provide an actual implementation of the `Random` service.

In the next section, we will explore how to implement and provide the `Random` service to our program, enabling us to run it successfully.
