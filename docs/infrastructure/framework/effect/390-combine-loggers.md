## Combine Loggers

### zip

The `Logger.zip` function combines two loggers into a new logger. This new logger forwards log messages to both the original loggers.

**Example** (Combining Two Loggers)

```ts
import { Effect, Logger } from 'effect'

// Define a custom logger that logs to the console
const logger = Logger.make(({ logLevel, message }) => {
  globalThis.console.log(`[${logLevel.label}] ${message}`)
})

// Combine the default logger and the custom logger
//
//      ┌─── Logger<unknown, [void, void]>
//      ▼
const combined = Logger.zip(Logger.defaultLogger, logger)

const program = Effect.log('something')

Effect.runFork(
  program.pipe(
    // Replace the default logger with the combined logger
    Effect.provide(Logger.replace(Logger.defaultLogger, combined))
  )
)
/*
Output:
timestamp=2025-01-09T13:50:58.655Z level=INFO fiber=#0 message=something
[INFO] something
*/
```

# [Metrics in Effect](https://effect.website/docs/observability/metrics/)
