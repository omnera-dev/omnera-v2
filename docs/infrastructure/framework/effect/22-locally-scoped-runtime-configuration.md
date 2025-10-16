## Locally Scoped Runtime Configuration

In Effect, runtime configurations are typically **inherited** from their parent workflows.
This means that when we access a runtime configuration or obtain a runtime inside a workflow, we are essentially using the configuration of the parent workflow.

However, there are cases where we want to temporarily **override the runtime configuration for a specific part** of our code.
This concept is known as locally scoped runtime configuration.
Once the execution of that code region is completed, the runtime configuration **reverts** to its original settings.

To achieve this, we make use of the `Effect.provide` function, which allow us to provide a new runtime configuration to a specific section of our code.

**Example** (Overriding the Logger Configuration)

In this example, we create a simple logger using `Logger.replace`, which replaces the default logger with a custom one that logs messages without timestamps or levels. We then use `Effect.provide` to apply this custom logger to the program.

```ts twoslash
import { Logger, Effect } from "effect"

const addSimpleLogger = Logger.replace(
  Logger.defaultLogger,
  // Custom logger implementation
  Logger.make(({ message }) => console.log(message))
)

const program = Effect.gen(function* () {
  yield* Effect.log("Application started!")
  yield* Effect.log("Application is about to exit!")
})

// Running with the default logger
Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message="Application started!"
timestamp=... level=INFO fiber=#0 message="Application is about to exit!"
*/

// Overriding the default logger with a custom one
Effect.runFork(program.pipe(Effect.provide(addSimpleLogger)))
/*
Output:
[ 'Application started!' ]
[ 'Application is about to exit!' ]
*/
```

To ensure that the runtime configuration is only applied to a specific part of an Effect application, we should provide the configuration layer exclusively to that particular section.

**Example** (Providing a configuration layer to a nested workflow)

In this example, we demonstrate how to apply a custom logger configuration only to a specific section of the program. The default logger is used for most of the program, but when we apply the `Effect.provide(addSimpleLogger)` call, it overrides the logger within that specific nested block. After that, the configuration reverts to its original state.

```ts twoslash
import { Logger, Effect } from "effect"

const addSimpleLogger = Logger.replace(
  Logger.defaultLogger,
  // Custom logger implementation
  Logger.make(({ message }) => console.log(message))
)

const removeDefaultLogger = Logger.remove(Logger.defaultLogger)

const program = Effect.gen(function* () {
  // Logs with default logger
  yield* Effect.log("Application started!")

  yield* Effect.gen(function* () {
    // This log is suppressed
    yield* Effect.log("I'm not going to be logged!")

    // Custom logger applied here
    yield* Effect.log("I will be logged by the simple logger.").pipe(
      Effect.provide(addSimpleLogger)
    )

    // This log is suppressed
    yield* Effect.log(
      "Reset back to the previous configuration, so I won't be logged."
    )
  }).pipe(
    // Remove the default logger temporarily
    Effect.provide(removeDefaultLogger)
  )

  // Logs with default logger again
  yield* Effect.log("Application is about to exit!")
})

Effect.runSync(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message="Application started!"
[ 'I will be logged by the simple logger.' ]
timestamp=... level=INFO fiber=#0 message="Application is about to exit!"
*/
```
