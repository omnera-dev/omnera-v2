## Awaiting

To retrieve a value from a deferred, you can use `Deferred.await`. This operation suspends the calling fiber until the deferred is completed with a value or an error.

```ts twoslash
import { Effect, Deferred } from 'effect'

//      ┌─── Effect<Deferred<string, Error>, never, never>
//      ▼
const deferred = Deferred.make<string, Error>()

//      ┌─── Effect<string, Error, never>
//      ▼
const value = deferred.pipe(Effect.andThen(Deferred.await))
```
