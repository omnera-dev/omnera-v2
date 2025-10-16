## Acquire Release

In this section, we'll explore an example that demonstrates the use of `Stream.acquireRelease` when working with file operations.

```ts twoslash
import { Stream, Console, Effect } from 'effect'

// Simulating File operations
const open = (filename: string) =>
  Effect.gen(function* () {
    yield* Console.log(`Opening ${filename}`)
    return {
      getLines: Effect.succeed(['Line 1', 'Line 2', 'Line 3']),
      close: Console.log(`Closing ${filename}`),
    }
  })

const stream = Stream.acquireRelease(open('file.txt'), (file) => file.close).pipe(
  Stream.flatMap((file) => file.getLines)
)

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
/*
Output:
Opening file.txt
Closing file.txt
{
  _id: "Chunk",
  values: [
    [ "Line 1", "Line 2", "Line 3" ]
  ]
}
*/
```

In this code snippet, we're simulating file operations using the `open` function. The `Stream.acquireRelease` function is employed to ensure that the file is correctly opened and closed, and we then process the lines of the file using the acquired resource.
