## Understanding Streams

Now, let's shift our focus to `Stream`. A `Stream` represents a program description that shares similarities with `Effect`, it requires a context of type `R`, may signal errors of type `E`, and yields values of type `A`. However, the key distinction is that it can yield **zero or more values**.

Here are the possible scenarios for a `Stream`:

- **An Empty Stream**: It can end up empty, representing a stream with no values.
- **A Single-Element Stream**: It can represent a stream with just one value.
- **A Finite Stream of Elements**: It can represent a stream with a finite number of values.
- **An Infinite Stream of Elements**: It can represent a stream that continues indefinitely, essentially an infinite stream.

Let's see these scenarios in action:

```ts twoslash
import { Stream } from "effect"

// An empty Stream
const emptyStream = Stream.empty

// A Stream with a single number
const oneNumberValueStream = Stream.succeed(3)

// A Stream with a range of numbers from 1 to 10
const finiteNumberStream = Stream.range(1, 10)

// An infinite Stream of numbers starting from 1 and incrementing
const infiniteNumberStream = Stream.iterate(1, (n) => n + 1)
```

In summary, a `Stream` is a versatile tool for representing programs that may yield multiple values, making it suitable for a wide range of tasks, from processing finite lists to handling infinite sequences.

# [Operations](https://effect.website/docs/stream/operations/)
