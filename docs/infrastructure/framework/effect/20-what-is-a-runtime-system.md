## What is a Runtime System?

When we write an Effect program, we construct an `Effect` using constructors and combinators.
Essentially, we are creating a blueprint of a program.
An `Effect` is merely a data structure that describes the execution of a concurrent program.
It represents a tree-like structure that combines various primitives to define what the effect should do.

However, this data structure itself does not perform any actions, it is solely a description of a concurrent program.

To execute this program, the Effect runtime system comes into play. The `Runtime.run*` functions (e.g., `Runtime.runPromise`, `Runtime.runFork`) are responsible for taking this blueprint and executing it.

When the runtime system runs an effect, it creates a root fiber, initializing it with:

- The initial [context](/docs/requirements-management/services/#how-it-works)
- The initial `FiberRefs`
- The initial effect

It then starts a loop, executing the instructions described by the `Effect` step by step.

You can think of the runtime as a system that takes an [`Effect<A, E, R>`](/docs/getting-started/the-effect-type/) and its associated context `Context<R>` and produces an [`Exit<A, E>`](/docs/data-types/exit/) result.

```text showLineNumbers=false
┌────────────────────────────────┐
│  Context<R> + Effect<A, E, R>  │
└────────────────────────────────┘
               │
               ▼
┌────────────────────────────────┐
│      Effect Runtime System     │
└────────────────────────────────┘
               │
               ▼
┌────────────────────────────────┐
│          Exit<A, E>            │
└────────────────────────────────┘
```

Runtime Systems have a lot of responsibilities:

| Responsibility                | Description                                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Executing the program**     | The runtime must execute every step of the effect in a loop until the program completes.                           |
| **Handling errors**           | It handles both expected and unexpected errors that occur during execution.                                        |
| **Managing concurrency**      | The runtime spawns new fibers when `Effect.fork` is called to handle concurrent operations.                        |
| **Cooperative yielding**      | It ensures fibers don't monopolize resources, yielding control when necessary.                                     |
| **Ensuring resource cleanup** | The runtime guarantees finalizers run properly to clean up resources when needed.                                  |
| **Handling async callbacks**  | The runtime deals with asynchronous operations transparently, allowing you to write async and sync code uniformly. |
