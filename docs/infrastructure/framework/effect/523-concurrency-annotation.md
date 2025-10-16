## Concurrency Annotation

For more complex schemas like `Struct`, `Array`, or `Union` that contain multiple nested schemas, the `concurrency` annotation provides a way to control how validations are executed concurrently.

```ts showLineNumbers=false
type ConcurrencyAnnotation = number | 'unbounded' | 'inherit' | undefined
```

Here's a shorter version presented in a table:

| Value         | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| `number`      | Limits the maximum number of concurrent tasks.                  |
| `"unbounded"` | All tasks run concurrently with no limit.                       |
| `"inherit"`   | Inherits concurrency settings from the parent context.          |
| `undefined`   | Tasks run sequentially, one after the other (default behavior). |

**Example** (Sequential Execution)

In this example, we define three tasks that simulate asynchronous operations with different durations. Since no concurrency is specified, the tasks are executed sequentially, one after the other.

```ts twoslash
import { Schema } from 'effect'
import type { Duration } from 'effect'
import { Effect } from 'effect'

// Simulates an async task
const item = (id: number, duration: Duration.DurationInput) =>
  Schema.String.pipe(
    Schema.filterEffect(() =>
      Effect.gen(function* () {
        yield* Effect.sleep(duration)
        console.log(`Task ${id} done`)
        return true
      })
    )
  )

const Sequential = Schema.Tuple(item(1, '30 millis'), item(2, '10 millis'), item(3, '20 millis'))

Effect.runPromise(Schema.decode(Sequential)(['a', 'b', 'c']))
/*
Output:
Task 1 done
Task 2 done
Task 3 done
*/
```

**Example** (Concurrent Execution)

By adding a `concurrency` annotation set to `"unbounded"`, the tasks can now run concurrently, meaning they don't wait for one another to finish before starting. This allows faster execution when multiple tasks are involved.

```ts twoslash
import { Schema } from 'effect'
import type { Duration } from 'effect'
import { Effect } from 'effect'

// Simulates an async task
const item = (id: number, duration: Duration.DurationInput) =>
  Schema.String.pipe(
    Schema.filterEffect(() =>
      Effect.gen(function* () {
        yield* Effect.sleep(duration)
        console.log(`Task ${id} done`)
        return true
      })
    )
  )

const Concurrent = Schema.Tuple(
  item(1, '30 millis'),
  item(2, '10 millis'),
  item(3, '20 millis')
).annotations({ concurrency: 'unbounded' })

Effect.runPromise(Schema.decode(Concurrent)(['a', 'b', 'c']))
/*
Output:
Task 2 done
Task 3 done
Task 1 done
*/
```
