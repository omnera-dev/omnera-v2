## Fallback

### orElseSucceed

The `Effect.orElseSucceed` function will replace the original failure with a success value, ensuring the effect cannot fail:

**Example** (Replacing Failure with Success using `Micro.orElseSucceed`)

```ts twoslash
import { Micro } from 'effect'

const validate = (age: number): Micro.Micro<number, string> => {
  if (age < 0) {
    return Micro.fail('NegativeAgeError')
  } else if (age < 18) {
    return Micro.fail('IllegalAgeError')
  } else {
    return Micro.succeed(age)
  }
}

const program = Micro.orElseSucceed(validate(-1), () => 18)

console.log(Micro.runSyncExit(program))
/*
Output:
{
  "_id": "MicroExit",
  "_tag": "Success",
  "value": 18
}
*/
```
