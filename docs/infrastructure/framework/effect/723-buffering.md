## Buffering

Effect streams use a pull-based model, allowing downstream consumers to control the rate at which they request elements. However, when there's a mismatch in the speed between the producer and the consumer, buffering can help balance their interaction. The `Stream.buffer` operator is designed to manage this, allowing the producer to keep working even if the consumer is slower. You can set a maximum buffer capacity using the `capacity` option.

### buffer

The `Stream.buffer` operator queues elements to allow the producer to work independently from the consumer, up to a specified capacity. This helps when a faster producer and a slower consumer need to operate smoothly without blocking each other.

**Example** (Using a Buffer to Handle Speed Mismatch)

```ts twoslash
import { Stream, Console, Schedule, Effect } from 'effect'

const stream = Stream.range(1, 10).pipe(
  // Log each element before buffering
  Stream.tap((n) => Console.log(`before buffering: ${n}`)),
  // Buffer with a capacity of 4 elements
  Stream.buffer({ capacity: 4 }),
  // Log each element after buffering
  Stream.tap((n) => Console.log(`after buffering: ${n}`)),
  // Add a 5-second delay between each emission
  Stream.schedule(Schedule.spaced('5 seconds'))
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
before buffering: 1
before buffering: 2
before buffering: 3
before buffering: 4
before buffering: 5
before buffering: 6
after buffering: 1
after buffering: 2
before buffering: 7
after buffering: 3
before buffering: 8
after buffering: 4
before buffering: 9
after buffering: 5
before buffering: 10
...
*/
```

Different buffering options let you tailor the buffering strategy based on your use case:

| **Buffering Type**  | **Configuration**                            | **Description**                                               |
| ------------------- | -------------------------------------------- | ------------------------------------------------------------- |
| **Bounded Queue**   | `{ capacity: number }`                       | Limits the queue to a fixed size.                             |
| **Unbounded Queue** | `{ capacity: "unbounded" }`                  | Allows an unlimited number of buffered items.                 |
| **Sliding Queue**   | `{ capacity: number, strategy: "sliding" }`  | Keeps the most recent items, discarding older ones when full. |
| **Dropping Queue**  | `{ capacity: number, strategy: "dropping" }` | Keeps the earliest items, discarding new ones when full.      |
