## Overview

Effect's logging system generally writes messages to the console by default. However, you might prefer to store logs in a file for easier debugging or archiving. The `PlatformLogger.toFile` function creates a logger that sends log messages to a file on disk.

### toFile

Creates a new logger from an existing string-based logger, writing its output to the specified file.

If you include a `batchWindow` duration when calling `toFile`, logs are batched for that period before being written. This can reduce overhead if your application produces many log entries. Without a `batchWindow`, logs are written as they arrive.

Note that `toFile` returns an `Effect` that may fail with a `PlatformError` if the file cannot be opened or written to. Be sure to handle this possibility if you need to react to file I/O issues.

**Example** (Directing Logs to a File)

This logger requires a `FileSystem` implementation to open and write to the file. For Node.js, you can use `NodeFileSystem.layer`.

```ts twoslash
import { PlatformLogger } from '@effect/platform'
import { NodeFileSystem } from '@effect/platform-node'
import { Effect, Layer, Logger } from 'effect'

// Create a string-based logger (logfmtLogger in this case)
const myStringLogger = Logger.logfmtLogger

// Apply toFile to write logs to "/tmp/log.txt"
const fileLogger = myStringLogger.pipe(PlatformLogger.toFile('/tmp/log.txt'))

// Replace the default logger, providing NodeFileSystem
// to access the file system
const LoggerLive = Logger.replaceScoped(Logger.defaultLogger, fileLogger).pipe(
  Layer.provide(NodeFileSystem.layer)
)

const program = Effect.log('Hello')

// Run the program, writing logs to /tmp/log.txt
Effect.runFork(program.pipe(Effect.provide(LoggerLive)))
/*
Logs will be written to "/tmp/log.txt" in the logfmt format,
and won't appear on the console.
*/
```

In the following example, logs are written to both the console and a file. The console uses the pretty logger, while the file uses the logfmt format.

**Example** (Directing Logs to Both a File and the Console)

```ts twoslash
import { PlatformLogger } from '@effect/platform'
import { NodeFileSystem } from '@effect/platform-node'
import { Effect, Layer, Logger } from 'effect'

const fileLogger = Logger.logfmtLogger.pipe(PlatformLogger.toFile('/tmp/log.txt'))

// Combine the pretty logger for console output with the file logger
const bothLoggers = Effect.map(fileLogger, (fileLogger) =>
  Logger.zip(Logger.prettyLoggerDefault, fileLogger)
)

const LoggerLive = Logger.replaceScoped(Logger.defaultLogger, bothLoggers).pipe(
  Layer.provide(NodeFileSystem.layer)
)

const program = Effect.log('Hello')

// Run the program, writing logs to both the console (pretty format)
// and "/tmp/log.txt" (logfmt)
Effect.runFork(program.pipe(Effect.provide(LoggerLive)))
```

# [Runtime](https://effect.website/docs/platform/runtime/)
