## Adding Annotations

You can provide extra information to a span by utilizing the `Effect.annotateCurrentSpan` function.
This function allows you to attach key-value pairs, offering more context about the execution of the span.

**Example** (Annotating a Span)

```ts twoslash "attributes: { key: 'value' }"
import { Effect } from "effect"
import { NodeSdk } from "@effect/opentelemetry"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor
} from "@opentelemetry/sdk-trace-base"

const program = Effect.void.pipe(
  Effect.delay("100 millis"),
  // Annotate the span with a key-value pair
  Effect.tap(() => Effect.annotateCurrentSpan("key", "value")),
  // Wrap the effect in a span named 'myspan'
  Effect.withSpan("myspan")
)

// Set up tracing with the OpenTelemetry SDK
const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

// Run the effect, providing the tracing layer
Effect.runPromise(program.pipe(Effect.provide(NodeSdkLive)))
/*
Example Output:
{
  resource: {
    attributes: {
      'service.name': 'example',
      'telemetry.sdk.language': 'nodejs',
      'telemetry.sdk.name': '@effect/opentelemetry',
      'telemetry.sdk.version': '1.28.0'
    }
  },
  instrumentationScope: { name: 'example', version: undefined, schemaUrl: undefined },
  traceId: 'c8120e01c0f1ea83ccc1d388e5cdebd3',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: '81c430ba4979f1db',
  kind: 0,
  timestamp: 1733220874356084,
  duration: 102821.417,
  attributes: { key: 'value' },
  status: { code: 1 },
  events: [],
  links: []
}
*/
```
