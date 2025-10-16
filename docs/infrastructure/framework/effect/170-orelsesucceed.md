## orElseSucceed

`Effect.orElseSucceed` allows you to replace the failure of an effect with a
success value. If the effect fails, it will instead succeed with the provided
value, ensuring the effect always completes successfully.

This is useful when you want to guarantee a successful result regardless of whether the original
effect failed.

The function ensures that any failure is effectively "swallowed" and replaced
by a successful value, which can be helpful for providing default values in
case of failure.

This function only applies to failed effects. If the effect
already succeeds, it will remain unchanged.

**Example** (Replacing Failure with Success using `Effect.orElseSucceed`)

```ts twoslash
import { Effect } from "effect"

const validate = (age: number): Effect.Effect<number, string> => {
  if (age < 0) {
    return Effect.fail("NegativeAgeError")
  } else if (age < 18) {
    return Effect.fail("IllegalAgeError")
  } else {
    return Effect.succeed(age)
  }
}

const program = Effect.orElseSucceed(validate(-1), () => 18)

console.log(Effect.runSyncExit(program))
/*
Output:
{ _id: 'Exit', _tag: 'Success', value: 18 }
*/
```
