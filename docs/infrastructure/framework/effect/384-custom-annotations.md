## Custom Annotations

You can enhance your log outputs by adding custom annotations using the `Effect.annotateLogs` function.
This allows you to attach extra metadata to each log entry, improving traceability and providing additional context.

### Adding a Single Annotation

You can apply a single annotation as a key/value pair to all log entries within an effect.

**Example** (Single Key/Value Annotation)

```ts twoslash
import { Effect } from "effect"

const program = Effect.gen(function* () {
  yield* Effect.log("message1")
  yield* Effect.log("message2")
}).pipe(
  // Annotation as key/value pair
  Effect.annotateLogs("key", "value")
)

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message=message1 key=value
timestamp=... level=INFO fiber=#0 message=message2 key=value
*/
```

In this example, all logs generated within the `program` will include the annotation `key=value`.

<Aside type="tip" title="Scope of Annotations">
  Annotations applied with `Effect.annotateLogs` are automatically added
  to all logs generated within the annotated effect's scope, including
  logs from nested effects.
</Aside>

### Annotations with Nested Effects

Annotations propagate to all logs generated within nested or downstream effects. This ensures that logs from any child effects inherit the parent effect's annotations.

**Example** (Propagating Annotations to Nested Effects)

In this example, the annotation `key=value` is included in all logs, even those from the nested `anotherProgram` effect.

```ts twoslash
import { Effect } from "effect"

// Define a child program that logs an error
const anotherProgram = Effect.gen(function* () {
  yield* Effect.logError("error1")
})

// Define the main program
const program = Effect.gen(function* () {
  yield* Effect.log("message1")
  yield* Effect.log("message2")
  yield* anotherProgram // Call the nested program
}).pipe(
  // Attach an annotation to all logs in the scope
  Effect.annotateLogs("key", "value")
)

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message=message1 key=value
timestamp=... level=INFO fiber=#0 message=message2 key=value
timestamp=... level=ERROR fiber=#0 message=error1 key=value
*/
```

### Adding Multiple Annotations

You can also apply multiple annotations at once by passing an object with key/value pairs. Each key/value pair will be added to every log entry within the effect.

**Example** (Multiple Annotations)

```ts twoslash
import { Effect } from "effect"

const program = Effect.gen(function* () {
  yield* Effect.log("message1")
  yield* Effect.log("message2")
}).pipe(
  // Add multiple annotations
  Effect.annotateLogs({ key1: "value1", key2: "value2" })
)

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message=message1 key2=value2 key1=value1
timestamp=... level=INFO fiber=#0 message=message2 key2=value2 key1=value1
*/
```

In this case, each log will contain both `key1=value1` and `key2=value2`.

### Scoped Annotations

If you want to limit the scope of your annotations so that they only apply to certain log entries, you can use `Effect.annotateLogsScoped`. This function confines the annotations to logs produced within a specific scope.

**Example** (Scoped Annotations)

```ts twoslash
import { Effect } from "effect"

const program = Effect.gen(function* () {
  yield* Effect.log("no annotations") // No annotations
  yield* Effect.annotateLogsScoped({ key: "value" }) // Scoped annotation
  yield* Effect.log("message1") // Annotation applied
  yield* Effect.log("message2") // Annotation applied
}).pipe(
  Effect.scoped,
  // Outside scope, no annotations
  Effect.andThen(Effect.log("no annotations again"))
)

Effect.runFork(program)
/*
Output:
timestamp=... level=INFO fiber=#0 message="no annotations"
timestamp=... level=INFO fiber=#0 message=message1 key=value
timestamp=... level=INFO fiber=#0 message=message2 key=value
timestamp=... level=INFO fiber=#0 message="no annotations again"
*/
```
