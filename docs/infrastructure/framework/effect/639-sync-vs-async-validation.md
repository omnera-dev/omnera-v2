## Sync vs Async Validation

The `Schema.standardSchemaV1` API creates a schema whose `validate` method attempts to decode and validate the provided input synchronously. If the underlying `Schema` includes any asynchronous components (e.g., asynchronous message resolutions
or checks), then validation will necessarily return a `Promise` instead.

**Example** (Handling Synchronous and Asynchronous Validation)

```ts twoslash
import { Effect, Schema } from 'effect'

// Utility function to display sync and async results
const print = <T>(t: T) =>
  t instanceof Promise
    ? t.then((x) => console.log('Promise', JSON.stringify(x, null, 2)))
    : console.log('Value', JSON.stringify(t, null, 2))

// Define a synchronous schema
const sync = Schema.Struct({
  name: Schema.String,
})

// Generate a Standard Schema V1 object
const syncStandardSchema = Schema.standardSchemaV1(sync)

// Validate synchronously
print(syncStandardSchema['~standard'].validate({ name: null }))
/*
Output:
{
  "issues": [
    {
      "path": [
        "name"
      ],
      "message": "Expected string, actual null"
    }
  ]
}
*/

// Define an asynchronous schema with a transformation
const async = Schema.transformOrFail(
  sync,
  Schema.Struct({
    name: Schema.NonEmptyString,
  }),
  {
    // Simulate an asynchronous validation delay
    decode: (x) => Effect.sleep('100 millis').pipe(Effect.as(x)),
    encode: Effect.succeed,
  }
)

// Generate a Standard Schema V1 object
const asyncStandardSchema = Schema.standardSchemaV1(async)

// Validate asynchronously
print(asyncStandardSchema['~standard'].validate({ name: '' }))
/*
Output:
Promise {
  "issues": [
    {
      "path": [
        "name"
      ],
      "message": "Expected a non empty string, actual \"\""
    }
  ]
}
*/
```
