## Cheatsheet

The table provides a summary of the available `run*` functions, along with their input and output types, allowing you to choose the appropriate function based on your needs.

| API              | Given          | Result                |
| ---------------- | -------------- | --------------------- |
| `runSync`        | `Effect<A, E>` | `A`                   |
| `runSyncExit`    | `Effect<A, E>` | `Exit<A, E>`          |
| `runPromise`     | `Effect<A, E>` | `Promise<A>`          |
| `runPromiseExit` | `Effect<A, E>` | `Promise<Exit<A, E>>` |
| `runFork`        | `Effect<A, E>` | `RuntimeFiber<A, E>`  |

You can find the complete list of `run*` functions [here](https://effect-ts.github.io/effect/effect/Effect.ts.html#running-effects).

# [Using Generators](https://effect.website/docs/getting-started/using-generators/)
