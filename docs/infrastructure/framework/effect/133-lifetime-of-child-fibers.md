## Lifetime of Child Fibers

When we fork fibers, depending on how we fork them we can have four different lifetime strategies for the child fibers:

1. **Fork With Automatic Supervision**. If we use the ordinary `Effect.fork` operation, the child fiber will be automatically supervised by the parent fiber. The lifetime child fibers are tied to the lifetime of their parent fiber. This means that these fibers will be terminated either when they end naturally, or when their parent fiber is terminated.

2. **Fork in Global Scope (Daemon)**. Sometimes we want to run long-running background fibers that aren't tied to their parent fiber, and also we want to fork them in a global scope. Any fiber that is forked in global scope will become daemon fiber. This can be achieved by using the `Effect.forkDaemon` operator. As these fibers have no parent, they are not supervised, and they will be terminated when they end naturally, or when our application is terminated.

3. **Fork in Local Scope**. Sometimes, we want to run a background fiber that isn't tied to its parent fiber, but we want to live that fiber in the local scope. We can fork fibers in the local scope by using `Effect.forkScoped`. Such fibers can outlive their parent fiber (so they are not supervised by their parents), and they will be terminated when their life end or their local scope is closed.

4. **Fork in Specific Scope**. This is similar to the previous strategy, but we can have more fine-grained control over the lifetime of the child fiber by forking it in a specific scope. We can do this by using the `Effect.forkIn` operator.

### Fork with Automatic Supervision

Effect follows a **structured concurrency** model, where child fibers' lifetimes are tied to their parent. Simply put, the lifespan of a fiber depends on the lifespan of its parent fiber.

**Example** (Automatically Supervised Child Fiber)

In this scenario, the `parent` fiber spawns a `child` fiber that repeatedly prints a message every second.
The `child` fiber will be terminated when the `parent` fiber completes.

```ts twoslash
import { Effect, Console, Schedule } from "effect"

// Child fiber that logs a message repeatedly every second
const child = Effect.repeat(
  Console.log("child: still running!"),
  Schedule.fixed("1 second")
)

const parent = Effect.gen(function* () {
  console.log("parent: started!")
  // Child fiber is supervised by the parent
  yield* Effect.fork(child)
  yield* Effect.sleep("3 seconds")
  console.log("parent: finished!")
})

Effect.runFork(parent)
/*
Output:
parent: started!
child: still running!
child: still running!
child: still running!
parent: finished!
*/
```

This behavior can be extended to any level of nested fibers, ensuring a predictable and controlled fiber lifecycle.

### Fork in Global Scope (Daemon)

You can create a long-running background fiber using `Effect.forkDaemon`. This type of fiber, known as a daemon fiber, is not tied to the lifecycle of its parent fiber. Instead, its lifetime is linked to the global scope. A daemon fiber continues running even if its parent fiber is terminated and will only stop when the global scope is closed or the fiber completes naturally.

**Example** (Creating a Daemon Fiber)

This example shows how daemon fibers can continue running in the background even after the parent fiber has finished.

```ts twoslash
import { Effect, Console, Schedule } from "effect"

// Daemon fiber that logs a message repeatedly every second
const daemon = Effect.repeat(
  Console.log("daemon: still running!"),
  Schedule.fixed("1 second")
)

const parent = Effect.gen(function* () {
  console.log("parent: started!")
  // Daemon fiber running independently
  yield* Effect.forkDaemon(daemon)
  yield* Effect.sleep("3 seconds")
  console.log("parent: finished!")
})

Effect.runFork(parent)
/*
Output:
parent: started!
daemon: still running!
daemon: still running!
daemon: still running!
parent: finished!
daemon: still running!
daemon: still running!
daemon: still running!
daemon: still running!
daemon: still running!
...etc...
*/
```

Even if the parent fiber is interrupted, the daemon fiber will continue running independently.

**Example** (Interrupting the Parent Fiber)

In this example, interrupting the parent fiber doesn't affect the daemon fiber, which continues to run in the background.

