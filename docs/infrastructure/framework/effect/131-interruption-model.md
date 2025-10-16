## Interruption Model

While developing concurrent applications, there are several cases that we need to interrupt the execution of other fibers, for example:

1. A parent fiber might start some child fibers to perform a task, and later the parent might decide that, it doesn't need the result of some or all of the child fibers.

2. Two or more fibers start race with each other. The fiber whose result is computed first wins, and all other fibers are no longer needed, and should be interrupted.

3. In interactive applications, a user may want to stop some already running tasks, such as clicking on the "stop" button to prevent downloading more files.

4. Computations that run longer than expected should be aborted by using timeout operations.

5. When we have an application that perform compute-intensive tasks based on the user inputs, if the user changes the input we should cancel the current task and perform another one.

### Polling vs. Asynchronous Interruption

When it comes to interrupting fibers, a naive approach is to allow one fiber to forcefully terminate another fiber. However, this approach is not ideal because it can leave shared state in an inconsistent and unreliable state if the target fiber is in the middle of modifying that state. Therefore, it does not guarantee internal consistency of the shared mutable state.

Instead, there are two popular and valid solutions to tackle this problem:

1. **Semi-asynchronous Interruption (Polling for Interruption)**: Imperative languages often employ polling as a semi-asynchronous signaling mechanism, such as Java. In this model, a fiber sends an interruption request to another fiber. The target fiber continuously polls the interrupt status and checks whether it has received any interruption requests from other fibers. If an interruption request is detected, the target fiber terminates itself as soon as possible.

   With this solution, the fiber itself handles critical sections. So, if a fiber is in the middle of a critical section and receives an interruption request, it ignores the interruption and defers its handling until after the critical section.

   However, one drawback of this approach is that if the programmer forgets to poll regularly, the target fiber can become unresponsive, leading to deadlocks. Additionally, polling a global flag is not aligned with the functional paradigm followed by Effect.

2. **Asynchronous Interruption**: In asynchronous interruption, a fiber is allowed to terminate another fiber. The target fiber is not responsible for polling the interrupt status. Instead, during critical sections, the target fiber disables the interruptibility of those regions. This is a purely functional solution that doesn't require polling a global state. Effect adopts this solution for its interruption model, which is a fully asynchronous signaling mechanism.

   This mechanism overcomes the drawback of forgetting to poll regularly. It is also fully compatible with the functional paradigm because in a purely functional computation, we can abort the computation at any point, except during critical sections where interruption is disabled.

### Interrupting Fibers

Fibers can be interrupted if their result is no longer needed. This action immediately stops the fiber and safely runs all finalizers to release any resources.

Like `Fiber.await`, the `Fiber.interrupt` function returns an [Exit](/docs/data-types/exit/) value that provides detailed information about how the fiber ended.

**Example** (Interrupting a Fiber)

```ts twoslash
import { Effect, Fiber } from "effect"

const program = Effect.gen(function* () {
  // Fork a fiber that runs indefinitely, printing "Hi!"
  const fiber = yield* Effect.fork(
    Effect.forever(Effect.log("Hi!").pipe(Effect.delay("10 millis")))
  )
  yield* Effect.sleep("30 millis")
  // Interrupt the fiber and get an Exit value detailing how it finished
  const exit = yield* Fiber.interrupt(fiber)
  console.log(exit)
})

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#1 message=Hi!
timestamp=... level=INFO fiber=#1 message=Hi!
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Interrupt',
    fiberId: {
      _id: 'FiberId',
      _tag: 'Runtime',
      id: 0,
      startTimeMillis: ...
    }
  }
}
*/
```

By default, the effect returned by `Fiber.interrupt` waits until the fiber has fully terminated before resuming. This ensures that no new fibers are started before the previous ones have finished, a behavior known as "back-pressuring."

If you do not require this waiting behavior, you can fork the interruption itself, allowing the main program to proceed without waiting for the fiber to terminate:

**Example** (Forking an Interruption)

```ts twoslash
import { Effect, Fiber } from "effect"

const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(
    Effect.forever(Effect.log("Hi!").pipe(Effect.delay("10 millis")))
  )
  yield* Effect.sleep("30 millis")
  const _ = yield* Effect.fork(Fiber.interrupt(fiber))
  console.log("Do something else...")
})

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#1 message=Hi!
timestamp=... level=INFO fiber=#1 message=Hi!
Do something else...
*/
```

There is also a shorthand for background interruption called `Fiber.interruptFork`.

```ts twoslash del={8} ins={9}
import { Effect, Fiber } from "effect"

const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(
    Effect.forever(Effect.log("Hi!").pipe(Effect.delay("10 millis")))
  )
  yield* Effect.sleep("30 millis")
  // const _ = yield* Effect.fork(Fiber.interrupt(fiber))
  const _ = yield* Fiber.interruptFork(fiber)
  console.log("Do something else...")
})

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#1 message=Hi!
timestamp=... level=INFO fiber=#1 message=Hi!
Do something else...
*/
```

<Aside type="tip" title="Interrupting via Effect.interrupt">
  You can also interrupt fibers using the high-level API
  `Effect.interrupt`. For more details, refer to the [Effect.interrupt
  documentation](/docs/concurrency/basic-concurrency/#interruptions).
</Aside>
