## Using runMain

In Effect, `runMain` is the primary entry point for executing an Effect application on Node.js.

**Example** (Running an Effect Application with Graceful Teardown)

```ts
import { Effect, Console, Schedule, pipe } from 'effect'
import { NodeRuntime } from '@effect/platform-node'

const program = pipe(
  Effect.addFinalizer(() => Console.log('Application is about to exit!')),
  Effect.andThen(Console.log('Application started!')),
  Effect.andThen(
    Effect.repeat(Console.log('still alive...'), {
      schedule: Schedule.spaced('1 second'),
    })
  ),
  Effect.scoped
)

// No graceful teardown on CTRL+C
// Effect.runPromise(program)

// Use NodeRuntime.runMain for graceful teardown on CTRL+C
NodeRuntime.runMain(program)
/*
Output:
Application started!
still alive...
still alive...
still alive...
still alive...
^C <-- CTRL+C
Application is about to exit!
*/
```

The `runMain` function handles finding and interrupting all fibers. Internally, it observes the fiber and listens for `sigint` signals, ensuring a graceful shutdown of the application when interrupted (e.g., using CTRL+C).

<Aside type="tip" title="Graceful Teardown">
  Ensure the teardown logic is placed in the main effect. If the fiber
  running the application or server is interrupted, `runMain` ensures that
  all resources are properly released.
</Aside>

### Versions for Different Platforms

Effect provides versions of `runMain` tailored for different platforms:

| Platform | Runtime Version          | Import Path                |
| -------- | ------------------------ | -------------------------- |
| Node.js  | `NodeRuntime.runMain`    | `@effect/platform-node`    |
| Bun      | `BunRuntime.runMain`     | `@effect/platform-bun`     |
| Browser  | `BrowserRuntime.runMain` | `@effect/platform-browser` |