```ts twoslash
import { Effect, Console, Schedule, Fiber } from "effect"

// Daemon fiber that logs a message repeatedly every second
const daemon = Effect.repeat(
  Console.log("daemon: still running!"),
  Schedule.fixed("1 second")
)

const parent = Effect.gen(function* () {
  console.log("parent: started!")
  // Daemon fiber running independently
  yield* Effect.forkDaemon(daemon)
  yield* Effect.sleep("3 seconds")
  console.log("parent: finished!")
}).pipe(Effect.onInterrupt(() => Console.log("parent: interrupted!")))

// Program that interrupts the parent fiber after 2 seconds
const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(parent)
  yield* Effect.sleep("2 seconds")
  yield* Fiber.interrupt(fiber) // Interrupt the parent fiber
})

Effect.runFork(program)
/*
Output:
parent: started!
daemon: still running!
daemon: still running!
parent: interrupted!
daemon: still running!
daemon: still running!
daemon: still running!
daemon: still running!
daemon: still running!
...etc...
*/
```

### Fork in Local Scope

Sometimes we want to create a fiber that is tied to a local [scope](/docs/resource-management/scope/), meaning its lifetime is not dependent on its parent fiber but is bound to the local scope in which it was forked. This can be done using the `Effect.forkScoped` operator.

Fibers created with `Effect.forkScoped` can outlive their parent fibers and will only be terminated when the local scope itself is closed.

**Example** (Forking a Fiber in a Local Scope)

In this example, the `child` fiber continues to run beyond the lifetime of the `parent` fiber. The `child` fiber is tied to the local scope and will be terminated only when the scope ends.

```ts twoslash
import { Effect, Console, Schedule } from "effect"

// Child fiber that logs a message repeatedly every second
const child = Effect.repeat(
  Console.log("child: still running!"),
  Schedule.fixed("1 second")
)

//      ┌─── Effect<void, never, Scope>
//      ▼
const parent = Effect.gen(function* () {
  console.log("parent: started!")
  // Child fiber attached to local scope
  yield* Effect.forkScoped(child)
  yield* Effect.sleep("3 seconds")
  console.log("parent: finished!")
})

// Program runs within a local scope
const program = Effect.scoped(
  Effect.gen(function* () {
    console.log("Local scope started!")
    yield* Effect.fork(parent)
    // Scope lasts for 5 seconds
    yield* Effect.sleep("5 seconds")
    console.log("Leaving the local scope!")
  })
)

Effect.runFork(program)
/*
Output:
Local scope started!
parent: started!
child: still running!
child: still running!
child: still running!
parent: finished!
child: still running!
child: still running!
Leaving the local scope!
*/
```

### Fork in Specific Scope

There are some cases where we need more fine-grained control, so we want to fork a fiber in a specific scope.
We can use the `Effect.forkIn` operator which takes the target scope as an argument.

**Example** (Forking a Fiber in a Specific Scope)

In this example, the `child` fiber is forked into the `outerScope`, allowing it to outlive the inner scope but still be terminated when the `outerScope` is closed.

```ts twoslash
import { Console, Effect, Schedule } from "effect"

// Child fiber that logs a message repeatedly every second
const child = Effect.repeat(
  Console.log("child: still running!"),
  Schedule.fixed("1 second")
)

const program = Effect.scoped(
  Effect.gen(function* () {
    yield* Effect.addFinalizer(() =>
      Console.log("The outer scope is about to be closed!")
    )

    // Capture the outer scope
    const outerScope = yield* Effect.scope

    // Create an inner scope
    yield* Effect.scoped(
      Effect.gen(function* () {
        yield* Effect.addFinalizer(() =>
          Console.log("The inner scope is about to be closed!")
        )
        // Fork the child fiber in the outer scope
        yield* Effect.forkIn(child, outerScope)
        yield* Effect.sleep("3 seconds")
      })
    )

    yield* Effect.sleep("5 seconds")
  })
)

Effect.runFork(program)
/*
Output:
child: still running!
child: still running!
child: still running!
The inner scope is about to be closed!
child: still running!
child: still running!
child: still running!
child: still running!
child: still running!
child: still running!
The outer scope is about to be closed!
*/
```
