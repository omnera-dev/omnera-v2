## Gauge

In the world of metrics, a Gauge is a metric that represents a single numerical value that can be set or adjusted. Think of it as a dynamic variable that can change over time. One common use case for a gauge is to monitor something like the current memory usage of your application.

Unlike counters, where we're interested in cumulative values over time, with gauges, our focus is on the current value at a specific point in time.

Gauges are the best choice when you want to monitor values that can both increase and decrease, and you're not interested in tracking their rates of change. In other words, gauges help us measure things that have a specific value at a particular moment.

Some typical use cases for gauges include:

- **Memory Usage**: Keeping an eye on how much memory your application is using right now.
- **Queue Size**: Monitoring the current size of a queue where tasks are waiting to be processed.
- **In-Progress Request Counts**: Tracking the number of requests currently being handled by your server.
- **Temperature**: Measuring the current temperature, which can fluctuate up and down.

### How to Create a Gauge

To create a gauge, you can use the `Metric.gauge` constructor.

**Example** (Creating a Gauge)

```ts twoslash
import { Metric } from "effect"

const memory = Metric.gauge("memory_usage", {
  // Optional
  description: "A gauge for memory usage"
})
```

Once created, a gauge can be updated by passing an effect that produces the value you want to set for the gauge.

**Example** (Using a Gauge)

```ts twoslash
import { Metric, Effect, Random } from "effect"

// Create a gauge to track temperature
const temperature = Metric.gauge("temperature")

// Simulate fetching a random temperature
const getTemperature = Effect.gen(function* () {
  // Get a random temperature between -10 and 10
  const t = yield* Random.nextIntBetween(-10, 10)
  console.log(`new temperature: ${t}`)
  return t
})

// Program that updates the gauge multiple times
const program = Effect.gen(function* () {
  const series: Array<number> = []
  // Update the gauge with new temperature readings
  series.push(yield* temperature(getTemperature))
  series.push(yield* temperature(getTemperature))
  series.push(yield* temperature(getTemperature))

  // Retrieve the current state of the gauge
  const state = yield* Metric.value(temperature)
  console.log(state)

  return series
})

Effect.runPromise(program).then(console.log)
/*
Example Output:
new temperature: 9
new temperature: -9
new temperature: 2
GaugeState {
  value: 2, // the most recent value set in the gauge
  ...
}
[ 9, -9, 2 ]
*/
```

<Aside type="note" title="Gauge Behavior">
  Gauges capture the most recent value set, so if you're tracking a
  sequence of updates, the final state will show only the last recorded
  value, not the entire series.
</Aside>

### Gauge Types

You can specify whether the gauge tracks a `number` or `bigint`.

```ts twoslash
import { Metric } from "effect"

const numberGauge = Metric.gauge("memory_usage", {
  description: "A gauge for memory usage"
  // bigint: false // default
})

const bigintGauge = Metric.gauge("cpu_load", {
  description: "A gauge for CPU load",
  bigint: true
})
```
