## orElse

`Effect.orElse` allows you to attempt to run an effect, and if it fails, you
can provide a fallback effect to run instead.

This is useful for handling failures gracefully by defining an alternative effect to execute if the first
one encounters an error.

**Example** (Handling Fallback with `Effect.orElse`)

```ts twoslash
import { Effect } from 'effect'

const success = Effect.succeed('success')
const failure = Effect.fail('failure')
const fallback = Effect.succeed('fallback')

// Try the success effect first, fallback is not used
const program1 = Effect.orElse(success, () => fallback)
console.log(Effect.runSync(program1))
// Output: "success"

// Try the failure effect first, fallback is used
const program2 = Effect.orElse(failure, () => fallback)
console.log(Effect.runSync(program2))
// Output: "fallback"
```
