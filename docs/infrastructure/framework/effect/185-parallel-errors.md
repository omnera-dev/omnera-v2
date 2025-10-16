## Parallel Errors

In some cases, you might encounter multiple errors, especially during concurrent computations. When tasks are run concurrently, multiple errors can happen at the same time.

**Example** (Handling Multiple Errors in Concurrent Computations)

In this example, both the `fail` and `die` effects are executed concurrently. Since both fail, the program will report multiple errors in the output.

```ts twoslash
import { Effect } from 'effect'

const fail = Effect.fail('Oh uh!')
const die = Effect.dieMessage('Boom!')

// Run both effects concurrently
const program = Effect.all([fail, die], {
  concurrency: 'unbounded',
}).pipe(Effect.asVoid)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Parallel',
    left: { _id: 'Cause', _tag: 'Fail', failure: 'Oh uh!' },
    right: { _id: 'Cause', _tag: 'Die', defect: [Object] }
  }
}
*/
```

### parallelErrors

Effect provides a function called `Effect.parallelErrors` that captures all failure errors from concurrent operations in the error channel.

**Example** (Capturing Multiple Concurrent Failures)

In this example, `Effect.parallelErrors` combines the errors from `fail1` and `fail2` into a single error.

```ts twoslash
import { Effect } from 'effect'

const fail1 = Effect.fail('Oh uh!')
const fail2 = Effect.fail('Oh no!')
const die = Effect.dieMessage('Boom!')

// Run all effects concurrently and capture all errors
const program = Effect.all([fail1, fail2, die], {
  concurrency: 'unbounded',
}).pipe(Effect.asVoid, Effect.parallelErrors)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: [ 'Oh uh!', 'Oh no!' ] }
}
*/
```

<Aside type="note" title="Applicability">
  Note that `Effect.parallelErrors` is only for failures, not defects or
  interruptions.
</Aside>
