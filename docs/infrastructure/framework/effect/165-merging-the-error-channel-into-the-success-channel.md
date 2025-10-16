## Merging the Error Channel into the Success Channel

The `Effect.merge` function allows you to combine the error channel with the success channel. This results in an effect that never fails; instead, both successes and errors are handled as values in the success channel.

**Example** (Combining Error and Success Channels)

```ts twoslash
import { Effect } from 'effect'

//      ┌─── Effect<number, string, never>
//      ▼
const program = Effect.fail('Oh uh!').pipe(Effect.as(2))

//      ┌─── Effect<number | string, never, never>
//      ▼
const recovered = Effect.merge(program)
```
