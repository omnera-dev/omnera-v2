## validateFirst

The `Effect.validateFirst` function is similar to `Effect.validateAll` but it returns the first successful result, or all errors if none succeed.

**Example** (Returning the First Success)

```ts twoslash
import { Effect, Console } from "effect"

//      ┌─── Effect<number, string[], never>
//      ▼
const program = Effect.validateFirst([1, 2, 3, 4, 5], (n) => {
  if (n < 4) {
    return Effect.fail(`${n} is not less that 4`)
  } else {
    return Console.log(`item ${n}`).pipe(Effect.as(n))
  }
})

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
item 4
4
*/
```

Notice that `Effect.validateFirst` returns a single `number` as the success type, rather than an array of results like `Effect.validateAll`.
