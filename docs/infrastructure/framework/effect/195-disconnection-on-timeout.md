## Disconnection on Timeout

The `Effect.disconnect` function provides a way to handle timeouts in uninterruptible effects more flexibly. It allows an uninterruptible effect to complete in the background, while the main control flow proceeds as if a timeout had occurred.

Here's the distinction:

**Without** `Effect.disconnect`:

- An uninterruptible effect will ignore the timeout and continue executing until it completes, after which the timeout error is assessed.
- This can lead to delays in recognizing a timeout condition because the system must wait for the effect to complete.

**With** `Effect.disconnect`:

- The uninterruptible effect is allowed to continue in the background, independent of the main control flow.
- The main control flow recognizes the timeout immediately and proceeds with the timeout error or alternative logic, without having to wait for the effect to complete.
- This method is particularly useful when the operations of the effect do not need to block the continuation of the program, despite being marked as uninterruptible.

**Example** (Running Uninterruptible Tasks with Timeout and Background Completion)

Consider a scenario where a long-running data processing task is initiated, and you want to ensure the system remains responsive, even if the data processing takes too long:

```ts twoslash
import { Effect } from "effect"

const longRunningTask = Effect.gen(function* () {
  console.log("Start heavy processing...")
  yield* Effect.sleep("5 seconds") // Simulate a long process
  console.log("Heavy processing done.")
  return "Data processed"
})

const timedEffect = longRunningTask.pipe(
  Effect.uninterruptible,
  // Allows the task to finish in the background if it times out
  Effect.disconnect,
  Effect.timeout("1 second")
)

Effect.runPromiseExit(timedEffect).then(console.log)
/*
Output:
Start heavy processing...
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: { _tag: 'TimeoutException' }
  }
}
Heavy processing done.
*/
```

In this example, the system detects the timeout after one second, but the long-running task continues and completes in the background, without blocking the program's flow.
