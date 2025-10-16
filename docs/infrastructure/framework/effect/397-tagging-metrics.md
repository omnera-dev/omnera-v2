## Tagging Metrics

Tags are key-value pairs you can add to metrics to provide additional context. They help categorize and filter metrics, making it easier to analyze specific aspects of your application's performance or behavior.

When creating metrics, you can add tags to them. Tags are key-value pairs that provide additional context, helping in categorizing and filtering metrics. This makes it easier to analyze and monitor specific aspects of your application.

### Tagging a Specific Metric

You can tag individual metrics using the `Metric.tagged` function.
This allows you to add specific tags to a single metric, providing detailed context without applying tags globally.

**Example** (Tagging an Individual Metric)

```ts twoslash
import { Metric } from 'effect'

// Create a counter metric for request count
// and tag it with "environment: production"
const counter = Metric.counter('request_count').pipe(Metric.tagged('environment', 'production'))
```

Here, the `request_count` metric is tagged with `"environment": "production"`, allowing you to filter or analyze metrics by this tag later.

### Tagging Multiple Metrics

You can use `Effect.tagMetrics` to apply tags to all metrics within the same context. This is useful when you want to apply common tags, like the environment (e.g., "production" or "development"), across multiple metrics.

**Example** (Tagging Multiple Metrics)

```ts twoslash
import { Metric, Effect } from 'effect'

// Create two separate counters
const counter1 = Metric.counter('counter1')
const counter2 = Metric.counter('counter2')

// Define a task that simulates some work with a slight delay
const task = Effect.succeed(1).pipe(Effect.delay('100 millis'))

// Apply the environment tag to both counters in the same context
Effect.gen(function* () {
  yield* counter1(task)
  yield* counter2(task)
}).pipe(Effect.tagMetrics('environment', 'production'))
```

If you only want to apply tags within a specific [scope](/docs/resource-management/scope/), you can use `Effect.tagMetricsScoped`. This limits the tag application to metrics within that scope, allowing for more precise tagging control.

# [Getting Started with Micro](https://effect.website/docs/micro/new-users/)
