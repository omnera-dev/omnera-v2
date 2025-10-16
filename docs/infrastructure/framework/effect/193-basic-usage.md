## Basic Usage

### timeout

The `Effect.timeout` function employs a [Duration](/docs/data-types/duration/) parameter to establish a time limit on an operation. If the operation exceeds this limit, a `TimeoutException` is triggered, indicating a timeout has occurred.

**Example** (Setting a Timeout)

Here, the task completes within the timeout duration, so the result is returned successfully.

```ts twoslash
import { Effect } from 'effect'

const task = Effect.gen(function* () {
  console.log('Start processing...')
  yield* Effect.sleep('2 seconds') // Simulates a delay in processing
  console.log('Processing complete.')
  return 'Result'
})

// Sets a 3-second timeout for the task
const timedEffect = task.pipe(Effect.timeout('3 seconds'))

// Output will show that the task completes successfully
// as it falls within the timeout duration
Effect.runPromiseExit(timedEffect).then(console.log)
/*
Output:
Start processing...
Processing complete.
{ _id: 'Exit', _tag: 'Success', value: 'Result' }
*/
```

If the operation exceeds the specified duration, a `TimeoutException` is raised:

```ts twoslash
import { Effect } from 'effect'

const task = Effect.gen(function* () {
  console.log('Start processing...')
  yield* Effect.sleep('2 seconds') // Simulates a delay in processing
  console.log('Processing complete.')
  return 'Result'
})

// Output will show a TimeoutException as the task takes longer
// than the specified timeout duration
const timedEffect = task.pipe(Effect.timeout('1 second'))

Effect.runPromiseExit(timedEffect).then(console.log)
/*
Output:
Start processing...
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: { _tag: 'TimeoutException' }
  }
}
*/
```

### timeoutOption

If you want to handle timeouts more gracefully, consider using `Effect.timeoutOption`. This function treats timeouts as regular results, wrapping the outcome in an [Option](/docs/data-types/option/).

**Example** (Handling Timeout as an Option)

In this example, the first task completes successfully, while the second times out. The result of the timed-out task is represented as `None` in the `Option` type.

```ts twoslash
import { Effect } from 'effect'

const task = Effect.gen(function* () {
  console.log('Start processing...')
  yield* Effect.sleep('2 seconds') // Simulates a delay in processing
  console.log('Processing complete.')
  return 'Result'
})

const timedOutEffect = Effect.all([
  task.pipe(Effect.timeoutOption('3 seconds')),
  task.pipe(Effect.timeoutOption('1 second')),
])

Effect.runPromise(timedOutEffect).then(console.log)
/*
Output:
Start processing...
Processing complete.
Start processing...
[
  { _id: 'Option', _tag: 'Some', value: 'Result' },
  { _id: 'Option', _tag: 'None' }
]
*/
```
