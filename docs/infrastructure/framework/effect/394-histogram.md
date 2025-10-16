## Histogram

A Histogram is a metric used to analyze how numerical values are distributed over time. Instead of focusing on individual data points, a histogram groups values into predefined ranges, called **buckets**, and tracks how many values fall into each range.

When a value is recorded, it gets assigned to one of the histogram's buckets based on its range. Each bucket has an upper boundary, and the count for that bucket is increased if the value is less than or equal to its boundary. Once recorded, the individual value is discarded, and the focus shifts to how many values have fallen into each bucket.

Histograms also track:

- **Total Count**: The number of values that have been observed.
- **Sum**: The sum of all the observed values.
- **Min**: The smallest observed value.
- **Max**: The largest observed value.

Histograms are especially useful for calculating percentiles, which can help you estimate specific points in a dataset by analyzing how many values are in each bucket.

This concept is inspired by [Prometheus](https://prometheus.io/docs/concepts/metric_types#histogram), a well-known monitoring and alerting toolkit.

Histograms are particularly useful in performance analysis and system monitoring. By examining how response times, latencies, or other metrics are distributed, you can gain valuable insights into your system's behavior. This data helps you identify outliers, performance bottlenecks, or trends that may require optimization.

Common use cases for histograms include:

- **Percentile Estimation**: Histograms allow you to approximate percentiles of observed values, like the 95th percentile of response times.
- **Known Ranges**: If you can estimate the range of values in advance, histograms can organize the data into predefined buckets for better analysis.
- **Performance Metrics**: Use histograms to track metrics like request latencies, memory usage, or throughput over time.
- **Aggregation**: Histograms can be aggregated across multiple instances, making them ideal for distributed systems where you need to collect data from different sources.

<Aside type="note" title="Histogram Buckets and Precision">
  Keep in mind that histograms don't retain exact values. Instead, they
  group values into buckets, so the precision of your data depends on how
  you define these buckets.
</Aside>

**Example** (Histogram With Linear Buckets)

In this example, we define a histogram with linear buckets, where the values range from `0` to `100` in increments of `10`. Additionally, we include a final bucket for values greater than `100`, referred to as the "Infinity" bucket. This configuration is useful for tracking numeric values, like request latencies, within specific ranges.

The program generates random numbers between `1` and `120`, records them in the histogram, and then prints the histogram's state, showing the count of values that fall into each bucket.

```ts twoslash
import { Effect, Metric, MetricBoundaries, Random } from "effect"

// Define a histogram to track request latencies, with linear buckets
const latency = Metric.histogram(
  "request_latency",
  // Buckets from 0-100, with an extra Infinity bucket
  MetricBoundaries.linear({ start: 0, width: 10, count: 11 }),
  // Optional
  "Measures the distribution of request latency."
)

const program = Effect.gen(function* () {
  // Generate 100 random values and record them in the histogram
  yield* latency(Random.nextIntBetween(1, 120)).pipe(Effect.repeatN(99))

  // Fetch and display the histogram's state
  const state = yield* Metric.value(latency)
  console.log(state)
})

Effect.runPromise(program)
/*
Example Output:
HistogramState {
  buckets: [
    [ 0, 0 ],    // No values in the 0-10 range
    [ 10, 7 ],   // 7 values in the 10-20 range
    [ 20, 11 ],  // 11 values in the 20-30 range
    [ 30, 20 ],  // 20 values in the 30-40 range
    [ 40, 27 ],  // and so on...
    [ 50, 38 ],
    [ 60, 53 ],
    [ 70, 64 ],
    [ 80, 73 ],
    [ 90, 84 ],
    [ Infinity, 100 ] // All 100 values have been recorded
  ],
  count: 100,  // Total count of observed values
  min: 1,      // Smallest observed value
  max: 119,    // Largest observed value
  sum: 5980,   // Sum of all observed values
  ...
}
*/
```

### Timer Metric

In this example, we demonstrate how to use a timer metric to track the duration of specific workflows. The timer captures how long certain tasks take to execute, storing this information in a histogram, which provides insights into the distribution of these durations.

We generate random values to simulate varying wait times, record the durations in the timer, and then print out the histogram's state.

**Example** (Tracking Workflow Durations with a Timer Metric)

```ts twoslash
import { Metric, Array, Random, Effect } from "effect"

// Create a timer metric with predefined boundaries from 1 to 10
const timer = Metric.timerWithBoundaries("timer", Array.range(1, 10))

// Define a task that simulates random wait times
const task = Effect.gen(function* () {
  // Generate a random value between 1 and 10
  const n = yield* Random.nextIntBetween(1, 10)
  // Simulate a delay based on the random value
  yield* Effect.sleep(`${n} millis`)
})

const program = Effect.gen(function* () {
  // Track the duration of the task and repeat it 100 times
  yield* Metric.trackDuration(task, timer).pipe(Effect.repeatN(99))

  // Retrieve and print the current state of the timer histogram
  const state = yield* Metric.value(timer)
  console.log(state)
})

Effect.runPromise(program)
/*
Example Output:
HistogramState {
  buckets: [
    [ 1, 3 ],   // 3 tasks completed in <= 1 ms
    [ 2, 13 ],  // 13 tasks completed in <= 2 ms
    [ 3, 17 ],  // and so on...
    [ 4, 26 ],
    [ 5, 35 ],
    [ 6, 43 ],
    [ 7, 53 ],
    [ 8, 56 ],
    [ 9, 65 ],
    [ 10, 72 ],
    [ Infinity, 100 ]      // All 100 tasks have completed
  ],
  count: 100,              // Total number of tasks observed
  min: 0.25797,            // Shortest task duration in milliseconds
  max: 12.25421,           // Longest task duration in milliseconds
  sum: 683.0266810000002,  // Total time spent across all tasks
  ...
}
*/
```
