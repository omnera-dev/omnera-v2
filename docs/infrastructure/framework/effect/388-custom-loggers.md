## Custom loggers

In this section, you'll learn how to define a custom logger and set it as the default logger in your application. Custom loggers give you control over how log messages are handled, such as routing them to external services, writing to files, or formatting logs in a specific way.

### Defining a Custom Logger

You can define your own logger using the `Logger.make` function. This function allows you to specify how log messages should be processed.

**Example** (Defining a Simple Custom Logger)

```ts twoslash
import { Logger } from 'effect'

// Custom logger that outputs log messages to the console
const logger = Logger.make(({ logLevel, message }) => {
  globalThis.console.log(`[${logLevel.label}] ${message}`)
})
```

In this example, the custom logger logs messages to the console with the log level and message formatted as `[LogLevel] Message`.

### Using a Custom Logger in a Program

Let's assume you have the following tasks and a program where you log some messages:

```ts twoslash collapse={3-6}
import { Effect, Logger } from 'effect'

// Custom logger that outputs log messages to the console
const logger = Logger.make(({ logLevel, message }) => {
  globalThis.console.log(`[${logLevel.label}] ${message}`)
})

const task1 = Effect.gen(function* () {
  yield* Effect.sleep('2 seconds')
  yield* Effect.logDebug('task1 done')
})

const task2 = Effect.gen(function* () {
  yield* Effect.sleep('1 second')
  yield* Effect.logDebug('task2 done')
})

const program = Effect.gen(function* () {
  yield* Effect.log('start')
  yield* task1
  yield* task2
  yield* Effect.log('done')
})
```

To replace the default logger with your custom logger, you can use the `Logger.replace` function. After creating a layer that replaces the default logger, you provide it to your program using `Effect.provide`.

**Example** (Replacing the Default Logger with a Custom Logger)

```ts twoslash collapse={3-23}
import { Effect, Logger, LogLevel } from 'effect'

// Custom logger that outputs log messages to the console
const logger = Logger.make(({ logLevel, message }) => {
  globalThis.console.log(`[${logLevel.label}] ${message}`)
})

const task1 = Effect.gen(function* () {
  yield* Effect.sleep('2 seconds')
  yield* Effect.logDebug('task1 done')
})

const task2 = Effect.gen(function* () {
  yield* Effect.sleep('1 second')
  yield* Effect.logDebug('task2 done')
})

const program = Effect.gen(function* () {
  yield* Effect.log('start')
  yield* task1
  yield* task2
  yield* Effect.log('done')
})

// Replace the default logger with the custom logger
const layer = Logger.replace(Logger.defaultLogger, logger)

Effect.runFork(program.pipe(Logger.withMinimumLogLevel(LogLevel.Debug), Effect.provide(layer)))
```

When you run the above program, the following log messages are printed to the console:

```ansi showLineNumbers=false
[INFO] start
[DEBUG] task1 done
[DEBUG] task2 done
[INFO] done
```
