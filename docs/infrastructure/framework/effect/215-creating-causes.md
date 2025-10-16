## Creating Causes

You can intentionally create an effect with a specific cause using `Effect.failCause`.

**Example** (Defining Effects with Different Causes)

```ts twoslash
import { Effect, Cause } from 'effect'

// Define an effect that dies with an unexpected error
//
//      ┌─── Effect<never, never, never>
//      ▼
const die = Effect.failCause(Cause.die('Boom!'))

// Define an effect that fails with an expected error
//
//      ┌─── Effect<never, string, never>
//      ▼
const fail = Effect.failCause(Cause.fail('Oh no!'))
```

Some causes do not influence the error type of the effect, leading to `never` in the error channel:

```text showLineNumbers=false
                ┌─── no error information
                ▼
Effect<never, never, never>
```

For instance, `Cause.die` does not specify an error type for the effect, while `Cause.fail` does, setting the error channel type accordingly.
