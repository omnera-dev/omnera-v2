## Defects

If an unexpected defect occurs during validation, it is reported as a single issue without a `path`. This ensures that unexpected errors do not disrupt schema validation but are still captured and reported.

**Example** (Handling Defects)

```ts twoslash
import { Effect, Schema } from "effect"

// Define a schema with a defect in the decode function
const defect = Schema.transformOrFail(Schema.String, Schema.String, {
  // Simulate an internal failure
  decode: () => Effect.die("Boom!"),
  encode: Effect.succeed
})

// Generate a Standard Schema V1 object
const defectStandardSchema = Schema.standardSchemaV1(defect)

// Validate input, triggering a defect
console.log(defectStandardSchema["~standard"].validate("a"))
/*
Output:
{ issues: [ { message: 'Error: Boom!' } ] }
*/
```

# [Schema Transformations](https://effect.website/docs/schema/transformations/)
