## Adding Items to a Queue

### offer

Use `Queue.offer` to add values to the queue.

**Example** (Adding a Single Item)

```ts twoslash
import { Effect, Queue } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)
  // Adds 1 to the queue
  yield* Queue.offer(queue, 1)
})
```

When using a back-pressured queue, `Queue.offer` suspends if the queue is full. To avoid blocking the main fiber, you can fork the `Queue.offer` operation.

**Example** (Handling a Full Queue with `Effect.fork`)

```ts twoslash
import { Effect, Queue, Fiber } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(1)
  // Fill the queue with one item
  yield* Queue.offer(queue, 1)
  // Attempting to add a second item will suspend as the queue is full
  const fiber = yield* Effect.fork(Queue.offer(queue, 2))
  // Empties the queue to make space
  yield* Queue.take(queue)
  // Joins the fiber, completing the suspended offer
  yield* Fiber.join(fiber)
  // Returns the size of the queue after additions
  return yield* Queue.size(queue)
})

Effect.runPromise(program).then(console.log)
// Output: 1
```

### offerAll

You can also add multiple items at once using `Queue.offerAll`.

**Example** (Adding Multiple Items)

```ts twoslash
import { Effect, Queue, Array } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)
  const items = Array.range(1, 10)
  // Adds all items to the queue at once
  yield* Queue.offerAll(queue, items)
  // Returns the size of the queue after additions
  return yield* Queue.size(queue)
})

Effect.runPromise(program).then(console.log)
// Output: 10
```
