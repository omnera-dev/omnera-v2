## Using a Fold Operation

The `Stream.fold` function is another way to consume a stream by performing a fold operation over the stream of values and returning an effect containing the result. Here are a couple of examples:

```ts twoslash
import { Stream, Effect } from 'effect'

const foldedStream = Stream.make(1, 2, 3, 4, 5).pipe(Stream.runFold(0, (a, b) => a + b))

Effect.runPromise(foldedStream).then(console.log)
// Output: 15

const foldedWhileStream = Stream.make(1, 2, 3, 4, 5).pipe(
  Stream.runFoldWhile(
    0,
    (n) => n <= 3,
    (a, b) => a + b
  )
)

Effect.runPromise(foldedWhileStream).then(console.log)
// Output: 6
```

In the first example (`foldedStream`), we use `Stream.runFold` to calculate the sum of all elements. In the second example (`foldedWhileStream`), we use `Stream.runFoldWhile` to calculate the sum but only until a certain condition is met.
