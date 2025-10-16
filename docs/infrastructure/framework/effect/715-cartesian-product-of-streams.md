## Cartesian Product of Streams

The Stream module includes a feature for computing the _Cartesian Product_ of two streams, allowing you to create combinations of elements from two different streams. This is helpful when you need to pair each element from one set with every element of another.

In simple terms, imagine you have two collections and want to form all possible pairs by picking one item from each. This pairing process is the Cartesian Product. In streams, this operation generates a new stream that includes every possible pairing of elements from the two input streams.

To create a Cartesian Product of two streams, the `Stream.cross` operator is available, along with similar variants. These operators combine two streams into a new stream of all possible element combinations.

**Example** (Creating a Cartesian Product of Two Streams)

```ts twoslash
import { Stream, Effect, Console } from 'effect'

const s1 = Stream.make(1, 2, 3).pipe(Stream.tap(Console.log))
const s2 = Stream.make('a', 'b').pipe(Stream.tap(Console.log))

const cartesianProduct = Stream.cross(s1, s2)

Effect.runPromise(Stream.runCollect(cartesianProduct)).then(console.log)
/*
Output:
1
a
b
2
a
b
3
a
b
{
  _id: 'Chunk',
  values: [
    [ 1, 'a' ],
    [ 1, 'b' ],
    [ 2, 'a' ],
    [ 2, 'b' ],
    [ 3, 'a' ],
    [ 3, 'b' ]
  ]
}
*/
```

<Aside type="caution" title="Multiple Iterations of Right Stream">
  Note that the right-hand stream (`s2` in this example) will be iterated
  over multiple times, once for each element in the left-hand stream
  (`s1`). If the right-hand stream involves expensive or
  side-effect-producing operations, those will be executed repeatedly.
</Aside>
