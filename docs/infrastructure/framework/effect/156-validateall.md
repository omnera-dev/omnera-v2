## validateAll

The `Effect.validateAll` function is similar to the `Effect.forEach` function. It transforms all elements of a collection using the provided effectful operation, but it collects all errors in the error channel, as well as the success values in the success channel.

```ts twoslash
import { Effect, Console } from "effect"

//      ┌─── Effect<number[], string[], never>
//      ▼
const program = Effect.validateAll([1, 2, 3, 4, 5], (n) => {
  if (n < 4) {
    return Console.log(`item ${n}`).pipe(Effect.as(n))
  } else {
    return Effect.fail(`${n} is not less that 4`)
  }
})

Effect.runPromiseExit(program).then(console.log)
/*
Output:
item 1
item 2
item 3
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: [ '4 is not less that 4', '5 is not less that 4' ]
  }
}
*/
```

<Aside type="caution" title="Loss of Successes">
  Note that this function is lossy, which means that if there are any
  errors, all successes will be lost. If you need to preserve both
  successes and failures, consider using [Effect.partition](#partition).
</Aside>
