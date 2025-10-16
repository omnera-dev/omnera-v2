## Nesting Spans

Spans can be nested to represent a hierarchy of operations. This allows you to track how different parts of your application relate to one another during execution. The following example demonstrates how to create and manage nested spans.

**Example** (Nesting Spans in a Trace)

```ts twoslash "a09e5c3fdfdbbc1d"
import { Effect } from 'effect'
import { NodeSdk } from '@effect/opentelemetry'
import { ConsoleSpanExporter, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'

const child = Effect.void.pipe(Effect.delay('100 millis'), Effect.withSpan('child'))

const parent = Effect.gen(function* () {
  yield* Effect.sleep('20 millis')
  yield* child
  yield* Effect.sleep('10 millis')
}).pipe(Effect.withSpan('parent'))

// Set up tracing with the OpenTelemetry SDK
const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: 'example' },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}))

// Run the effect, providing the tracing layer
Effect.runPromise(parent.pipe(Effect.provide(NodeSdkLive)))
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
  traceId: 'a9cd69ad70698a0c7b7b774597c77d39',
  parentId: 'a09e5c3fdfdbbc1d', // This indicates the span is a child of 'parent'
  traceState: undefined,
  name: 'child',
  id: '210d2f9b648389a4', // Unique ID for the child span
  kind: 0,
  timestamp: 1733220970590126.2,
  duration: 101579.875,
  attributes: {},
  status: { code: 1 },
  events: [],
  links: []
}
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
  traceId: 'a9cd69ad70698a0c7b7b774597c77d39',
  parentId: undefined, // Indicates this is the root span
  traceState: undefined,
  name: 'parent',
  id: 'a09e5c3fdfdbbc1d', // Unique ID for the parent span
  kind: 0,
  timestamp: 1733220970569015.2,
  duration: 132612.208,
  attributes: {},
  status: { code: 1 },
  events: [],
  links: []
}
*/
```

The parent-child relationship is evident in the span output, where the `parentId` of the `child` span matches the `id` of the `parent` span. This structure helps track how operations are related within a single trace.
