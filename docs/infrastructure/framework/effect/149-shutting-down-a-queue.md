## Shutting Down a Queue

### shutdown

The `Queue.shutdown` operation allows you to interrupt all fibers that are currently suspended on `offer*` or `take*` operations. This action also empties the queue and makes any future `offer*` and `take*` calls terminate immediately.

**Example** (Interrupting Fibers on Queue Shutdown)

```ts twoslash
import { Effect, Queue, Fiber } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(3)
  // Forks a fiber that waits to take an item from the queue
  const fiber = yield* Effect.fork(Queue.take(queue))
  // Shuts down the queue, interrupting the fiber
  yield* Queue.shutdown(queue)
  // Joins the interrupted fiber
  yield* Fiber.join(fiber)
})
```

### awaitShutdown

The `Queue.awaitShutdown` operation can be used to run an effect when the queue shuts down. It waits until the queue is closed and resumes immediately if the queue is already shut down.

**Example** (Waiting for Queue Shutdown)

```ts twoslash
import { Effect, Queue, Fiber, Console } from 'effect'

const program = Effect.gen(function* () {
  const queue = yield* Queue.bounded<number>(3)
  // Forks a fiber to await queue shutdown and log a message
  const fiber = yield* Effect.fork(
    Queue.awaitShutdown(queue).pipe(Effect.andThen(Console.log('shutting down')))
  )
  // Shuts down the queue, triggering the await in the fiber
  yield* Queue.shutdown(queue)
  yield* Fiber.join(fiber)
})

Effect.runPromise(program)
// Output: shutting down
```
