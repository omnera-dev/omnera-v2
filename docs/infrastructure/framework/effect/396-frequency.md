## Frequency

Frequencies are metrics that help count the occurrences of specific values. Think of them as a set of counters, each associated with a unique value. When new values are observed, the frequency metric automatically creates new counters for those values.

Frequencies are particularly useful for tracking how often distinct string values occur. Some example use cases include:

- Counting the number of invocations for each service in an application, where each service has a logical name.
- Monitoring how frequently different types of failures occur.

**Example** (Tracking Error Occurrences)

In this example, we'll create a `Frequency` to observe how often different error codes occur. This can be applied to effects that return a `string` value:

```ts twoslash
import { Metric, Random, Effect } from 'effect'

// Define a frequency metric to track errors
const errorFrequency = Metric.frequency('error_frequency', {
  // Optional
  description: 'Counts the occurrences of errors.',
})

const task = Effect.gen(function* () {
  const n = yield* Random.nextIntBetween(1, 10)
  return `Error-${n}`
})

// Program that simulates random errors and tracks their occurrences
const program = Effect.gen(function* () {
  yield* errorFrequency(task).pipe(Effect.repeatN(99))

  // Retrieve and log the current state of the summary
  const state = yield* Metric.value(errorFrequency)
  console.log('%o', state)
})

Effect.runPromise(program)
/*
Example Output:
FrequencyState {
  occurrences: Map(9) {
    'Error-7' => 12,
    'Error-2' => 12,
    'Error-4' => 14,
    'Error-1' => 14,
    'Error-9' => 8,
    'Error-6' => 11,
    'Error-5' => 9,
    'Error-3' => 14,
    'Error-8' => 6
  },
  ...
}
*/
```
