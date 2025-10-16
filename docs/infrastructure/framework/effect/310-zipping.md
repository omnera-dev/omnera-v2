## Zipping

### zip

Combines two effects into a single effect, producing a tuple with the results of both effects.

The `Effect.zip` function executes the first effect (left) and then the second effect (right).
Once both effects succeed, their results are combined into a tuple.

**Example** (Combining Two Effects Sequentially)

```ts twoslash
import { Effect } from 'effect'

const task1 = Effect.succeed(1).pipe(
  Effect.delay('200 millis'),
  Effect.tap(Effect.log('task1 done'))
)

const task2 = Effect.succeed('hello').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Effect.log('task2 done'))
)

// Combine the two effects together
//
//      ┌─── Effect<[number, string], never, never>
//      ▼
const program = Effect.zip(task1, task2)

Effect.runPromise(program).then(console.log)
/*
Output:
timestamp=... level=INFO fiber=#0 message="task1 done"
timestamp=... level=INFO fiber=#0 message="task2 done"
[ 1, 'hello' ]
*/
```

By default, the effects are run sequentially. To run them concurrently, use the `{ concurrent: true }` option.

**Example** (Combining Two Effects Concurrently)

```ts collapse={3-11} "{ concurrent: true }" "task2 done"
import { Effect } from 'effect'

const task1 = Effect.succeed(1).pipe(
  Effect.delay('200 millis'),
  Effect.tap(Effect.log('task1 done'))
)

const task2 = Effect.succeed('hello').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Effect.log('task2 done'))
)

// Run both effects concurrently using the concurrent option
const program = Effect.zip(task1, task2, { concurrent: true })

Effect.runPromise(program).then(console.log)
/*
Output:
timestamp=... level=INFO fiber=#3 message="task2 done"
timestamp=... level=INFO fiber=#2 message="task1 done"
[ 1, 'hello' ]
*/
```

In this concurrent version, both effects run in parallel. `task2` completes first, but both tasks can be logged and processed as soon as they're done.

### zipWith

Combines two effects sequentially and applies a function to their results to produce a single value.

The `Effect.zipWith` function is similar to [Effect.zip](#zip), but instead of returning a tuple of results,
it applies a provided function to the results of the two effects, combining them into a single value.

By default, the effects are run sequentially. To run them concurrently, use the `{ concurrent: true }` option.

**Example** (Combining Effects with a Custom Function)

```ts twoslash
import { Effect } from 'effect'

const task1 = Effect.succeed(1).pipe(
  Effect.delay('200 millis'),
  Effect.tap(Effect.log('task1 done'))
)
const task2 = Effect.succeed('hello').pipe(
  Effect.delay('100 millis'),
  Effect.tap(Effect.log('task2 done'))
)

//      ┌─── Effect<number, never, never>
//      ▼
const task3 = Effect.zipWith(
  task1,
  task2,
  // Combines results into a single value
  (number, string) => number + string.length
)

Effect.runPromise(task3).then(console.log)
/*
Output:
timestamp=... level=INFO fiber=#3 message="task1 done"
timestamp=... level=INFO fiber=#2 message="task2 done"
6
*/
```
