## Basic Operations

A `Queue<A>` stores values of type `A` and provides two fundamental operations:

| API           | Description                                          |
| ------------- | ---------------------------------------------------- |
| `Queue.offer` | Adds a value of type `A` to the queue.               |
| `Queue.take`  | Removes and returns the oldest value from the queue. |

**Example** (Adding and Retrieving an Item)

```ts twoslash
import { Effect, Queue } from "effect"

const program = Effect.gen(function* () {
  // Creates a bounded queue with capacity 100
  const queue = yield* Queue.bounded<number>(100)
  // Adds 1 to the queue
  yield* Queue.offer(queue, 1)
  // Retrieves and removes the oldest value
  const value = yield* Queue.take(queue)
  return value
})

Effect.runPromise(program).then(console.log)
// Output: 1
```
