## Retrying

### retry

The `Micro.retry` function allows you to retry a failing effect according to a defined policy.

**Example** (Retrying with a Fixed Delay)

```ts twoslash
import { Micro } from "effect"

let count = 0

// Simulates an effect with possible failures
const effect = Micro.async<string, Error>((resume) => {
  if (count <= 2) {
    count++
    console.log("failure")
    resume(Micro.fail(new Error()))
  } else {
    console.log("success")
    resume(Micro.succeed("yay!"))
  }
})

// Define a repetition policy using a spaced delay between retries
const policy = Micro.scheduleSpaced(100)

const repeated = Micro.retry(effect, { schedule: policy })

Micro.runPromise(repeated).then(console.log)
/*
Output:
failure
failure
failure
success
yay!
*/
```
