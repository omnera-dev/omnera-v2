## repeatN

The `repeatN` function returns a new effect that repeats the specified effect a given number of times or until the first failure. The repeats are in addition to the initial execution, so `Effect.repeatN(action, 1)` executes `action` once initially and then repeats it one additional time if it succeeds.

**Example** (Repeating an Action Multiple Times)

```ts twoslash
import { Effect, Console } from 'effect'

const action = Console.log('success')

// Repeat the action 2 additional times after the first execution
const program = Effect.repeatN(action, 2)

Effect.runPromise(program)
/*
Output:
success
success
success
*/
```
