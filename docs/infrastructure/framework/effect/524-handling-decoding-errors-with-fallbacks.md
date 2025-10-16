## Handling Decoding Errors with Fallbacks

The `DecodingFallbackAnnotation` allows you to handle decoding errors by providing a custom fallback logic.

```ts showLineNumbers=false
type DecodingFallbackAnnotation<A> = (
  issue: ParseIssue
) => Effect<A, ParseIssue>
```

This annotation enables you to specify fallback behavior when decoding fails, making it possible to recover gracefully from errors.

**Example** (Basic Fallback)

In this basic example, when decoding fails (e.g., the input is `null`), the fallback value is returned instead of an error.

```ts twoslash
import { Schema } from "effect"
import { Either } from "effect"

// Schema with a fallback value
const schema = Schema.String.annotations({
  decodingFallback: () => Either.right("<fallback>")
})

console.log(Schema.decodeUnknownSync(schema)("valid input"))
// Output: valid input

console.log(Schema.decodeUnknownSync(schema)(null))
// Output: <fallback>
```

**Example** (Advanced Fallback with Logging)

In this advanced example, when a decoding error occurs, the schema logs the issue and then returns a fallback value.
This demonstrates how you can incorporate logging and other side effects during error handling.

```ts twoslash
import { Schema } from "effect"
import { Effect } from "effect"

// Schema with logging and fallback
const schemaWithLog = Schema.String.annotations({
  decodingFallback: (issue) =>
    Effect.gen(function* () {
      // Log the error issue
      yield* Effect.log(issue._tag)
      // Simulate a delay
      yield* Effect.sleep(10)
      // Return a fallback value
      return yield* Effect.succeed("<fallback>")
    })
})

// Run the effectful fallback logic
Effect.runPromise(Schema.decodeUnknown(schemaWithLog)(null)).then(
  console.log
)
/*
Output:
timestamp=2024-07-25T13:22:37.706Z level=INFO fiber=#0 message=Type
<fallback>
*/
```
