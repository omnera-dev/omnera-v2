## Converting

Convert a `Chunk` to a `ReadonlyArray` using `Chunk.toReadonlyArray`. The resulting type varies based on the `Chunk`'s contents, distinguishing between empty, non-empty, and generic chunks.

**Example** (Converting a Chunk to a ReadonlyArray)

```ts twoslash
import { Chunk } from 'effect'

//      ┌─── readonly [number, ...number[]]
//      ▼
const nonEmptyArray = Chunk.toReadonlyArray(Chunk.make(1, 2, 3))

//      ┌─── readonly never[]
//      ▼
const emptyArray = Chunk.toReadonlyArray(Chunk.empty())

declare const chunk: Chunk.Chunk<number>

//      ┌─── readonly number[]
//      ▼
const array = Chunk.toReadonlyArray(chunk)
```

# [Data](https://effect.website/docs/data-types/data/)
