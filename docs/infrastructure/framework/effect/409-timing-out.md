## Timing out

When an operation does not finish within the specified duration, the behavior of the `Micro.timeout` depends on whether the operation is "uninterruptible".

<Aside type="note" title="Uninterruptible Effects">
  An uninterruptible effect is one that, once started, cannot be stopped
  mid-execution by the timeout mechanism directly. This could be because
  the operations within the effect need to run to completion to avoid
  leaving the system in an inconsistent state.
</Aside>

1. **Interruptible Operation**: If the operation can be interrupted, it is terminated immediately once the timeout threshold is reached, resulting in a `TimeoutException`.

   ```ts twoslash
   import { Micro } from 'effect'

   const task = Micro.gen(function* () {
     console.log('Start processing...')
     yield* Micro.sleep(2_000) // Simulates a delay in processing
     console.log('Processing complete.')
     return 'Result'
   })

   const timedEffect = task.pipe(Micro.timeout(1_000))

   Micro.runPromiseExit(timedEffect).then(console.log)
   /*
   Output:
   Start processing...
   {
     "_id": "MicroExit",
     "_tag": "Failure",
     "cause": {
       "_tag": "Fail",
       "traces": [],
       "name": "(MicroCause.Fail) TimeoutException",
       "error": {
         "_tag": "TimeoutException"
       }
     }
   }
   */
   ```

2. **Uninterruptible Operation**: If the operation is uninterruptible, it continues until completion before the `TimeoutException` is assessed.

   ```ts twoslash
   import { Micro } from 'effect'

   const task = Micro.gen(function* () {
     console.log('Start processing...')
     yield* Micro.sleep(2_000) // Simulates a delay in processing
     console.log('Processing complete.')
     return 'Result'
   })

   const timedEffect = task.pipe(Micro.uninterruptible, Micro.timeout(1_000))

   // Outputs a TimeoutException after the task completes,
   // because the task is uninterruptible
   Micro.runPromiseExit(timedEffect).then(console.log)
   /*
   Output:
   Start processing...
   Processing complete.
   {
     "_id": "MicroExit",
     "_tag": "Failure",
     "cause": {
       "_tag": "Fail",
       "traces": [],
       "name": "(MicroCause.Fail) TimeoutException",
       "error": {
         "_tag": "TimeoutException"
       }
     }
   }
   */
   ```
