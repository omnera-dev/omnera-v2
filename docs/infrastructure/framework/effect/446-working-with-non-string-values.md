## Working with Non-String Values

By default, `KeyValueStore` works with `string` and `Uint8Array` values. To store other types such as objects, numbers, or booleans, use the `forSchema` method to create a `SchemaStore`.

A `SchemaStore` uses a [schema](/docs/schema/introduction/) to validate and convert values. Internally, it serializes data using `JSON.stringify` and deserializes it with `JSON.parse`.

**Example** (Storing a Typed Object Using a Schema)

```ts twoslash
import {
  KeyValueStore,
  layerMemory
} from "@effect/platform/KeyValueStore"
import { Effect, Schema } from "effect"

// Define a JSON-compatible schema
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

const program = Effect.gen(function* () {
  // Create a typed store based on the schema
  const kv = (yield* KeyValueStore).forSchema(Person)

  // Store a typed value
  const value = { name: "Alice", age: 30 }
  yield* kv.set("user1", value)
  console.log(yield* kv.size)

  // Retrieve the value
  console.log(yield* kv.get("user1"))
})

// Use the in-memory store for this example
Effect.runPromise(program.pipe(Effect.provide(layerMemory)))
/*
Output:
1
{ _id: 'Option', _tag: 'Some', value: { name: 'Alice', age: 30 } }
*/
```

# [Path](https://effect.website/docs/platform/path/)
