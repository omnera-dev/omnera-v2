## Integrations

### Sentry

To send span data directly to Sentry for analysis, replace the default span processor with Sentry's implementation. This allows you to use Sentry as a backend for tracing and debugging.

**Example** (Configuring Sentry for Tracing)

```ts twoslash
import { NodeSdk } from "@effect/opentelemetry"
import { SentrySpanProcessor } from "@sentry/opentelemetry"

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "example" },
  spanProcessor: new SentrySpanProcessor()
}))
```

# [Command](https://effect.website/docs/platform/command/)
