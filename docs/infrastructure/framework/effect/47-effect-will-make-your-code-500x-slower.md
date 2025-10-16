## Effect will make your code 500x slower!

Effect does perform 500x slower if you are comparing:

```ts twoslash
const result = 1 + 1
```

to

```ts twoslash
import { Effect } from 'effect'

const result = Effect.runSync(Effect.zipWith(Effect.succeed(1), Effect.succeed(1), (a, b) => a + b))
```

The reason is one operation is optimized by the JIT compiler to be a direct CPU instruction and the other isn't.

In reality you'd never use Effect in such cases, Effect is an app-level library to tame concurrency, error handling, and much more!

You'd use Effect to coordinate your thunks of code, and you can build your thunks of code in the best perfoming manner as you see fit while still controlling execution through Effect.
