## Built-in Loggers

Effect provides several built-in loggers that you can use depending on your logging needs. These loggers offer different formats, each suited for different environments or purposes, such as development, production, or integration with external logging services.

Each logger is available in two forms: the logger itself, and a layer that uses the logger and sends its output to the `Console` [default service](/docs/requirements-management/default-services/). For example, the `structuredLogger` logger generates logs in a detailed object-based format, while the `structured` layer uses the same logger and writes the output to the `Console` service.

### stringLogger (default)

The `stringLogger` logger produces logs in a human-readable key-value style. This format is commonly used in development and production because it is simple and easy to read in the console.

This logger does not have a corresponding layer because it is the default logger.

```ts twoslash
import { Effect } from "effect"

const program = Effect.log("msg1", "msg2", ["msg3", "msg4"]).pipe(
  Effect.delay("100 millis"),
  Effect.annotateLogs({ key1: "value1", key2: "value2" }),
  Effect.withLogSpan("myspan")
)

Effect.runFork(program)
```

Output:

```ansi showLineNumbers=false
timestamp=2024-12-28T10:44:31.281Z level=INFO fiber=#0 message=msg1 message=msg2 message="[
  \"msg3\",
  \"msg4\"
]" myspan=102ms key2=value2 key1=value1
```

### logfmtLogger

The `logfmtLogger` logger produces logs in a human-readable key-value format, similar to the [stringLogger](#stringlogger-default) logger. The main difference is that `logfmtLogger` removes extra spaces to make logs more compact.

```ts twoslash
import { Effect, Logger } from "effect"

const program = Effect.log("msg1", "msg2", ["msg3", "msg4"]).pipe(
  Effect.delay("100 millis"),
  Effect.annotateLogs({ key1: "value1", key2: "value2" }),
  Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.logFmt)))
```

Output:

```ansi showLineNumbers=false
timestamp=2024-12-28T10:44:31.281Z level=INFO fiber=#0 message=msg1 message=msg2 message="[\"msg3\",\"msg4\"]" myspan=102ms key2=value2 key1=value1
```

### prettyLogger

The `prettyLogger` logger enhances log output by using color and indentation for better readability, making it particularly useful during development when visually scanning logs in the console.

```ts twoslash
import { Effect, Logger } from "effect"

const program = Effect.log("msg1", "msg2", ["msg3", "msg4"]).pipe(
  Effect.delay("100 millis"),
  Effect.annotateLogs({ key1: "value1", key2: "value2" }),
  Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.pretty)))
```

Output:

```ansi showLineNumbers=false
[11:37:14.265] [32mINFO[0m (#0) myspan=101ms: [1;36mmsg1[0m
  msg2
  [ [32m'msg3'[0m, [32m'msg4'[0m ]
  key2: value2
  key1: value1
```

### structuredLogger

The `structuredLogger` logger produces logs in a detailed object-based format. This format is helpful when you need more traceable logs, especially if other systems analyze them or store them for later review.

```ts twoslash
import { Effect, Logger } from "effect"

const program = Effect.log("msg1", "msg2", ["msg3", "msg4"]).pipe(
  Effect.delay("100 millis"),
  Effect.annotateLogs({ key1: "value1", key2: "value2" }),
  Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.structured)))
```

Output:

```ansi showLineNumbers=false
{
  message: [ 'msg1', 'msg2', [ 'msg3', 'msg4' ] ],
  logLevel: 'INFO',
  timestamp: '2024-12-28T10:44:31.281Z',
  cause: undefined,
  annotations: { key2: 'value2', key1: 'value1' },
  spans: { myspan: 102 },
  fiberId: '#0'
}
```

| Field         | Description                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `message`     | Either a single processed value or an array of processed values, depending on how many messages are logged.                                                              |
| `logLevel`    | A string that indicates the log level label (for example, "INFO" or "DEBUG").                                                                                            |
| `timestamp`   | An ISO 8601 timestamp for when the log was generated (for example, "2024-01-01T00:00:00.000Z").                                                                          |
| `cause`       | A string that shows detailed error information, or `undefined` if no cause was provided.                                                                                 |
| `annotations` | An object where each key is an annotation label and the corresponding value is parsed into a structured format (for instance, `{"key": "value"}`).                       |
| `spans`       | An object mapping each span label to its duration in milliseconds, measured from its start time until the moment the logger was called (for example, `{"myspan": 102}`). |
| `fiberId`     | The identifier of the fiber that generated this log (for example, "#0").                                                                                                 |

### jsonLogger

The `jsonLogger` logger produces logs in JSON format. This can be useful for tools or services that parse and store JSON logs.
It calls `JSON.stringify` on the object created by the [structuredLogger](#structuredlogger) logger.

```ts twoslash
import { Effect, Logger } from "effect"

const program = Effect.log("msg1", "msg2", ["msg3", "msg4"]).pipe(
  Effect.delay("100 millis"),
  Effect.annotateLogs({ key1: "value1", key2: "value2" }),
  Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.json)))
```

Output:

```ansi showLineNumbers=false
{"message":["msg1","msg2",["msg3","msg4"]],"logLevel":"INFO","timestamp":"2024-12-28T10:44:31.281Z","annotations":{"key2":"value2","key1":"value1"},"spans":{"myspan":102},"fiberId":"#0"}
```
