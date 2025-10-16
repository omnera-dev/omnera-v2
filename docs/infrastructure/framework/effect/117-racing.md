## Racing

### race

This function takes two effects and runs them concurrently. The first effect
that successfully completes will determine the result of the race, and the
other effect will be interrupted.

If neither effect succeeds, the function will fail with a [cause](/docs/data-types/cause/) containing all the errors.

This is useful when you want to run two effects concurrently, but only care
about the first one to succeed. It is commonly used in cases like timeouts,
retries, or when you want to optimize for the faster response without
worrying about the other effect.

**Example** (Both Tasks Succeed)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.succeed('task1').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted'))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted'))
)

const program = Effect.race(task1, task2)

Effect.runFork(program)
/*
Output:
task2 done
task1 interrupted
*/
```

**Example** (One Task Fails, One Succeeds)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.fail('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted'))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted'))
)

const program = Effect.race(task1, task2)

Effect.runFork(program)
/*
Output:
task2 done
*/
```

**Example** (Both Tasks Fail)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.fail('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted'))
)
const task2 = Effect.fail('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted'))
)

const program = Effect.race(task1, task2)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Parallel',
    left: { _id: 'Cause', _tag: 'Fail', failure: 'task1' },
    right: { _id: 'Cause', _tag: 'Fail', failure: 'task2' }
  }
}
*/
```

If you want to handle the result of whichever task completes first, whether it succeeds or fails, you can use the `Effect.either` function. This function wraps the result in an [Either](/docs/data-types/either/) type, allowing you to see if the result was a success (`Right`) or a failure (`Left`):

**Example** (Handling Success or Failure with Either)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.fail('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted'))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted'))
)

// Run both tasks concurrently, wrapping the result
// in Either to capture success or failure
const program = Effect.race(Effect.either(task1), Effect.either(task2))

Effect.runPromise(program).then(console.log)
/*
Output:
task2 interrupted
{ _id: 'Either', _tag: 'Left', left: 'task1' }
*/
```

### raceAll

This function runs multiple effects concurrently and returns the result of the first one to succeed. If one effect succeeds, the others will be interrupted.

If none of the effects succeed, the function will fail with the last error encountered.

This is useful when you want to race multiple effects, but only care
about the first one to succeed. It is commonly used in cases like timeouts,
retries, or when you want to optimize for the faster response without
worrying about the other effects.

**Example** (All Tasks Succeed)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.succeed('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted'))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted'))
)

const task3 = Effect.succeed('task3').pipe(
  Effect.delay('150 millis'),
  Effect.tap(Console.log('task3 done')),
  Effect.onInterrupt(() => Console.log('task3 interrupted'))
)

const program = Effect.raceAll([task1, task2, task3])

Effect.runFork(program)
/*
Output:
task1 done
task2 interrupted
task3 interrupted
*/
```

**Example** (One Task Fails, Two Tasks Succeed)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.fail('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted'))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted'))
)

const task3 = Effect.succeed('task3').pipe(
  Effect.delay('150 millis'),
  Effect.tap(Console.log('task3 done')),
  Effect.onInterrupt(() => Console.log('task3 interrupted'))
)

const program = Effect.raceAll([task1, task2, task3])

Effect.runFork(program)
/*
Output:
task3 done
task2 interrupted
*/
```

**Example** (All Tasks Fail)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.fail('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted'))
)
const task2 = Effect.fail('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted'))
)

const task3 = Effect.fail('task3').pipe(
  Effect.delay('150 millis'),
  Effect.tap(Console.log('task3 done')),
  Effect.onInterrupt(() => Console.log('task3 interrupted'))
)

const program = Effect.raceAll([task1, task2, task3])

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'task2' }
}
*/
```

### raceFirst

This function takes two effects and runs them concurrently, returning the
result of the first one that completes, regardless of whether it succeeds or
fails.

This function is useful when you want to race two operations, and you want to
proceed with whichever one finishes first, regardless of whether it succeeds
or fails.

**Example** (Both Tasks Succeed)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.succeed('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted').pipe(Effect.delay('100 millis')))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted').pipe(Effect.delay('100 millis')))
)

const program = Effect.raceFirst(task1, task2).pipe(Effect.tap(Console.log('more work...')))

Effect.runPromiseExit(program).then(console.log)
/*
Output:
task1 done
task2 interrupted
more work...
{ _id: 'Exit', _tag: 'Success', value: 'task1' }
*/
```

**Example** (One Task Fails, One Succeeds)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.fail('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted').pipe(Effect.delay('100 millis')))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted').pipe(Effect.delay('100 millis')))
)

const program = Effect.raceFirst(task1, task2).pipe(Effect.tap(Console.log('more work...')))

Effect.runPromiseExit(program).then(console.log)
/*
Output:
task2 interrupted
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'task1' }
}
*/
```

#### Disconnecting Effects

The `Effect.raceFirst` function safely interrupts the "loser" effect once the other completes, but it will not resume until the loser is cleanly terminated.

If you want a quicker return, you can disconnect the interrupt signal for both effects. Instead of calling:

```ts showLineNumbers=false
Effect.raceFirst(task1, task2)
```

You can use:

```ts showLineNumbers=false
Effect.raceFirst(Effect.disconnect(task1), Effect.disconnect(task2))
```

This allows both effects to complete independently while still terminating the losing effect in the background.

**Example** (Using `Effect.disconnect` for Quicker Return)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.succeed('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted').pipe(Effect.delay('100 millis')))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted').pipe(Effect.delay('100 millis')))
)

// Race the two tasks with disconnect to allow quicker return
const program = Effect.raceFirst(Effect.disconnect(task1), Effect.disconnect(task2)).pipe(
  Effect.tap(Console.log('more work...'))
)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
task1 done
more work...
{ _id: 'Exit', _tag: 'Success', value: 'task1' }
task2 interrupted
*/
```

### raceWith

This function runs two effects concurrently and calls a specified "finisher" function once one of the effects completes, regardless of whether it succeeds or fails.

The finisher functions for each effect allow you to handle the results of each effect as soon as they complete.

The function takes two finisher callbacks, one for each effect, and allows you to specify how to handle the result of the race.

This function is useful when you need to react to the completion of either effect without waiting for both to finish. It can be used whenever you want to take action based on the first available result.

**Example** (Handling Results of Concurrent Tasks)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.succeed('task1').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Console.log('task1 done')),
  Effect.onInterrupt(() => Console.log('task1 interrupted').pipe(Effect.delay('100 millis')))
)
const task2 = Effect.succeed('task2').pipe(
  Effect.delay('200 millis'),
  Effect.tap(Console.log('task2 done')),
  Effect.onInterrupt(() => Console.log('task2 interrupted').pipe(Effect.delay('100 millis')))
)

const program = Effect.raceWith(task1, task2, {
  onSelfDone: (exit) => Console.log(`task1 exited with ${exit}`),
  onOtherDone: (exit) => Console.log(`task2 exited with ${exit}`),
})

Effect.runFork(program)
/*
Output:
task1 done
task1 exited with {
  "_id": "Exit",
  "_tag": "Success",
  "value": "task1"
}
task2 interrupted
*/
```

# [Deferred](https://effect.website/docs/concurrency/deferred/)
