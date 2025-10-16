## Interspersing

Interspersing adds separators or affixes in a stream, useful for formatting or structuring data in streams.

### intersperse

The `Stream.intersperse` operator inserts a specified delimiter element between each pair of elements in a stream. This delimiter can be any chosen value and is added between each consecutive pair.

**Example** (Inserting Delimiters Between Stream Elements)

```ts twoslash
import { Stream, Effect } from 'effect'

// Create a stream of numbers and intersperse `0` between them
const stream = Stream.make(1, 2, 3, 4, 5).pipe(Stream.intersperse(0))

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: 'Chunk',
  values: [
    1, 0, 2, 0, 3,
    0, 4, 0, 5
  ]
}
*/
```

### intersperseAffixes

For more complex needs, `Stream.intersperseAffixes` provides control over different affixes at the start, between elements, and at the end of the stream.

**Example** (Adding Affixes to a Stream)

```ts twoslash
import { Stream, Effect } from 'effect'

// Create a stream and add affixes:
// - `[` at the start
// - `|` between elements
// - `]` at the end
const stream = Stream.make(1, 2, 3, 4, 5).pipe(
  Stream.intersperseAffixes({
    start: '[',
    middle: '|',
    end: ']',
  })
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
{
  _id: 'Chunk',
  values: [
    '[', 1,   '|', 2,   '|',
    3,   '|', 4,   '|', 5,
    ']'
  ]
}
*/
```
