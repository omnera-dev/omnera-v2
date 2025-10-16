## Counter

In the world of metrics, a Counter is a metric that represents a single numerical value that can be both incremented and decremented over time. Think of it like a tally that keeps track of changes, such as the number of a particular type of request received by your application, whether it's increasing or decreasing.

Unlike some other types of metrics (like [gauges](#gauge)), where we're interested in the value at a specific moment, with counters, we care about the cumulative value over time. This means it provides a running total of changes, which can go up and down, reflecting the dynamic nature of certain metrics.

Some typical use cases for counters include:

- **Request Counts**: Monitoring the number of incoming requests to your server.
- **Completed Tasks**: Keeping track of how many tasks or processes have been successfully completed.
- **Error Counts**: Counting the occurrences of errors in your application.

### How to Create a Counter

To create a counter, you can use the `Metric.counter` constructor.

**Example** (Creating a Counter)

```ts twoslash
import { Metric, Effect } from 'effect'

const requestCount = Metric.counter('request_count', {
  // Optional
  description: 'A counter for tracking requests',
})
```

Once created, the counter can accept an effect that returns a `number`, which will increment or decrement the counter.

**Example** (Using a Counter)

```ts twoslash
import { Metric, Effect } from 'effect'

const requestCount = Metric.counter('request_count')

const program = Effect.gen(function* () {
  // Increment the counter by 1
  const a = yield* requestCount(Effect.succeed(1))
  // Increment the counter by 2
  const b = yield* requestCount(Effect.succeed(2))
  // Decrement the counter by 4
  const c = yield* requestCount(Effect.succeed(-4))

  // Get the current state of the counter
  const state = yield* Metric.value(requestCount)
  console.log(state)

  return a * b * c
})

Effect.runPromise(program).then(console.log)
/*
Output:
CounterState {
  count: -1,
  ...
}
-8
*/
```

<Aside type="note" title="Type Preservation">
  Applying a counter to an effect doesn't change its original type. The
  metric simply adds tracking without affecting the effect's output type.
</Aside>

### Counter Types

You can specify whether the counter tracks a `number` or `bigint`.

```ts twoslash
import { Metric } from 'effect'

const numberCounter = Metric.counter('request_count', {
  description: 'A counter for tracking requests',
  // bigint: false // default
})

const bigintCounter = Metric.counter('error_count', {
  description: 'A counter for tracking errors',
  bigint: true,
})
```

### Increment-Only Counters

If you need a counter that only increments, you can use the `incremental: true` option.

**Example** (Using an Increment-Only Counter)

```ts twoslash
import { Metric, Effect } from 'effect'

const incrementalCounter = Metric.counter('count', {
  description: 'a counter that only increases its value',
  incremental: true,
})

const program = Effect.gen(function* () {
  const a = yield* incrementalCounter(Effect.succeed(1))
  const b = yield* incrementalCounter(Effect.succeed(2))
  // This will have no effect on the counter
  const c = yield* incrementalCounter(Effect.succeed(-4))

  const state = yield* Metric.value(incrementalCounter)
  console.log(state)

  return a * b * c
})

Effect.runPromise(program).then(console.log)
/*
Output:
CounterState {
  count: 3,
  ...
}
-8
*/
```

In this configuration, the counter only accepts positive values. Any attempts to decrement will have no effect, ensuring the counter strictly counts upwards.

### Counters With Constant Input

You can configure a counter to always increment by a fixed value each time it is invoked.

**Example** (Constant Input)

```ts twoslash
import { Metric, Effect } from 'effect'

const taskCount = Metric.counter('task_count').pipe(
  Metric.withConstantInput(1) // Automatically increments by 1
)

const task1 = Effect.succeed(1).pipe(Effect.delay('100 millis'))
const task2 = Effect.succeed(2).pipe(Effect.delay('200 millis'))
const task3 = Effect.succeed(-4).pipe(Effect.delay('300 millis'))

const program = Effect.gen(function* () {
  const a = yield* taskCount(task1)
  const b = yield* taskCount(task2)
  const c = yield* taskCount(task3)

  const state = yield* Metric.value(taskCount)
  console.log(state)

  return a * b * c
})

Effect.runPromise(program).then(console.log)
/*
Output:
CounterState {
  count: 3,
  ...
}
-8
*/
```
