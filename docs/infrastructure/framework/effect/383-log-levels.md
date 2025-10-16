## Log Levels

### logDebug

By default, `DEBUG` messages **are not displayed**. To enable `DEBUG` logs, you can adjust the logging configuration using `Logger.withMinimumLogLevel`, setting the minimum level to `LogLevel.Debug`.

**Example** (Enabling Debug Logs)

```ts twoslash
import { Effect, Logger, LogLevel } from 'effect'

const task1 = Effect.gen(function* () {
  yield* Effect.sleep('2 seconds')
  yield* Effect.logDebug('task1 done') // Log a debug message
}).pipe(Logger.withMinimumLogLevel(LogLevel.Debug)) // Enable DEBUG level

const task2 = Effect.gen(function* () {
  yield* Effect.sleep('1 second')
  yield* Effect.logDebug('task2 done') // This message won't be logged
})

const program = Effect.gen(function* () {
  yield* Effect.log('start')
  yield* task1
  yield* task2
  yield* Effect.log('done')
})

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO message=start
timestamp=... level=DEBUG message="task1 done" <-- 2 seconds later
timestamp=... level=INFO message=done <-- 1 second later
*/
```

<Aside type="tip" title="Controlling Log Levels Per Effect">
  By using `Logger.withMinimumLogLevel(effect, level)`, you can enable
  different log levels for specific parts of your program, providing
  fine-grained control over logging behavior.
</Aside>

### logInfo

The `INFO` log level is displayed by default. This level is typically used for general application events or progress updates.

**Example** (Logging at the Info Level)

```ts twoslash
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  yield* Effect.logInfo('start')
  yield* Effect.sleep('2 seconds')
  yield* Effect.sleep('1 second')
  yield* Effect.logInfo('done')
})

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO message=start
timestamp=... level=INFO message=done <-- 3 seconds later
*/
```

### logWarning

The `WARN` log level is displayed by default. This level is intended for potential issues or warnings that do not immediately disrupt the flow of the program but should be monitored.

**Example** (Logging at the Warning Level)

```ts twoslash
import { Effect, Either } from 'effect'

const task = Effect.fail('Oh uh!').pipe(Effect.as(2))

const program = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(task)
  if (Either.isLeft(failureOrSuccess)) {
    yield* Effect.logWarning(failureOrSuccess.left)
    return 0
  } else {
    return failureOrSuccess.right
  }
})

Effect.runFork(program)
/*
Output:
timestamp=... level=WARN fiber=#0 message="Oh uh!"
*/
```

### logError

The `ERROR` log level is displayed by default. These messages represent issues that need to be addressed.

**Example** (Logging at the Error Level)

```ts twoslash
import { Effect, Either } from 'effect'

const task = Effect.fail('Oh uh!').pipe(Effect.as(2))

const program = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(task)
  if (Either.isLeft(failureOrSuccess)) {
    yield* Effect.logError(failureOrSuccess.left)
    return 0
  } else {
    return failureOrSuccess.right
  }
})

Effect.runFork(program)
/*
Output:
timestamp=... level=ERROR fiber=#0 message="Oh uh!"
*/
```

### logFatal

The `FATAL` log level is displayed by default. This log level is typically reserved for unrecoverable errors.

**Example** (Logging at the Fatal Level)

```ts twoslash
import { Effect, Either } from 'effect'

const task = Effect.fail('Oh uh!').pipe(Effect.as(2))

const program = Effect.gen(function* () {
  const failureOrSuccess = yield* Effect.either(task)
  if (Either.isLeft(failureOrSuccess)) {
    yield* Effect.logFatal(failureOrSuccess.left)
    return 0
  } else {
    return failureOrSuccess.right
  }
})

Effect.runFork(program)
/*
Output:
timestamp=... level=FATAL fiber=#0 message="Oh uh!"
*/
```
