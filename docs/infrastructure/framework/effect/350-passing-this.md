## Passing `this`

In some cases, you might need to pass a reference to the current object (`this`) into the body of your generator function.
You can achieve this by utilizing an overload that accepts the reference as the first argument:

**Example** (Passing `this` to Generator)

```ts twoslash
import { Effect } from "effect"

class MyClass {
  readonly local = 1
  compute = Effect.gen(this, function* () {
    const n = this.local + 1

    yield* Effect.log(`Computed value: ${n}`)

    return n
  })
}

Effect.runPromise(new MyClass().compute).then(console.log)
/*
Output:
timestamp=... level=INFO fiber=#0 message="Computed value: 2"
2
*/
```
