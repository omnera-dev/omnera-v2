## Disabling Default Logging

Sometimes, perhaps during test execution, you might want to disable default logging in your application. Effect provides several ways to turn off logging when needed. In this section, we'll look at different methods to disable logging in the Effect framework.

**Example** (Using `Logger.withMinimumLogLevel`)

One convenient way to disable logging is by using the `Logger.withMinimumLogLevel` function. This allows you to set the minimum log level to `None`, effectively turning off all log output.

```ts twoslash
import { Effect, Logger, LogLevel } from 'effect'

const program = Effect.gen(function* () {
  yield* Effect.log('Executing task...')
  yield* Effect.sleep('100 millis')
  console.log('task done')
})

// Default behavior: logging enabled
Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message="Executing task..."
task done
*/

// Disable logging by setting minimum log level to 'None'
Effect.runFork(program.pipe(Logger.withMinimumLogLevel(LogLevel.None)))
/*
Output:
task done
*/
```

**Example** (Using a Layer)

Another approach to disable logging is by creating a layer that sets the minimum log level to `LogLevel.None`, effectively turning off all log output.

```ts twoslash
import { Effect, Logger, LogLevel } from 'effect'

const program = Effect.gen(function* () {
  yield* Effect.log('Executing task...')
  yield* Effect.sleep('100 millis')
  console.log('task done')
})

// Create a layer that disables logging
const layer = Logger.minimumLogLevel(LogLevel.None)

// Apply the layer to disable logging
Effect.runFork(program.pipe(Effect.provide(layer)))
/*
Output:
task done
*/
```

**Example** (Using a Custom Runtime)

You can also disable logging by creating a custom runtime that includes the configuration to turn off logging:

```ts twoslash
import { Effect, Logger, LogLevel, ManagedRuntime } from 'effect'

const program = Effect.gen(function* () {
  yield* Effect.log('Executing task...')
  yield* Effect.sleep('100 millis')
  console.log('task done')
})

// Create a custom runtime that disables logging
const customRuntime = ManagedRuntime.make(Logger.minimumLogLevel(LogLevel.None))

// Run the program using the custom runtime
customRuntime.runFork(program)
/*
Output:
task done
*/
```
