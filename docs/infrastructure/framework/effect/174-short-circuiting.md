## Short-Circuiting

When working with APIs like [Effect.gen](/docs/getting-started/using-generators/#understanding-effectgen), [Effect.map](/docs/getting-started/building-pipelines/#map), [Effect.flatMap](/docs/getting-started/building-pipelines/#flatmap), and [Effect.andThen](/docs/getting-started/building-pipelines/#andthen), it's important to understand how they handle errors.
These APIs are designed to **short-circuit the execution** upon encountering the **first error**.

What does this mean for you as a developer? Well, let's say you have a chain of operations or a collection of effects to be executed in sequence. If any error occurs during the execution of one of these effects, the remaining computations will be skipped, and the error will be propagated to the final result.

In simpler terms, the short-circuiting behavior ensures that if something goes wrong at any step of your program, it won't waste time executing unnecessary computations. Instead, it will immediately stop and return the error to let you know that something went wrong.

**Example** (Short-Circuiting Behavior)

```ts twoslash {14-15}
import { Effect, Console } from 'effect'

// Define three effects representing different tasks.
const task1 = Console.log('Executing task1...')
const task2 = Effect.fail('Something went wrong!')
const task3 = Console.log('Executing task3...')

// Compose the three tasks to run them in sequence.
// If one of the tasks fails, the subsequent tasks won't be executed.
const program = Effect.gen(function* () {
  yield* task1
  // After task1, task2 is executed, but it fails with an error
  yield* task2
  // This computation won't be executed because the previous one fails
  yield* task3
})

Effect.runPromiseExit(program).then(console.log)
/*
Output:
Executing task1...
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Something went wrong!' }
}
*/
```

This code snippet demonstrates the short-circuiting behavior when an error occurs.
Each operation depends on the successful execution of the previous one.
If any error occurs, the execution is short-circuited, and the error is propagated.
In this specific example, `task3` is never executed because an error occurs in `task2`.
