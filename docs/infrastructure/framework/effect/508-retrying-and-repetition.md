## Retrying and Repetition

In the realm of scheduling, there are two related concepts: [Retrying](/docs/error-management/retrying/) and [Repetition](/docs/scheduling/repetition/). While they share the same underlying idea, they differ in their focus. Retrying aims to handle failures by executing an effect again, while repetition focuses on executing an effect repeatedly to achieve a desired outcome.

When using schedules for retrying or repetition, each interval's starting boundary determines when the effect will be executed again. For example, in retrying, if an error occurs, the schedule defines when the effect should be retried.
