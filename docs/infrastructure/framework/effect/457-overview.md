## Overview

Effect comes equipped with five pre-built services:

```ts showLineNumbers=false
type DefaultServices = Clock | ConfigProvider | Console | Random | Tracer
```

When we employ these services, there's no need to explicitly provide their implementations. Effect automatically supplies live versions of these services to our effects, sparing us from manual setup.

**Example** (Using Clock and Console)

```ts twoslash
import { Effect, Clock, Console } from "effect"

//      ┌─── Effect<void, never, never>
//      ▼
const program = Effect.gen(function* () {
  const now = yield* Clock.currentTimeMillis
  yield* Console.log(`Application started at ${new Date(now)}`)
})

Effect.runFork(program)
// Output: Application started at <current time>
```

As you can observe, even if our program utilizes both `Clock` and `Console`, the `Requirements` parameter, representing the services required for the effect to execute, remains set to `never`.
Effect takes care of handling these services seamlessly for us.
