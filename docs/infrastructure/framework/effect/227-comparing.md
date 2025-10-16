## Comparing

To check if two `Chunk` instances are equal, use [`Equal.equals`](/docs/trait/equal/). This function compares the contents of each `Chunk` for structural equality.

**Example** (Comparing Two Chunks)

```ts twoslash
import { Chunk, Equal } from "effect"

const chunk1 = Chunk.make(1, 2)
const chunk2 = Chunk.make(1, 2, 3)

console.log(Equal.equals(chunk1, chunk1))
// Output: true

console.log(Equal.equals(chunk1, chunk2))
// Output: false

console.log(Equal.equals(chunk1, Chunk.make(1, 2)))
// Output: true
```
