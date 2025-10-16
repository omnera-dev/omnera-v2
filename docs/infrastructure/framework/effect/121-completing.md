## Completing

You can complete a deferred in several ways, depending on whether you want to succeed, fail, or interrupt the waiting fibers:

| API                     | Description                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `Deferred.succeed`      | Completes the deferred successfully with a value.                                                               |
| `Deferred.done`         | Completes the deferred with an [Exit](/docs/data-types/exit/) value.                                            |
| `Deferred.complete`     | Completes the deferred with the result of an effect.                                                            |
| `Deferred.completeWith` | Completes the deferred with an effect. This effect will be executed by each waiting fiber, so use it carefully. |
| `Deferred.fail`         | Fails the deferred with an error.                                                                               |
| `Deferred.die`          | Defects the deferred with a user-defined error.                                                                 |
| `Deferred.failCause`    | Fails or defects the deferred with a [Cause](/docs/data-types/cause/).                                          |
| `Deferred.interrupt`    | Interrupts the deferred, forcefully stopping or interrupting the waiting fibers.                                |

**Example** (Completing a Deferred with Success)

```ts twoslash
import { Effect, Deferred } from 'effect'

const program = Effect.gen(function* () {
  const deferred = yield* Deferred.make<number, string>()

  // Complete the Deferred successfully
  yield* Deferred.succeed(deferred, 1)

  // Awaiting the Deferred to get its value
  const value = yield* Deferred.await(deferred)

  console.log(value)
})

Effect.runFork(program)
// Output: 1
```

Completing a deferred produces an `Effect<boolean>`. This effect returns `true` if the deferred was successfully completed, and `false` if it had already been completed previously. This can be useful for tracking the state of the deferred.

**Example** (Checking Completion Status)

```ts twoslash
import { Effect, Deferred } from 'effect'

const program = Effect.gen(function* () {
  const deferred = yield* Deferred.make<number, string>()

  // Attempt to fail the Deferred
  const firstAttempt = yield* Deferred.fail(deferred, 'oh no!')

  // Attempt to succeed after it has already been completed
  const secondAttempt = yield* Deferred.succeed(deferred, 1)

  console.log([firstAttempt, secondAttempt])
})

Effect.runFork(program)
// Output: [ true, false ]
```
