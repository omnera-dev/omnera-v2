## Summary

A Summary is a metric that gives insights into a series of data points by calculating specific percentiles. Percentiles help us understand how data is distributed. For instance, if you're tracking response times for requests over the past hour, you may want to examine key percentiles such as the 50th, 90th, 95th, or 99th to better understand your system's performance.

Summaries are similar to histograms in that they observe `number` values, but with a different approach. Instead of immediately sorting values into buckets and discarding them, a summary holds onto the observed values in memory. However, to avoid storing too much data, summaries use two parameters:

- **maxAge**: The maximum age a value can have before it's discarded.
- **maxSize**: The maximum number of values stored in the summary.

This creates a sliding window of recent values, so the summary always represents a fixed number of the most recent observations.

Summaries are commonly used to calculate **quantiles** over this sliding window. A **quantile** is a number between `0` and `1` that represents the percentage of values less than or equal to a certain threshold. For example, a quantile of `0.5` (or 50th percentile) is the **median** value, while `0.95` (or 95th percentile) would represent the value below which 95% of the observed data falls.

Quantiles are helpful for monitoring important performance metrics, such as latency, and for ensuring that your system meets performance goals (like Service Level Agreements, or SLAs).

The Effect Metrics API also allows you to configure summaries with an **error margin**. This margin introduces a range of acceptable values for quantiles, improving the accuracy of the result.

Summaries are particularly useful in cases where:

- The range of values you're observing is not known or estimated in advance, making histograms less practical.
- You don't need to aggregate data across multiple instances or average results. Summaries calculate their results on the application side, meaning they focus on the specific instance where they are used.

**Example** (Creating and Using a Summary)

In this example, we will create a summary to track response times. The summary will:

- Hold up to `100` samples.
- Discard samples older than `1 day`.
- Have a `3%` error margin when calculating quantiles.
- Report the `10%`, `50%`, and `90%` quantiles, which help track response time distributions.

We'll apply the summary to an effect that generates random integers, simulating response times.

```ts twoslash
import { Metric, Random, Effect } from "effect"

// Define the summary for response times
const responseTimeSummary = Metric.summary({
  name: "response_time_summary", // Name of the summary metric
  maxAge: "1 day", // Maximum sample age
  maxSize: 100, // Maximum number of samples to retain
  error: 0.03, // Error margin for quantile calculation
  quantiles: [0.1, 0.5, 0.9], // Quantiles to observe (10%, 50%, 90%)
  // Optional
  description: "Measures the distribution of response times"
})

const program = Effect.gen(function* () {
  // Record 100 random response times between 1 and 120 ms
  yield* responseTimeSummary(Random.nextIntBetween(1, 120)).pipe(
    Effect.repeatN(99)
  )

  // Retrieve and log the current state of the summary
  const state = yield* Metric.value(responseTimeSummary)
  console.log("%o", state)
})

Effect.runPromise(program)
/*
Example Output:
SummaryState {
  error: 0.03,    // Error margin used for quantile calculation
  quantiles: [
    [ 0.1, { _id: 'Option', _tag: 'Some', value: 17 } ],   // 10th percentile: 17 ms
    [ 0.5, { _id: 'Option', _tag: 'Some', value: 62 } ],   // 50th percentile (median): 62 ms
    [ 0.9, { _id: 'Option', _tag: 'Some', value: 109 } ]   // 90th percentile: 109 ms
  ],
  count: 100,    // Total number of samples recorded
  min: 4,        // Minimum observed value
  max: 119,      // Maximum observed value
  sum: 6058,     // Sum of all recorded values
  ...
}
*/
```
