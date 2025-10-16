## Operators On PubSubs

### publishAll

The `PubSub.publishAll` function lets you publish multiple values to the pubsub at once.

**Example** (Publishing Multiple Messages)

```ts twoslash
import { Effect, PubSub, Queue } from "effect"

const program = Effect.scoped(
  Effect.gen(function* () {
    const pubsub = yield* PubSub.bounded<string>(2)
    const dequeue = yield* PubSub.subscribe(pubsub)
    yield* PubSub.publishAll(pubsub, ["Message 1", "Message 2"])
    console.log(yield* Queue.takeAll(dequeue))
  })
)

Effect.runFork(program)
/*
Output:
{ _id: 'Chunk', values: [ 'Message 1', 'Message 2' ] }
*/
```

### capacity / size

You can check the capacity and current size of a pubsub using `PubSub.capacity` and `PubSub.size`, respectively.

Note that `PubSub.capacity` returns a `number` because the capacity is set at pubsub creation and never changes.
In contrast, `PubSub.size` returns an effect that determines the current size of the pubsub since the number of messages in the pubsub can change over time.

**Example** (Retrieving PubSub Capacity and Size)

```ts twoslash
import { Effect, PubSub } from "effect"

const program = Effect.gen(function* () {
  const pubsub = yield* PubSub.bounded<number>(2)
  console.log(`capacity: ${PubSub.capacity(pubsub)}`)
  console.log(`size: ${yield* PubSub.size(pubsub)}`)
})

Effect.runFork(program)
/*
Output:
capacity: 2
size: 0
*/
```

### Shutting Down a PubSub

To shut down a pubsub, use `PubSub.shutdown`. You can also verify if it has been shut down with `PubSub.isShutdown`, or wait for the shutdown to complete with `PubSub.awaitShutdown`. Shutting down a pubsub also terminates all associated queues, ensuring that the shutdown signal is effectively communicated.
