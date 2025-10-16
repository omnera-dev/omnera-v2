## The Default Runtime

When we use [functions that run effects](/docs/getting-started/running-effects/) like `Effect.runPromise` or `Effect.runFork`, we are actually using the **default runtime** without explicitly mentioning it. These functions are designed as convenient shortcuts for executing our effects using the default runtime.

Each of the `Effect.run*` functions internally calls the corresponding `Runtime.run*` function, passing in the default runtime. For example, `Effect.runPromise` is just an alias for `Runtime.runPromise(defaultRuntime)`.

Both of the following executions are functionally equivalent:

**Example** (Running an Effect Using the Default Runtime)

```ts twoslash
import { Effect, Runtime } from "effect"

const program = Effect.log("Application started!")

Effect.runPromise(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message="Application started!"
*/

Runtime.runPromise(Runtime.defaultRuntime)(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message="Application started!"
*/
```

In both cases, the program runs using the default runtime, producing the same output.

The default runtime includes:

- An empty [context](/docs/requirements-management/services/#how-it-works)
- A set of `FiberRefs` that include the [default services](/docs/requirements-management/default-services/)
- A default configuration for `RuntimeFlags` that enables `Interruption` and `CooperativeYielding`

In most scenarios, using the default runtime is sufficient for effect execution.
However, there are cases where it's helpful to create a custom runtime, particularly when you need to reuse specific configurations or contexts.

For example, in a React app or when executing operations on a server in response to API requests, you might create a `Runtime<R>` by initializing a [layer](/docs/requirements-management/layers/) `Layer<R, Err, RIn>`. This allows you to maintain a consistent context across different execution boundaries.
