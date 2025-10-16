## Interruptions

All effects in Effect are executed by [fibers](/docs/concurrency/fibers/). If you didn't create the fiber yourself, it was created by an operation you're using (if it's concurrent) or by the Effect [runtime](/docs/runtime/) system.

A fiber is created any time an effect is run. When running effects concurrently, a fiber is created for each concurrent effect.

To summarize:

- An `Effect` is a higher-level concept that describes an effectful computation. It is lazy and immutable, meaning it represents a computation that may produce a value or fail but does not immediately execute.
- A fiber, on the other hand, represents the running execution of an `Effect`. It can be interrupted or awaited to retrieve its result. Think of it as a way to control and interact with the ongoing computation.

Fibers can be interrupted in various ways. Let's explore some of these scenarios and see examples of how to interrupt fibers in Effect.

### interrupt

A fiber can be interrupted using the `Effect.interrupt` effect on that particular fiber.

This effect models the explicit interruption of the fiber in which it runs.
When executed, it causes the fiber to stop its operation immediately, capturing the interruption details such as the fiber's ID and its start time.
The resulting interruption can be observed in the [Exit](/docs/data-types/exit/) type if the effect is run with functions like [runPromiseExit](/docs/getting-started/running-effects/#runpromiseexit).

**Example** (Without Interruption)

In this case, the program runs without any interruption, logging the start and completion of the task.

```ts twoslash
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  console.log('start')
  yield* Effect.sleep('2 seconds')
  console.log('done')
  return 'some result'
})

Effect.runPromiseExit(program).then(console.log)
/*
Output:
start
done
{ _id: 'Exit', _tag: 'Success', value: 'some result' }
*/
```

**Example** (With Interruption)

Here, the fiber is interrupted after the log `"start"` but before the `"done"` log. The `Effect.interrupt` stops the fiber, and it never reaches the final log.

```ts {6} twoslash
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  console.log('start')
  yield* Effect.sleep('2 seconds')
  yield* Effect.interrupt
  console.log('done')
  return 'some result'
})

Effect.runPromiseExit(program).then(console.log)
/*
Output:
start
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Interrupt',
    fiberId: {
      _id: 'FiberId',
      _tag: 'Runtime',
      id: 0,
      startTimeMillis: ...
    }
  }
}
*/
```

### onInterrupt

Registers a cleanup effect to run when an effect is interrupted.

This function allows you to specify an effect to run when the fiber is interrupted. This effect will be executed
when the fiber is interrupted, allowing you to perform cleanup or other actions.

**Example** (Running a Cleanup Action on Interruption)

In this example, we set up a handler that logs "Cleanup completed" whenever the fiber is interrupted. We then show three cases: a successful effect, a failing effect, and an interrupted effect, demonstrating how the handler is triggered depending on how the effect ends.

```ts twoslash
import { Console, Effect } from 'effect'

// This handler is executed when the fiber is interrupted
const handler = Effect.onInterrupt((_fibers) => Console.log('Cleanup completed'))

const success = Console.log('Task completed').pipe(Effect.as('some result'), handler)

Effect.runFork(success)
/*
Output:
Task completed
*/

const failure = Console.log('Task failed').pipe(Effect.andThen(Effect.fail('some error')), handler)

Effect.runFork(failure)
/*
Output:
Task failed
*/

const interruption = Console.log('Task interrupted').pipe(Effect.andThen(Effect.interrupt), handler)

Effect.runFork(interruption)
/*
Output:
Task interrupted
Cleanup completed
*/
```

### Interruption of Concurrent Effects

When running multiple effects concurrently, such as with `Effect.forEach`, if one of the effects is interrupted, it causes all concurrent effects to be interrupted as well.

The resulting [cause](/docs/data-types/cause/) includes information about which fibers were interrupted.

**Example** (Interrupting Concurrent Effects)

```ts twoslash
import { Effect, Console } from 'effect'

const program = Effect.forEach(
  [1, 2, 3],
  (n) =>
    Effect.gen(function* () {
      console.log(`start #${n}`)
      yield* Effect.sleep(`${n} seconds`)
      if (n > 1) {
        yield* Effect.interrupt
      }
      console.log(`done #${n}`)
    }).pipe(Effect.onInterrupt(() => Console.log(`interrupted #${n}`))),
  { concurrency: 'unbounded' }
)

Effect.runPromiseExit(program).then((exit) => console.log(JSON.stringify(exit, null, 2)))
/*
Output:
start #1
start #2
start #3
done #1
interrupted #2
interrupted #3
{
  "_id": "Exit",
  "_tag": "Failure",
  "cause": {
    "_id": "Cause",
    "_tag": "Parallel",
    "left": {
      "_id": "Cause",
      "_tag": "Interrupt",
      "fiberId": {
        "_id": "FiberId",
        "_tag": "Runtime",
        "id": 3,
        "startTimeMillis": ...
      }
    },
    "right": {
      "_id": "Cause",
      "_tag": "Sequential",
      "left": {
        "_id": "Cause",
        "_tag": "Empty"
      },
      "right": {
        "_id": "Cause",
        "_tag": "Interrupt",
        "fiberId": {
          "_id": "FiberId",
          "_tag": "Runtime",
          "id": 0,
          "startTimeMillis": ...
        }
      }
    }
  }
}
*/
```
