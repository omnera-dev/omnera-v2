## Cause Variations

There are several causes for various errors, in this section, we will describe each of these causes.

### Empty

The `Empty` cause signifies the absence of any errors.

### Fail

The `Fail<E>` cause represents a failure due to an expected error of type `E`.

### Die

The `Die` cause indicates a failure resulting from a defect, which is an unexpected or unintended error.

### Interrupt

The `Interrupt` cause represents a failure due to `Fiber` interruption and contains the `FiberId` of the interrupted `Fiber`.

### Sequential

The `Sequential` cause combines two causes that occurred one after the other.

For example, in an `Effect.ensuring` operation (analogous to `try-finally`), if both the `try` and `finally` sections fail, the two errors are represented in sequence by a `Sequential` cause.

**Example** (Capturing Sequential Failures with a `Sequential` Cause)

```ts twoslash
import { Effect, Cause } from "effect"

const program = Effect.failCause(Cause.fail("Oh no!")).pipe(
  Effect.ensuring(Effect.failCause(Cause.die("Boom!")))
)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Sequential',
    left: { _id: 'Cause', _tag: 'Fail', failure: 'Oh no!' },
    right: { _id: 'Cause', _tag: 'Die', defect: 'Boom!' }
  }
}
*/
```

### Parallel

The `Parallel` cause combines two causes that occurred concurrently.

In Effect programs, two operations may run in parallel, potentially leading to multiple failures. When both computations fail simultaneously, a `Parallel` cause represents the concurrent errors within the effect workflow.

**Example** (Capturing Concurrent Failures with a `Parallel` Cause)

```ts twoslash
import { Effect, Cause } from "effect"

const program = Effect.all(
  [
    Effect.failCause(Cause.fail("Oh no!")),
    Effect.failCause(Cause.die("Boom!"))
  ],
  { concurrency: 2 }
)

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Parallel',
    left: { _id: 'Cause', _tag: 'Fail', failure: 'Oh no!' },
    right: { _id: 'Cause', _tag: 'Die', defect: 'Boom!' }
  }
}
*/
```
