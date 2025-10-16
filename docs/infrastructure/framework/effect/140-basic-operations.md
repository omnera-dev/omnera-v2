## Basic Operations

A `PubSub<A>` stores messages of type `A` and provides two fundamental operations:

| API                | Description                                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PubSub.publish`   | Sends a message of type `A` to the `PubSub`, returning an effect indicating if the message was successfully published.                                                                                                                |
| `PubSub.subscribe` | Creates a scoped effect that allows subscription to the `PubSub`, automatically unsubscribing when the scope ends. Subscribers receive messages through a [Dequeue](/docs/concurrency/queue/#dequeue) which holds published messages. |

**Example** (Publishing a Message to Multiple Subscribers)

```ts twoslash
import { Effect, PubSub, Queue } from 'effect'

const program = Effect.scoped(
  Effect.gen(function* () {
    const pubsub = yield* PubSub.bounded<string>(2)

    // Two subscribers
    const dequeue1 = yield* PubSub.subscribe(pubsub)
    const dequeue2 = yield* PubSub.subscribe(pubsub)

    // Publish a message to the pubsub
    yield* PubSub.publish(pubsub, 'Hello from a PubSub!')

    // Each subscriber receives the message
    console.log('Subscriber 1: ' + (yield* Queue.take(dequeue1)))
    console.log('Subscriber 2: ' + (yield* Queue.take(dequeue2)))
  })
)

Effect.runFork(program)
/*
Output:
Subscriber 1: Hello from a PubSub!
Subscriber 2: Hello from a PubSub!
*/
```

<Aside type="caution" title="Subscribe Before Publishing">
  A subscriber only receives messages published while it is actively
  subscribed. To ensure a subscriber receives a particular message,
  establish the subscription before publishing the message.
</Aside>
