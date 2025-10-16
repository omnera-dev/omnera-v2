## Adapting Sink Input

At times, you may have a sink that works with one type of input, but your current stream uses a different type. The `Sink.mapInput` function helps you adapt your sink to a new input type by transforming the input values. While `Sink.map` changes the sink's output, `Sink.mapInput` changes the input it accepts.

**Example** (Converting String Input to Numeric for Summing)

Suppose you have a `Sink.sum` that calculates the sum of numbers. If your stream contains strings rather than numbers, `Sink.mapInput` can convert those strings into numbers, allowing `Sink.sum` to work with your stream:

```ts twoslash
import { Stream, Sink, Effect } from 'effect'

// A stream of numeric strings
const stream = Stream.make('1', '2', '3', '4', '5')

// Define a sink for summing numeric values
const numericSum = Sink.sum

// Use mapInput to adapt the sink, converting strings to numbers
const stringSum = numericSum.pipe(Sink.mapInput((s: string) => Number.parseFloat(s)))

Effect.runPromise(Stream.run(stream, stringSum)).then(console.log)
// Output: 15
```
