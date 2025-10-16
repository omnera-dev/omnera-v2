## Taking Elements

The "taking" operations in streams let you extract a specific set of elements, either by a fixed number, condition, or position within the stream. Here are a few ways to apply these operations:

| API         | Description                                           |
| ----------- | ----------------------------------------------------- |
| `take`      | Extracts a fixed number of elements.                  |
| `takeWhile` | Extracts elements while a certain condition is met.   |
| `takeUntil` | Extracts elements until a certain condition is met.   |
| `takeRight` | Extracts a specified number of elements from the end. |

**Example** (Extracting Elements in Different Ways)

```ts twoslash
import { Stream, Effect } from "effect"

const stream = Stream.iterate(0, (n) => n + 1)

// Using `take` to extract a fixed number of elements:
const s1 = Stream.take(stream, 5)
Effect.runPromise(Stream.runCollect(s1)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 0, 1, 2, 3, 4 ] }
*/

// Using `takeWhile` to extract elements while a condition is met:
const s2 = Stream.takeWhile(stream, (n) => n < 5)
Effect.runPromise(Stream.runCollect(s2)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 0, 1, 2, 3, 4 ] }
*/

// Using `takeUntil` to extract elements until a condition is met:
const s3 = Stream.takeUntil(stream, (n) => n === 5)
Effect.runPromise(Stream.runCollect(s3)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 0, 1, 2, 3, 4, 5 ] }
*/

// Using `takeRight` to take elements from the end of the stream:
const s4 = Stream.takeRight(s3, 3)
Effect.runPromise(Stream.runCollect(s4)).then(console.log)
/*
Output:
{ _id: 'Chunk', values: [ 3, 4, 5 ] }
*/
```
