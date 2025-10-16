## Dropping

To remove elements from the beginning of a `Chunk`, use `Chunk.drop`, specifying the number of elements to discard.

**Example** (Dropping Elements from the Start)

```ts twoslash
import { Chunk } from "effect"

// Drops the first 2 elements from the Chunk
const chunk = Chunk.drop(Chunk.make(1, 2, 3, 4), 2)
```
