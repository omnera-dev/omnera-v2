## Creating Spans

You can add tracing to an effect by creating a span using the `Effect.withSpan` API. This helps you track specific operations within the effect.

**Example** (Adding a Span to an Effect)

```ts twoslash
import { Effect } from 'effect'

// Define an effect that delays for 100 milliseconds
const program = Effect.void.pipe(Effect.delay('100 millis'))

// Instrument the effect with a span for tracing
const instrumented = program.pipe(Effect.withSpan('myspan'))
```

Instrumenting an effect with a span does not change its type. If you start with an `Effect<A, E, R>`, the result remains an `Effect<A, E, R>`.
