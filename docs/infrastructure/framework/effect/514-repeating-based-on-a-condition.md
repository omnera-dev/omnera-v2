## Repeating Based on a Condition

You can control the repetition of an effect by a condition using either a `while` or `until` option, allowing for dynamic control based on runtime outcomes.

**Example** (Repeating Until a Condition is Met)

```ts twoslash
import { Effect } from 'effect'

let count = 0

// Define an effect that simulates varying outcomes on each invocation
const action = Effect.sync(() => {
  console.log(`Action called ${++count} time(s)`)
  return count
})

// Repeat the action until the count reaches 3
const program = Effect.repeat(action, { until: (n) => n === 3 })

Effect.runFork(program)
/*
Output:
Action called 1 time(s)
Action called 2 time(s)
Action called 3 time(s)
*/
```

<Aside type="tip" title="Retrying on Errors">
  You can use
  [Effect.retry](/docs/error-management/retrying/#retrying-based-on-a-condition)
  if you need to set conditions based on error occurrences rather than
  success outcomes.
</Aside>

# [Schedule Combinators](https://effect.website/docs/scheduling/schedule-combinators/)
