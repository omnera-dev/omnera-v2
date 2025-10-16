## orElseFail

`Effect.orElseFail` allows you to replace the failure from one effect with a
custom failure value. If the effect fails, you can provide a new failure to
be returned instead of the original one.

This function only applies to failed effects. If the effect
succeeds, it will remain unaffected.

**Example** (Replacing Failure with `Effect.orElseFail`)

```ts twoslash
import { Effect } from 'effect'

const validate = (age: number): Effect.Effect<number, string> => {
  if (age < 0) {
    return Effect.fail('NegativeAgeError')
  } else if (age < 18) {
    return Effect.fail('IllegalAgeError')
  } else {
    return Effect.succeed(age)
  }
}

const program = Effect.orElseFail(validate(-1), () => 'invalid age')

console.log(Effect.runSyncExit(program))
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'invalid age' }
}
*/
```
