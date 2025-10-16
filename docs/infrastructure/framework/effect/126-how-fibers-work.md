## How Fibers work

All effects in Effect are executed by fibers. If you didn't create the fiber yourself, it was created by an operation you're using (if it's concurrent) or by the Effect runtime system.

A fiber is created any time an effect is run. When running effects concurrently, a fiber is created for each concurrent effect.

Even if you write "single-threaded" code with no concurrent operations, there will always be at least one fiber: the "main" fiber that executes your effect.

Effect fibers have a well-defined lifecycle based on the effect they are executing.

Every fiber exits with either a failure or success, depending on whether the effect it is executing fails or succeeds.

Effect fibers have unique identities, local state, and a status (such as done, running, or suspended).

To summarize:

- An `Effect` is a higher-level concept that describes an effectful computation. It is lazy and immutable, meaning it represents a computation that may produce a value or fail but does not immediately execute.
- A fiber, on the other hand, represents the running execution of an `Effect`. It can be interrupted or awaited to retrieve its result. Think of it as a way to control and interact with the ongoing computation.
