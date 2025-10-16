## encodedSchema

The `Schema.encodedSchema` function enables you to extract the `Encoded` portion of a schema, creating a new schema that matches the original properties but **omits any refinements or transformations** applied to the schema.

**Function Signature**

```ts showLineNumbers=false
declare const encodedSchema: <A, I, R>(schema: Schema<A, I, R>) => Schema<I>
```

**Example** (Extracting Encoded Properties Only)

```ts twoslash
import { Schema } from 'effect'

const Original = Schema.Struct({
  quantity: Schema.String.pipe(Schema.minLength(3)),
})

// This creates a schema where 'quantity' is just a string,
// disregarding the minLength refinement.
const Encoded = Schema.encodedSchema(Original)

// Encoded is equivalent to:
const Encoded2 = Schema.Struct({
  quantity: Schema.String,
})
```
