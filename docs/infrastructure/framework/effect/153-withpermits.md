## withPermits

The `withPermits` method lets you specify the number of permits required to run an effect. Once the specified permits are available, it runs the effect, automatically releasing the permits when the task completes.

**Example** (Forcing Sequential Task Execution with a One-Permit Semaphore)

In this example, three tasks are started concurrently, but they run sequentially because the one-permit semaphore only allows one task to proceed at a time.

```ts twoslash
import { Effect } from 'effect'

const task = Effect.gen(function* () {
  yield* Effect.log('start')
  yield* Effect.sleep('2 seconds')
  yield* Effect.log('end')
})

const program = Effect.gen(function* () {
  const mutex = yield* Effect.makeSemaphore(1)

  // Wrap the task to require one permit, forcing sequential execution
  const semTask = mutex.withPermits(1)(task).pipe(Effect.withLogSpan('elapsed'))

  // Run 3 tasks concurrently, but they execute sequentially
  // due to the one-permit semaphore
  yield* Effect.all([semTask, semTask, semTask], {
    concurrency: 'unbounded',
  })
})

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#1 message=start elapsed=3ms
timestamp=... level=INFO fiber=#1 message=end elapsed=2010ms
timestamp=... level=INFO fiber=#2 message=start elapsed=2012ms
timestamp=... level=INFO fiber=#2 message=end elapsed=4017ms
timestamp=... level=INFO fiber=#3 message=start elapsed=4018ms
timestamp=... level=INFO fiber=#3 message=end elapsed=6026ms
*/
```

**Example** (Using Multiple Permits to Control Concurrent Task Execution)

In this example, we create a semaphore with five permits and use `withPermits(n)` to allocate a different number of permits for each task:

```ts twoslash
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const mutex = yield* Effect.makeSemaphore(5)

  const tasks = [1, 2, 3, 4, 5].map((n) =>
    mutex
      .withPermits(n)(Effect.delay(Effect.log(`process: ${n}`), '2 seconds'))
      .pipe(Effect.withLogSpan('elapsed'))
  )

  yield* Effect.all(tasks, { concurrency: 'unbounded' })
})

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#1 message="process: 1" elapsed=2011ms
timestamp=... level=INFO fiber=#2 message="process: 2" elapsed=2017ms
timestamp=... level=INFO fiber=#3 message="process: 3" elapsed=4020ms
timestamp=... level=INFO fiber=#4 message="process: 4" elapsed=6025ms
timestamp=... level=INFO fiber=#5 message="process: 5" elapsed=8034ms
*/
```

<Aside type="note" title="Permit Release Guarantee">
  The `withPermits` method guarantees that permits are released after each
  task, even if the task fails or is interrupted.
</Aside>

# [Error Accumulation](https://effect.website/docs/error-management/error-accumulation/)
