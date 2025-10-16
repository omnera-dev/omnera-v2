## Catching Some Defects

### catchSomeDefect

Recovers from specific defects using a provided partial function.

`Effect.catchSomeDefect` allows you to handle specific defects, which are
unexpected errors that can cause the program to stop. It uses a partial
function to catch only certain defects and ignores others.

However, it does not handle expected errors (like those from [Effect.fail](/docs/getting-started/creating-effects/#fail)) or
execution interruptions (like those from [Effect.interrupt](/docs/concurrency/basic-concurrency/#interrupt)).

The function provided to `Effect.catchSomeDefect` acts as a filter and a handler for defects:

- It receives the defect as an input.
- If the defect matches a specific condition (e.g., a certain error type), the function returns
  an `Option.some` containing the recovery logic.
- If the defect does not match, the function returns `Option.none`, allowing the defect to propagate.

**Example** (Handling Specific Defects)

```ts twoslash
import { Effect, Cause, Option, Console } from 'effect'

// Simulating a runtime error
const task = Effect.dieMessage('Boom!')

const program = Effect.catchSomeDefect(task, (defect) => {
  if (Cause.isIllegalArgumentException(defect)) {
    return Option.some(Console.log(`Caught an IllegalArgumentException defect: ${defect.message}`))
  }
  return Option.none()
})

// Since we are only catching IllegalArgumentException
// we will get an Exit.Failure because we simulated a runtime error.
Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Die',
    defect: { _tag: 'RuntimeException' }
  }
}
*/
```

<Aside type="tip" title="When to Recover from Defects">
  Defects are unexpected errors that typically shouldn't be recovered
  from, as they often indicate serious issues. However, in some cases,
  such as dynamically loaded plugins, controlled recovery might be needed.
</Aside>

# [Yieldable Errors](https://effect.website/docs/error-management/yieldable-errors/)
