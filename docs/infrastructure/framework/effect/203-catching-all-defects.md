## Catching All Defects

There is no sensible way to recover from defects. The functions we're
about to discuss should be used only at the boundary between Effect and
an external system, to transmit information on a defect for diagnostic
or explanatory purposes.

### exit

The `Effect.exit` function transforms an `Effect<A, E, R>` into an effect that encapsulates both potential failure and success within an [Exit](/docs/data-types/exit/) data type:

```ts showLineNumbers=false
Effect<A, E, R> -> Effect<Exit<A, E>, never, R>
```

This means if you have an effect with the following type:

```ts showLineNumbers=false
Effect<string, HttpError, never>
```

and you call `Effect.exit` on it, the type becomes:

```ts showLineNumbers=false
Effect<Exit<string, HttpError>, never, never>
```

The resulting effect cannot fail because the potential failure is now represented within the `Exit`'s `Failure` type.
The error type of the returned effect is specified as `never`, confirming that the effect is structured to not fail.

By yielding an `Exit`, we gain the ability to "pattern match" on this type to handle both failure and success cases within the generator function.

**Example** (Catching Defects with `Effect.exit`)

```ts twoslash
import { Effect, Cause, Console, Exit } from "effect"

// Simulating a runtime error
const task = Effect.dieMessage("Boom!")

const program = Effect.gen(function* () {
  const exit = yield* Effect.exit(task)
  if (Exit.isFailure(exit)) {
    const cause = exit.cause
    if (
      Cause.isDieType(cause) &&
      Cause.isRuntimeException(cause.defect)
    ) {
      yield* Console.log(
        `RuntimeException defect caught: ${cause.defect.message}`
      )
    } else {
      yield* Console.log("Unknown failure caught.")
    }
  }
})

// We get an Exit.Success because we caught all failures
Effect.runPromiseExit(program).then(console.log)
/*
Output:
RuntimeException defect caught: Boom!
{
  _id: "Exit",
  _tag: "Success",
  value: undefined
}
*/
```

### catchAllDefect

Recovers from all defects using a provided recovery function.

`Effect.catchAllDefect` allows you to handle defects, which are unexpected errors
that usually cause the program to terminate. This function lets you recover
from these defects by providing a function that handles the error.

However, it does not handle expected errors (like those from [Effect.fail](/docs/getting-started/creating-effects/#fail)) or
execution interruptions (like those from [Effect.interrupt](/docs/concurrency/basic-concurrency/#interrupt)).

**Example** (Handling All Defects)

```ts twoslash
import { Effect, Cause, Console } from "effect"

// Simulating a runtime error
const task = Effect.dieMessage("Boom!")

const program = Effect.catchAllDefect(task, (defect) => {
  if (Cause.isRuntimeException(defect)) {
    return Console.log(
      `RuntimeException defect caught: ${defect.message}`
    )
  }
  return Console.log("Unknown defect caught.")
})

// We get an Exit.Success because we caught all defects
Effect.runPromiseExit(program).then(console.log)
/*
Output:
RuntimeException defect caught: Boom!
{
  _id: "Exit",
  _tag: "Success",
  value: undefined
}
*/
```

<Aside type="tip" title="When to Recover from Defects">
  Defects are unexpected errors that typically shouldn't be recovered
  from, as they often indicate serious issues. However, in some cases,
  such as dynamically loaded plugins, controlled recovery might be needed.
</Aside>
