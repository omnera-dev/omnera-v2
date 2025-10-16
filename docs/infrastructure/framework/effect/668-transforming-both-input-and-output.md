## Transforming Both Input and Output

When you need to transform both the input and output of a sink, `Sink.dimap` provides a flexible solution. It extends `mapInput` by allowing you to transform the input type, perform the operation, and then transform the output to a new type. This can be useful for complete conversions between input and output types.

**Example** (Converting Input to Integer, Summing, and Converting Output to String)

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

// A stream of numeric strings
const stream = Stream.make('1', '2', '3', '4', '5')

// Convert string inputs to numbers, sum them,
// then convert the result to a string
const sumSink = Sink.dimap(Sink.sum, {
  // Transform input: string to number
  onInput: (s: string) => Number.parseFloat(s),
  // Transform output: number to string
  onDone: (n) => String(n),
})

Effect.runPromise(Stream.run(stream, sumSink)).then(console.log)
// Output: "15"
```
