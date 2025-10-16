## Offer-only / Take-only Queues

Sometimes, you might want certain parts of your code to only add values to a queue (`Enqueue`) or only retrieve values from a queue (`Dequeue`). Effect provides interfaces to enforce these specific capabilities.

### Enqueue

All methods for adding values to a queue are defined by the `Enqueue` interface. This restricts the queue to only offer operations.

**Example** (Restricting Queue to Offer-only Operations)

```ts twoslash
import { Queue } from "effect"

const send = (offerOnlyQueue: Queue.Enqueue<number>, value: number) => {
  // This queue is restricted to offer operations only

  // Error: cannot use take on an offer-only queue
// @errors: 2345
  Queue.take(offerOnlyQueue)

  // Valid offer operation
  return Queue.offer(offerOnlyQueue, value)
}
```

### Dequeue

Similarly, all methods for retrieving values from a queue are defined by the `Dequeue` interface, which restricts the queue to only take operations.

**Example** (Restricting Queue to Take-only Operations)

```ts twoslash
import { Queue } from "effect"

const receive = (takeOnlyQueue: Queue.Dequeue<number>) => {
  // This queue is restricted to take operations only

  // Error: cannot use offer on a take-only queue
// @errors: 2345
  Queue.offer(takeOnlyQueue, 1)

  // Valid take operation
  return Queue.take(takeOnlyQueue)
}
```

The `Queue` type combines both `Enqueue` and `Dequeue`, so you can easily pass it to different parts of your code, enforcing only `Enqueue` or `Dequeue` behaviors as needed.

**Example** (Using Offer-only and Take-only Queues Together)

```ts twoslash
import { Effect, Queue } from "effect"

const send = (offerOnlyQueue: Queue.Enqueue<number>, value: number) => {
  return Queue.offer(offerOnlyQueue, value)
}

const receive = (takeOnlyQueue: Queue.Dequeue<number>) => {
  return Queue.take(takeOnlyQueue)
}

const program = Effect.gen(function* () {
  const queue = yield* Queue.unbounded<number>()

  // Add values to the queue
  yield* send(queue, 1)
  yield* send(queue, 2)

  // Retrieve values from the queue
  console.log(yield* receive(queue))
  console.log(yield* receive(queue))
})

Effect.runFork(program)
/*
Output:
1
2
*/
```

# [Semaphore](https://effect.website/docs/concurrency/semaphore/)
