## retry

The `Effect.retry` function takes an effect and a [Schedule](/docs/scheduling/introduction/) policy, and will automatically retry the effect if it fails, following the rules of the policy.

If the effect ultimately succeeds, the result will be returned.

If the maximum retries are exhausted and the effect still fails, the failure is propagated.

This can be useful when dealing with intermittent failures, such as network issues or temporary resource unavailability. By defining a retry policy, you can control the number of retries, the delay between them, and when to stop retrying.

**Example** (Retrying with a Fixed Delay)

```ts twoslash
import { Effect, Schedule } from 'effect'

let count = 0

// Simulates an effect with possible failures
const task = Effect.async<string, Error>((resume) => {
  if (count <= 2) {
    count++
    console.log('failure')
    resume(Effect.fail(new Error()))
  } else {
    console.log('success')
    resume(Effect.succeed('yay!'))
  }
})

// Define a repetition policy using a fixed delay between retries
const policy = Schedule.fixed('100 millis')

const repeated = Effect.retry(task, policy)

Effect.runPromise(repeated).then(console.log)
/*
Output:
failure
failure
failure
success
yay!
*/
```

### Retrying n Times Immediately

You can also retry a failing effect a set number of times with a simpler policy that retries immediately:

**Example** (Retrying a Task up to 5 times)

```ts twoslash
import { Effect } from 'effect'

let count = 0

// Simulates an effect with possible failures
const task = Effect.async<string, Error>((resume) => {
  if (count <= 2) {
    count++
    console.log('failure')
    resume(Effect.fail(new Error()))
  } else {
    console.log('success')
    resume(Effect.succeed('yay!'))
  }
})

// Retry the task up to 5 times
Effect.runPromise(Effect.retry(task, { times: 5 }))
/*
Output:
failure
failure
failure
success
*/
```

### Retrying Based on a Condition

You can customize how retries are managed by specifying conditions. Use the `until` or `while` options to control when retries stop.

**Example** (Retrying Until a Specific Condition is Met)

```ts twoslash
import { Effect } from 'effect'

let count = 0

// Define an effect that simulates varying error on each invocation
const action = Effect.failSync(() => {
  console.log(`Action called ${++count} time(s)`)
  return `Error ${count}`
})

// Retry the action until a specific condition is met
const program = Effect.retry(action, {
  until: (err) => err === 'Error 3',
})

Effect.runPromiseExit(program).then(console.log)
/*
Output:
Action called 1 time(s)
Action called 2 time(s)
Action called 3 time(s)
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Error 3' }
}
*/
```

<Aside type="tip" title="Alternative">
  You can also use
  [Effect.repeat](/docs/scheduling/repetition/#repeating-based-on-a-condition)
  if your retry condition is based on successful outcomes rather than
  errors.
</Aside>
