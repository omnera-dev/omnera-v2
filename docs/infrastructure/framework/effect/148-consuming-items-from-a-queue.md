## Consuming Items from a Queue

### take

The `Queue.take` operation removes and returns the oldest item from the queue. If the queue is empty, `Queue.take` will suspend and only resume when an item is added. To prevent blocking, you can fork the `Queue.take` operation into a new fiber.

**Example** (Waiting for an Item in a Fiber)

```ts twoslash
import { Effect, Queue, Fiber } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<string>(100)
  // This take operation will suspend because the queue is empty
  const fiber = yield* Effect.fork(Queue.take(queue))
  // Adds an item to the queue
  yield* Queue.offer(queue, 'something')
  // Joins the fiber to get the result of the take operation
  const value = yield* Fiber.join(fiber)
  return value
})

Effect.runPromise(program).then(console.log)
// Output: something
```

### poll

To retrieve the queue's first item without suspending, use `Queue.poll`. If the queue is empty, `Queue.poll` returns `None`; if it has an item, it wraps it in `Some`.

**Example** (Polling an Item)

```ts twoslash
import { Effect, Queue } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)
  // Adds items to the queue
  yield* Queue.offer(queue, 10)
  yield* Queue.offer(queue, 20)
  // Retrieves the first item if available
  const head = yield* Queue.poll(queue)
  return head
})

Effect.runPromise(program).then(console.log)
/*
Output:
{
  _id: "Option",
  _tag: "Some",
  value: 10
}
*/
```

### takeUpTo

To retrieve multiple items, use `Queue.takeUpTo`, which returns up to the specified number of items.
If there aren't enough items, it returns all available items without waiting for more.

This function is particularly useful for batch processing when an exact number of items is not required. It ensures the program continues working with whatever data is currently available.

If you need to wait for an exact number of items before proceeding, consider using [takeN](#taken).

**Example** (Taking Up to N Items)

```ts twoslash
import { Effect, Queue } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)

  // Adds items to the queue
  yield* Queue.offer(queue, 1)
  yield* Queue.offer(queue, 2)
  yield* Queue.offer(queue, 3)

  // Retrieves up to 2 items
  const chunk = yield* Queue.takeUpTo(queue, 2)
  console.log(chunk)

  return 'some result'
})

Effect.runPromise(program).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2 ] }
some result
*/
```

### takeN

Takes a specified number of elements from a queue. If the queue does not contain enough elements, the operation suspends until the required number of elements become available.

This function is useful for scenarios where processing requires an exact number of items at a time, ensuring that the operation does not proceed until the batch is complete.

**Example** (Taking a Fixed Number of Items)

```ts twoslash
import { Effect, Queue, Fiber } from 'effect'

const program = Effect.gen(function* () {
  // Create a queue that can hold up to 100 elements
  const queue = yield* Queue.bounded<number>(100)

  // Fork a fiber that attempts to take 3 items from the queue
  const fiber = yield* Effect.fork(
    Effect.gen(function* () {
      console.log('Attempting to take 3 items from the queue...')
      const chunk = yield* Queue.takeN(queue, 3)
      console.log(`Successfully took 3 items: ${chunk}`)
    })
  )

  // Offer only 2 items initially
  yield* Queue.offer(queue, 1)
  yield* Queue.offer(queue, 2)
  console.log('Offered 2 items. The fiber is now waiting for the 3rd item...')

  // Simulate some delay
  yield* Effect.sleep('2 seconds')

  // Offer the 3rd item, which will unblock the takeN call
  yield* Queue.offer(queue, 3)
  console.log('Offered the 3rd item, which should unblock the fiber.')

  // Wait for the fiber to finish
  yield* Fiber.join(fiber)
  return 'some result'
})

Effect.runPromise(program).then(console.log)
/*
Output:
Offered 2 items. The fiber is now waiting for the 3rd item...
Attempting to take 3 items from the queue...
Offered the 3rd item, which should unblock the fiber.
Successfully took 3 items: {
  "_id": "Chunk",
  "values": [
    1,
    2,
    3
  ]
}
some result
*/
```

### takeAll

To retrieve all items from the queue at once, use `Queue.takeAll`. This operation completes immediately, returning an empty collection if the queue is empty.

**Example** (Taking All Items)

```ts twoslash
import { Effect, Queue } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(100)
  // Adds items to the queue
  yield* Queue.offer(queue, 10)
  yield* Queue.offer(queue, 20)
  yield* Queue.offer(queue, 30)
  // Retrieves all items from the queue
  const chunk = yield* Queue.takeAll(queue)
  return chunk
})

Effect.runPromise(program).then(console.log)
/*
Output:
{
  _id: "Chunk",
  values: [ 10, 20, 30 ]
}
*/
```
