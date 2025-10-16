## Folding

### Folding Left

If you want to reduce a stream into a single cumulative value by applying an operation to each element in sequence, you can use the `Sink.foldLeft` function.

**Example** (Summing Elements in a Stream Using Fold Left)

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4)

Effect.runPromise(
  Stream.run(
    stream,
    // Use foldLeft to sequentially add each element, starting with 0
    Sink.foldLeft(0, (a, b) => a + b)
  )
).then(console.log)
// Output: 10
```

### Folding with Termination

Sometimes, you may want to fold elements in a stream but stop the process once a specific condition is met. This is known as "short-circuiting." You can accomplish this with the `Sink.fold` function, which lets you define a termination condition.

**Example** (Folding with a Condition to Stop Early)

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const stream = Stream.iterate(0, (n) => n + 1)

Effect.runPromise(
  Stream.run(
    stream,
    Sink.fold(
      0, // Initial value
      (sum) => sum <= 10, // Termination condition
      (a, b) => a + b // Folding operation
    )
  )
).then(console.log)
// Output: 15
```

### Folding Until a Limit

To accumulate elements until a specific count is reached, use `Sink.foldUntil`. This sink folds elements up to the specified limit and then stops.

**Example** (Accumulating a Set Number of Elements)

```ts twoslash
import { Stream, Sink, Effect } from "effect"

const stream = Stream.make(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

Effect.runPromise(
  Stream.run(
    stream,
    // Fold elements, stopping after accumulating 3 values
    Sink.foldUntil(0, 3, (a, b) => a + b)
  )
).then(console.log)
// Output: 6
```

### Folding with Weighted Elements

In some scenarios, you may want to fold elements based on a defined "weight" or "cost," accumulating elements until a specified maximum cost is reached. You can accomplish this with `Sink.foldWeighted`.

**Example** (Accumulating Elements Based on Weight)

In the example below, each element has a weight of `1`, and the folding resets when the accumulated weight hits `3`.

```ts twoslash
import { Stream, Sink, Chunk, Effect } from "effect"

const stream = Stream.make(3, 2, 4, 1, 5, 6, 2, 1, 3, 5, 6).pipe(
  Stream.transduce(
    Sink.foldWeighted({
      initial: Chunk.empty<number>(), // Initial empty Chunk
      maxCost: 3, // Maximum accumulated cost
      cost: () => 1, // Each element has a weight of 1
      body: (acc, el) => Chunk.append(acc, el) // Append element to the Chunk
    })
  )
)

Effect.runPromise(Stream.runCollect(stream)).then((chunk) =>
  console.log("%o", chunk)
)
/*
Output:
{
  _id: 'Chunk',
  values: [
    { _id: 'Chunk', values: [ 3, 2, 4, [length]: 3 ] },
    { _id: 'Chunk', values: [ 1, 5, 6, [length]: 3 ] },
    { _id: 'Chunk', values: [ 2, 1, 3, [length]: 3 ] },
    { _id: 'Chunk', values: [ 5, 6, [length]: 2 ] },
    [length]: 4
  ]
}
*/
```

# [Introduction](https://effect.website/docs/sink/introduction/)
