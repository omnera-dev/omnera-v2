## Running Effects

| Effect                  | Micro                  | ⚠️                                                 |
| ----------------------- | ---------------------- | -------------------------------------------------- |
| `Effect.runSyncExit`    | `Micro.runSyncExit`    | returns a `MicroExit` instead of an `Exit`         |
| `Effect.runPromiseExit` | `Micro.runPromiseExit` | returns a `MicroExit` instead of an `Exit`         |
| `Effect.runFork`        | `Micro.runFork`        | returns a `MicroFiber` instead of a `RuntimeFiber` |

### runSyncExit

The `Micro.runSyncExit` function is used to execute an Effect synchronously, which means it runs immediately and returns the result as a [MicroExit](#microexit).

**Example** (Handling Results as MicroExit)

```ts twoslash
import { Micro } from 'effect'

const result1 = Micro.runSyncExit(Micro.succeed(1))
console.log(result1)
/*
Output:
{
  "_id": "MicroExit",
  "_tag": "Success",
  "value": 1
}
*/

const result2 = Micro.runSyncExit(Micro.fail('my error'))
console.log(result2)
/*
Output:
{
  "_id": "MicroExit",
  "_tag": "Failure",
  "cause": {
    "_tag": "Fail",
    "traces": [],
    "name": "MicroCause.Fail",
    "error": "my error"
  }
}
*/
```

### runPromiseExit

The `Micro.runPromiseExit` function is used to execute an Effect and obtain the result as a `Promise` that resolves to a [MicroExit](#microexit).

**Example** (Handling Results as MicroExit)

```ts twoslash
import { Micro } from 'effect'

Micro.runPromiseExit(Micro.succeed(1)).then(console.log)
/*
Output:
{
  "_id": "MicroExit",
  "_tag": "Success",
  "value": 1
}
*/

Micro.runPromiseExit(Micro.fail('my error')).then(console.log)
/*
Output:
{
  "_id": "MicroExit",
  "_tag": "Failure",
  "cause": {
    "_tag": "Fail",
    "traces": [],
    "name": "MicroCause.Fail",
    "error": "my error"
  }
}
*/
```

### runFork

The `Micro.runFork` function executes the effect and return a `MicroFiber` that can be awaited, joined, or aborted.

You can listen for the result by adding an observer using the `addObserver` method.

**Example** (Observing an Asynchronous Effect)

```ts twoslash
import { Micro } from 'effect'

//      ┌─── MicroFiber<number, never>
//      ▼
const fiber = Micro.succeed(42).pipe(Micro.delay(1000), Micro.runFork)

// Attach an observer to log the result when the effect completes
fiber.addObserver((result) => {
  console.log(result)
})

console.log('observing...')
/*
Output:
observing...
{
  "_id": "MicroExit",
  "_tag": "Success",
  "value": 42
}
*/
```
