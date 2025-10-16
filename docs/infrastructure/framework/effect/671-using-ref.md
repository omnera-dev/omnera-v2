## Using Ref

Here is a simple example using `Ref` to create a counter:

**Example** (Basic Counter with `Ref`)

```ts twoslash
import { Effect, Ref } from 'effect'

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
```

**Example** (Using the Counter)

```ts twoslash collapse={3-15}
import { Effect, Ref } from 'effect'

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
  yield* counter.inc
  yield* counter.inc
  yield* counter.dec
  yield* counter.inc
  const value = yield* counter.get
  console.log(`This counter has a value of ${value}.`)
})

Effect.runPromise(program)
/*
Output:
This counter has a value of 2.
*/
```

<Aside type="note" title="Ref Operations Are Effectful">
  All the operations on the `Ref` data type are effectful. So when we are
  reading from or writing to a `Ref`, we are performing an effectful
  operation.
</Aside>
