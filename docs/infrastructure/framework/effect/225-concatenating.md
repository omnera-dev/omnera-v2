## Concatenating

To combine two `Chunk` instances into one, use `Chunk.appendAll`.

**Example** (Combining Two Chunks into One)

```ts twoslash
import { Chunk } from 'effect'

// Concatenate two chunks with different types of elements
//
//      ┌─── NonEmptyChunk<string | number>
//      ▼
const chunk = Chunk.appendAll(Chunk.make(1, 2), Chunk.make('a', 'b'))

console.log(chunk)
/*
Output:
{ _id: 'Chunk', values: [ 1, 2, 'a', 'b' ] }
*/
```
