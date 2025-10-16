## Sharing State Between Fibers

You can use `Ref` to manage shared state between multiple fibers in a concurrent environment.

**Example** (Managing Shared State Across Fibers)

Let's look at an example where we continuously read names from user input until the user enters `"q"` to exit.

First, let's introduce a `readLine` utility to read user input (ensure you have `@types/node` installed):

```ts twoslash
import { Effect } from 'effect'
import * as NodeReadLine from 'node:readline'

// Utility to read user input
const readLine = (message: string): Effect.Effect<string> =>
  Effect.promise(
    () =>
      new Promise((resolve) => {
        const rl = NodeReadLine.createInterface({
          input: process.stdin,
          output: process.stdout,
        })
        rl.question(message, (answer) => {
          rl.close()
          resolve(answer)
        })
      })
  )
```

Next, we implement the main program to collect names:

```ts twoslash collapse={5-18}
import { Effect, Chunk, Ref } from 'effect'
import * as NodeReadLine from 'node:readline'

// Utility to read user input
const readLine = (message: string): Effect.Effect<string> =>
  Effect.promise(
    () =>
      new Promise((resolve) => {
        const rl = NodeReadLine.createInterface({
          input: process.stdin,
          output: process.stdout,
        })
        rl.question(message, (answer) => {
          rl.close()
          resolve(answer)
        })
      })
  )

const getNames = Effect.gen(function* () {
  const ref = yield* Ref.make(Chunk.empty<string>())
  while (true) {
    const name = yield* readLine('Please enter a name or `q` to exit: ')
    if (name === 'q') {
      break
    }
    yield* Ref.update(ref, (state) => Chunk.append(state, name))
  }
  return yield* Ref.get(ref)
})

Effect.runPromise(getNames).then(console.log)
/*
Output:
Please enter a name or `q` to exit: Alice
Please enter a name or `q` to exit: Bob
Please enter a name or `q` to exit: q
{
  _id: "Chunk",
  values: [ "Alice", "Bob" ]
}
*/
```

Now that we have learned how to use the `Ref` data type, we can use it to manage the state concurrently.

For example, assume while we are reading from the console, we have another fiber that is trying to update the state from a different source.

Here, one fiber reads names from user input, while another fiber concurrently adds preset names at regular intervals:

```ts twoslash collapse={5-18}
import { Effect, Chunk, Ref, Fiber } from 'effect'
import * as NodeReadLine from 'node:readline'

// Utility to read user input
const readLine = (message: string): Effect.Effect<string> =>
  Effect.promise(
    () =>
      new Promise((resolve) => {
        const rl = NodeReadLine.createInterface({
          input: process.stdin,
          output: process.stdout,
        })
        rl.question(message, (answer) => {
          rl.close()
          resolve(answer)
        })
      })
  )

const getNames = Effect.gen(function* () {
  const ref = yield* Ref.make(Chunk.empty<string>())

  // Fiber 1: Reading names from user input
  const fiber1 = yield* Effect.fork(
    Effect.gen(function* () {
      while (true) {
        const name = yield* readLine('Please enter a name or `q` to exit: ')
        if (name === 'q') {
          break
        }
        yield* Ref.update(ref, (state) => Chunk.append(state, name))
      }
    })
  )

  // Fiber 2: Updating the state with predefined names
  const fiber2 = yield* Effect.fork(
    Effect.gen(function* () {
      for (const name of ['John', 'Jane', 'Joe', 'Tom']) {
        yield* Ref.update(ref, (state) => Chunk.append(state, name))
        yield* Effect.sleep('1 second')
      }
    })
  )
  yield* Fiber.join(fiber1)
  yield* Fiber.join(fiber2)
  return yield* Ref.get(ref)
})

Effect.runPromise(getNames).then(console.log)
/*
Output:
Please enter a name or `q` to exit: Alice
Please enter a name or `q` to exit: Bob
Please enter a name or `q` to exit: q
{
  _id: "Chunk",
  // Note: the following result may vary
  // depending on the speed of user input
  values: [ 'John', 'Jane', 'Joe', 'Tom', 'Alice', 'Bob' ]
}
*/
```

# [SubscriptionRef](https://effect.website/docs/state-management/subscriptionref/)
