## Printing Spans

To print spans for debugging or analysis, you'll need to install the required tracing tools. Here’s how to set them up for your project.

### Installing Dependencies

Choose your package manager and install the necessary libraries:

   <Tabs syncKey="package-manager">

   <TabItem label="npm" icon="seti:npm">

```sh showLineNumbers=false
# Install the main library for integrating OpenTelemetry with Effect
npm install @effect/opentelemetry

# Install the required OpenTelemetry SDKs for tracing and metrics
npm install @opentelemetry/sdk-trace-base
npm install @opentelemetry/sdk-trace-node
npm install @opentelemetry/sdk-trace-web
npm install @opentelemetry/sdk-metrics
```

   </TabItem>

   <TabItem label="pnpm" icon="pnpm">

```sh showLineNumbers=false
# Install the main library for integrating OpenTelemetry with Effect
pnpm add @effect/opentelemetry

# Install the required OpenTelemetry SDKs for tracing and metrics
pnpm add @opentelemetry/sdk-trace-base
pnpm add @opentelemetry/sdk-trace-node
pnpm add @opentelemetry/sdk-trace-web
pnpm add @opentelemetry/sdk-metrics
```

   </TabItem>

   <TabItem label="Yarn" icon="seti:yarn">

```sh showLineNumbers=false
# Install the main library for integrating OpenTelemetry with Effect
yarn add @effect/opentelemetry

# Install the required OpenTelemetry SDKs for tracing and metrics
yarn add @opentelemetry/sdk-trace-base
yarn add @opentelemetry/sdk-trace-node
yarn add @opentelemetry/sdk-trace-web
yarn add @opentelemetry/sdk-metrics
```

   </TabItem>

   <TabItem label="Bun" icon="bun">

```sh showLineNumbers=false
# Install the main library for integrating OpenTelemetry with Effect
bun add @effect/opentelemetry

# Install the required OpenTelemetry SDKs for tracing and metrics
bun add @opentelemetry/sdk-trace-base
bun add @opentelemetry/sdk-trace-node
bun add @opentelemetry/sdk-trace-web
bun add @opentelemetry/sdk-metrics
```

   </TabItem>

   </Tabs>

<Aside type="note" title="Peer Dependency">
  The `@opentelemetry/api` package is a peer dependency of
  `@effect/opentelemetry`. If your package manager does not automatically
  install peer dependencies, you must add it manually.
</Aside>

### Printing a Span to the Console

Once the dependencies are installed, you can set up span printing using OpenTelemetry. Here's an example showing how to print a span for an effect.

**Example** (Setting Up and Printing a Span)

```ts twoslash
import { Effect } from "effect"
import { NodeSdk } from "@effect/opentelemetry"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor
} from "@opentelemetry/sdk-trace-base"

// Define an effect that delays for 100 milliseconds
const program = Effect.void.pipe(Effect.delay("100 millis"))

// Instrument the effect with a span for tracing
const instrumented = program.pipe(Effect.withSpan("myspan"))

// Set up tracing with the OpenTelemetry SDK
const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  // Export span data to the console
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

// Run the effect, providing the tracing layer
Effect.runPromise(instrumented.pipe(Effect.provide(NodeSdkLive)))
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
  traceId: '673c06608bd815f7a75bf897ef87e186',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: '401b2846170cd17b',
  kind: 0,
  timestamp: 1733220735529855.5,
  duration: 102079.958,
  attributes: {},
  status: { code: 1 },
  events: [],
  links: []
}
*/
```

### Understanding the Span Output

The output provides detailed information about the span:

| Field        | Description                                                                                                                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `traceId`    | A unique identifier for the entire trace, helping trace requests or operations as they move through an application.                                                                                            |
| `parentId`   | Identifies the parent span of the current span, marked as `undefined` in the output when there is no parent span, making it a root span.                                                                       |
| `name`       | Describes the name of the span, indicating the operation being tracked (e.g., "myspan").                                                                                                                       |
| `id`         | A unique identifier for the current span, distinguishing it from other spans within a trace.                                                                                                                   |
| `timestamp`  | A timestamp representing when the span started, measured in microseconds since the Unix epoch.                                                                                                                 |
| `duration`   | Specifies the duration of the span, representing the time taken to complete the operation (e.g., `2895.769` microseconds).                                                                                     |
| `attributes` | Spans may contain attributes, which are key-value pairs providing additional context or information about the operation. In this output, it's an empty object, indicating no specific attributes in this span. |
| `status`     | The status field provides information about the span's status. In this case, it has a code of 1, which typically indicates an OK status (whereas a code of 2 signifies an ERROR status)                        |
| `events`     | Spans can include events, which are records of specific moments during the span's lifecycle. In this output, it's an empty array, suggesting no specific events recorded.                                      |
| `links`      | Links can be used to associate this span with other spans in different traces. In the output, it's an empty array, indicating no specific links for this span.                                                 |

### Span Capturing an Error

Here's how a span looks when the effect encounters an error:

**Example** (Span for an Effect that Fails)

```ts twoslash "code: 2"
import { Effect } from "effect"
import { NodeSdk } from "@effect/opentelemetry"
import {
  ConsoleSpanExporter,
  BatchSpanProcessor
} from "@opentelemetry/sdk-trace-base"

const program = Effect.fail("Oh no!").pipe(
  Effect.delay("100 millis"),
  Effect.withSpan("myspan")
)

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

Effect.runPromiseExit(program.pipe(Effect.provide(NodeSdkLive))).then(
  console.log
)
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
  traceId: 'eee9619866179f209b7aae277283e71f',
  parentId: undefined,
  traceState: undefined,
  name: 'myspan',
  id: '3a5725c91884c9e1',
  kind: 0,
  timestamp: 1733220830575626,
  duration: 106578.042,
  attributes: {
    'code.stacktrace': 'at <anonymous> (/Users/giuliocanti/Documents/GitHub/website/content/dev/index.ts:10:10)'
  },
  status: { code: 2, message: 'Oh no!' },
  events: [
    {
      name: 'exception',
      attributes: {
        'exception.type': 'Error',
        'exception.message': 'Oh no!',
        'exception.stacktrace': 'Error: Oh no!'
      },
      time: [ 1733220830, 682204083 ],
      droppedAttributesCount: 0
    }
  ],
  links: []
}
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Oh no!' }
}
*/
```

In this example, the span's status code is `2`, indicating an error. The message in the status provides more details about the failure.
