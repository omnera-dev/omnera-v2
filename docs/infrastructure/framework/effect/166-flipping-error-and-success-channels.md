## Flipping Error and Success Channels

The `Effect.flip` function allows you to switch the error and success channels of an effect. This means that what was previously a success becomes the error, and vice versa.

**Example** (Swapping Error and Success Channels)

```ts twoslash
import { Effect } from "effect"

//      ┌─── Effect<number, string, never>
//      ▼
const program = Effect.fail("Oh uh!").pipe(Effect.as(2))

//      ┌─── Effect<string, number, never>
//      ▼
const flipped = Effect.flip(program)
```

# [Fallback](https://effect.website/docs/error-management/fallback/)
