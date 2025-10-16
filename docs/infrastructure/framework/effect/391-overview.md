## Overview

import { Aside } from "@astrojs/starlight/components"

In complex and highly concurrent applications, managing various interconnected components can be quite challenging. Ensuring that everything runs smoothly and avoiding application downtime becomes crucial in such setups.

Now, let's imagine we have a sophisticated infrastructure with numerous services. These services are replicated and distributed across our servers. However, we often lack insight into what's happening across these services, including error rates, response times, and service uptime. This lack of visibility can make it challenging to identify and address issues effectively. This is where Effect Metrics comes into play; it allows us to capture and analyze various metrics, providing valuable data for later investigation.

Effect Metrics offers support for five different types of metrics:

| Metric        | Description                                                                                                                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Counter**   | Counters are used to track values that increase over time, such as request counts. They help us keep tabs on how many times a specific event or action has occurred.                                                                                                    |
| **Gauge**     | Gauges represent a single numerical value that can fluctuate up and down over time. They are often used to monitor metrics like memory usage, which can vary continuously.                                                                                              |
| **Histogram** | Histograms are useful for tracking the distribution of observed values across different buckets. They are commonly used for metrics like request latencies, allowing us to understand how response times are distributed.                                               |
| **Summary**   | Summaries provide insight into a sliding window of a time series and offer metrics for specific percentiles of the time series, often referred to as quantiles. This is particularly helpful for understanding latency-related metrics, such as request response times. |
| **Frequency** | Frequency metrics count the occurrences of distinct string values. They are useful when you want to keep track of how often different events or conditions are happening in your application.                                                                           |
