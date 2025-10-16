## runFork

The foundational function for running effects, returning a "fiber" that can be observed or interrupted.

`Effect.runFork` is used to run an effect in the background by creating a fiber. It is the base function
for all other run functions. It starts a fiber that can be observed or interrupted.

<Aside type="tip" title="The Default for Effect Execution">
  Unless you specifically need a `Promise` or synchronous operation,
  `Effect.runFork` is a good default choice.
</Aside>

**Example** (Running an Effect in the Background)

```ts twoslash
import { Effect, Console, Schedule, Fiber } from 'effect'

//      ┌─── Effect<number, never, never>
//      ▼
const program = Effect.repeat(Console.log('running...'), Schedule.spaced('200 millis'))

//      ┌─── RuntimeFiber<number, never>
//      ▼
const fiber = Effect.runFork(program)

setTimeout(() => {
  Effect.runFork(Fiber.interrupt(fiber))
}, 500)
```

In this example, the `program` continuously logs "running..." with each repetition spaced 200 milliseconds apart. You can learn more about repetitions and scheduling in our [Introduction to Scheduling](/docs/scheduling/introduction/) guide.

To stop the execution of the program, we use `Fiber.interrupt` on the fiber returned by `Effect.runFork`. This allows you to control the execution flow and terminate it when necessary.

For a deeper understanding of how fibers work and how to handle interruptions, check out our guides on [Fibers](/docs/concurrency/fibers/) and [Interruptions](/docs/concurrency/basic-concurrency/#interruptions).
