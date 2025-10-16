## Debouncing

Debouncing is a technique used to prevent a function from firing too frequently, which is particularly useful when a stream emits values rapidly but only the last value after a pause is needed.

The `Stream.debounce` function achieves this by delaying the emission of values until a specified time period has passed without any new values. If a new value arrives during the waiting period, the timer resets, and only the latest value will eventually be emitted after a pause.

**Example** (Debouncing a Stream of Rapidly Emitted Values)

```ts twoslash
import { Stream, Effect } from 'effect'

// Helper function to log with elapsed time since the last log
let last = Date.now()
const log = (message: string) =>
  Effect.sync(() => {
    const end = Date.now()
    console.log(`${message} after ${end - last}ms`)
    last = end
  })

const stream = Stream.make(1, 2, 3).pipe(
  // Emit the value 4 after 200 ms
  Stream.concat(Stream.fromEffect(Effect.sleep('200 millis').pipe(Effect.as(4)))),
  // Continue with more rapid values
  Stream.concat(Stream.make(5, 6)),
  // Emit 7 after 150 ms
  Stream.concat(Stream.fromEffect(Effect.sleep('150 millis').pipe(Effect.as(7)))),
  Stream.concat(Stream.make(8)),
  Stream.tap((n) => log(`Received ${n}`)),
  // Only emit values after a pause of at least 100 milliseconds
  Stream.debounce('100 millis'),
  Stream.tap((n) => log(`> Emitted ${n}`))
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Example Output:
Received 1 after 5ms
Received 2 after 2ms
Received 3 after 0ms
> Emitted 3 after 104ms
Received 4 after 99ms
Received 5 after 1ms
Received 6 after 0ms
> Emitted 6 after 101ms
Received 7 after 50ms
Received 8 after 1ms
> Emitted 8 after 101ms
{ _id: 'Chunk', values: [ 3, 6, 8 ] }
*/
```
