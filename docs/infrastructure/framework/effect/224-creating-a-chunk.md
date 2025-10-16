## Creating a Chunk

### empty

Create an empty `Chunk` with `Chunk.empty`.

**Example** (Creating an Empty Chunk)

```ts twoslash
import { Chunk } from "effect"

//      ┌─── Chunk<number>
//      ▼
const chunk = Chunk.empty<number>()
```

### make

To create a `Chunk` with specific values, use `Chunk.make(...values)`. Note that the resulting chunk is typed as non-empty.

**Example** (Creating a Non-Empty Chunk)

```ts twoslash
import { Chunk } from "effect"

//      ┌─── NonEmptyChunk<number>
//      ▼
const chunk = Chunk.make(1, 2, 3)
```

### fromIterable

You can create a `Chunk` by providing a collection, either from an iterable or directly from an array.

**Example** (Creating a Chunk from an Iterable)

```ts twoslash
import { Chunk, List } from "effect"

const fromArray = Chunk.fromIterable([1, 2, 3])

const fromList = Chunk.fromIterable(List.make(1, 2, 3))
```

<Aside type="caution" title="Performance Consideration">
  `Chunk.fromIterable` creates a new copy of the iterable's elements. For
  large data sets or repeated use, this cloning process can impact
  performance.
</Aside>

### unsafeFromArray

`Chunk.unsafeFromArray` creates a `Chunk` directly from an array without cloning. This approach can improve performance by avoiding the overhead of copying data but requires caution, as it bypasses the usual immutability guarantees.

**Example** (Directly Creating a Chunk from an Array)

```ts twoslash
import { Chunk } from "effect"

const chunk = Chunk.unsafeFromArray([1, 2, 3])
```

<Aside type="caution" title="Risk of Mutable Data">
  Using `Chunk.unsafeFromArray` can lead to unexpected behavior if the
  original array is modified after the chunk is created. For safer,
  immutable behavior, use `Chunk.fromIterable` instead.
</Aside>
