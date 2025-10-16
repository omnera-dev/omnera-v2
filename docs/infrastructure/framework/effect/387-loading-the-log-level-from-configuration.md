## Loading the Log Level from Configuration

To dynamically load the log level from a [configuration](/docs/configuration/) and apply it to your program, you can use the `Logger.minimumLogLevel` layer. This allows your application to adjust its logging behavior based on external configuration.

**Example** (Loading Log Level from Configuration)

```ts twoslash
import {
  Effect,
  Config,
  Logger,
  Layer,
  ConfigProvider,
  LogLevel
} from "effect"

// Simulate a program with logs
const program = Effect.gen(function* () {
  yield* Effect.logError("ERROR!")
  yield* Effect.logWarning("WARNING!")
  yield* Effect.logInfo("INFO!")
  yield* Effect.logDebug("DEBUG!")
})

// Load the log level from the configuration and apply it as a layer
const LogLevelLive = Config.logLevel("LOG_LEVEL").pipe(
  Effect.andThen((level) =>
    // Set the minimum log level
    Logger.minimumLogLevel(level)
  ),
  Layer.unwrapEffect // Convert the effect into a layer
)

// Provide the loaded log level to the program
const configured = Effect.provide(program, LogLevelLive)

// Test the program using a mock configuration provider
const test = Effect.provide(
  configured,
  Layer.setConfigProvider(
    ConfigProvider.fromMap(
      new Map([["LOG_LEVEL", LogLevel.Warning.label]])
    )
  )
)

Effect.runFork(test)
/*
Output:
... level=ERROR fiber=#0 message=ERROR!
... level=WARN fiber=#0 message=WARNING!
*/
```

<Aside type="tip" title="Using ConfigProvider for Testing">
  The `ConfigProvider.fromMap` function is useful for testing by
  simulating configuration values. You can also refer to [Mocking
  Configurations in
  Tests](/docs/configuration/#mocking-configurations-in-tests) for more
  details on using mock configuration during tests.
</Aside>
