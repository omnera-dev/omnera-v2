## PubSub as an Enqueue

`PubSub` operators mirror those of [Queue](/docs/concurrency/queue/) with the main difference being that `PubSub.publish` and `PubSub.subscribe` are used in place of `Queue.offer` and `Queue.take`. If you're already familiar with using a `Queue`, you’ll find `PubSub` straightforward.

Essentially, a `PubSub` can be seen as a `Enqueue` that only allows writes:

```ts twoslash showLineNumbers=false
import type { Queue } from "effect"

interface PubSub<A> extends Queue.Enqueue<A> {}
```

Here, the `Enqueue` type refers to a queue that only accepts enqueues (or writes). Any value enqueued here is published to the pubsub, and operations like shutdown will also affect the pubsub.

This design makes `PubSub` highly flexible, letting you use it anywhere you need a `Enqueue` that only accepts published values.

# [Queue](https://effect.website/docs/concurrency/queue/)
