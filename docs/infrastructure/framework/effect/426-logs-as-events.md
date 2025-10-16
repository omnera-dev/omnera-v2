## Logs as events

In the context of tracing, logs are converted into "Span Events." These events offer structured insights into your application's activities and provide a timeline of when specific operations occurred.

```ts twoslash {47}
import { Effect } from "effect"
import { NodeSdk } from "@effect/opentelemetry"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor
} from "@opentelemetry/sdk-trace-base"

// Define a program that logs a message and delays for 100 milliseconds
const program = Effect.log("Hello").pipe(
  Effect.delay("100 millis"),
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
  traceId: 'b0f4f012b5b13c0a040f7002a1d7b020',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: 'b9ba8472002715a8',
  kind: 0,
  timestamp: 1733220905504162.2,
  duration: 103790,
  attributes: {},
  status: { code: 1 },
  events: [
    {
      name: 'Hello',
      attributes: { 'effect.fiberId': '#0', 'effect.logLevel': 'INFO' }, // Log attributes
      time: [ 1733220905, 607761042 ], // Event timestamp
      droppedAttributesCount: 0
    }
  ],
  links: []
}
*/
```

Each span can include events, which capture specific moments during the execution of a span. In this example, a log message `"Hello"` is recorded as an event within the span. Key details of the event include:

| Field                    | Description                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| `name`                   | The name of the event, which corresponds to the logged message (e.g., `'Hello'`).                 |
| `attributes`             | Key-value pairs that provide additional context about the event, such as `fiberId` and log level. |
| `time`                   | The timestamp of when the event occurred, shown in a high-precision format.                       |
| `droppedAttributesCount` | Indicates how many attributes were discarded, if any. In this case, no attributes were dropped.   |
