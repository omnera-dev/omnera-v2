## Using Ref in a Concurrent Environment

We can also use `Ref` in concurrent scenarios, where multiple tasks might be updating shared state at the same time.

**Example** (Concurrent Updates to Shared Counter)

For this example, let's update the counter concurrently:

```ts twoslash collapse={3-15}
import { Effect, Ref } from "effect"

class Counter {
  inc: Effect.Effect<void>
  dec: Effect.Effect<void>
  get: Effect.Effect<number>

  constructor(private value: Ref.Ref<number>) {
    this.inc = Ref.update(this.value, (n) => n + 1)
    this.dec = Ref.update(this.value, (n) => n - 1)
    this.get = Ref.get(this.value)
  }
}

const make = Effect.andThen(Ref.make(0), (value) => new Counter(value))

const program = Effect.gen(function* () {
  const counter = yield* make

  // Helper to log the counter's value before running an effect
  const logCounter = <R, E, A>(
    label: string,
    effect: Effect.Effect<A, E, R>
  ) =>
    Effect.gen(function* () {
      const value = yield* counter.get
      yield* Effect.log(`${label} get: ${value}`)
      return yield* effect
    })

  yield* logCounter("task 1", counter.inc).pipe(
    Effect.zip(logCounter("task 2", counter.inc), { concurrent: true }),
    Effect.zip(logCounter("task 3", counter.dec), { concurrent: true }),
    Effect.zip(logCounter("task 4", counter.inc), { concurrent: true })
  )
  const value = yield* counter.get
  yield* Effect.log(`This counter has a value of ${value}.`)
})

Effect.runPromise(program)
/*
Output:
timestamp=... fiber=#3 message="task 4 get: 0"
timestamp=... fiber=#6 message="task 3 get: 1"
timestamp=... fiber=#8 message="task 1 get: 0"
timestamp=... fiber=#9 message="task 2 get: 1"
timestamp=... fiber=#0 message="This counter has a value of 2."
*/
```
