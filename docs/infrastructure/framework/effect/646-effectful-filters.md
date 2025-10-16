## Effectful Filters

The `Schema.filterEffect` function enables validations that require asynchronous or dynamic scenarios, making it suitable for cases where validations involve side effects like network requests or database queries. For simple synchronous validations, see [`Schema.filter`](/docs/schema/filters/#declaring-filters).

**Example** (Asynchronous Username Validation)

```ts twoslash
import { Effect, Schema } from "effect"

// Mock async function to validate a username
async function validateUsername(username: string) {
  return Promise.resolve(username === "gcanti")
}

// Define a schema with an effectful filter
const ValidUsername = Schema.String.pipe(
  Schema.filterEffect((username) =>
    Effect.promise(() =>
      // Validate the username asynchronously,
      // returning an error message if invalid
      validateUsername(username).then(
        (valid) => valid || "Invalid username"
      )
    )
  )
).annotations({ identifier: "ValidUsername" })

Effect.runPromise(Schema.decodeUnknown(ValidUsername)("xxx")).then(
  console.log
)
/*
ParseError: ValidUsername
└─ Transformation process failure
   └─ Invalid username
*/
```
