## Creating a PubSub

### Bounded PubSub

A bounded `PubSub` applies back pressure to publishers when it reaches capacity, suspending additional publishing until space becomes available.

Back pressure ensures that all subscribers receive all messages while they are subscribed. However, it can lead to slower message delivery if a subscriber is slow.

**Example** (Bounded PubSub Creation)

```ts twoslash
import { PubSub } from 'effect'

// Creates a bounded PubSub with a capacity of 2
const boundedPubSub = PubSub.bounded<string>(2)
```

### Dropping PubSub

A dropping `PubSub` discards new values when full. The `PubSub.publish` operation returns `false` if the message is dropped.

In a dropping pubsub, publishers can continue to publish new values, but subscribers are not guaranteed to receive all messages.

**Example** (Dropping PubSub Creation)

```ts twoslash
import { PubSub } from 'effect'

// Creates a dropping PubSub with a capacity of 2
const droppingPubSub = PubSub.dropping<string>(2)
```

### Sliding PubSub

A sliding `PubSub` removes the oldest message to make space for new ones, ensuring that publishing never blocks.

A sliding pubsub prevents slow subscribers from impacting the message delivery rate. However, there's still a risk that slow subscribers may miss some messages.

**Example** (Sliding PubSub Creation)

```ts twoslash
import { PubSub } from 'effect'

// Creates a sliding PubSub with a capacity of 2
const slidingPubSub = PubSub.sliding<string>(2)
```

### Unbounded PubSub

An unbounded `PubSub` has no capacity limit, so publishing always succeeds immediately.

Unbounded pubsubs guarantee that all subscribers receive all messages without slowing down message delivery. However, they can grow indefinitely if messages are published faster than they are consumed.

Generally, it's recommended to use bounded, dropping, or sliding pubsubs unless you have specific use cases for unbounded pubsubs.

**Example**

```ts twoslash
import { PubSub } from 'effect'

// Creates an unbounded PubSub with unlimited capacity
const unboundedPubSub = PubSub.unbounded<string>()
```
