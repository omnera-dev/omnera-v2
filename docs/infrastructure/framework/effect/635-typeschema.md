## typeSchema

The `Schema.typeSchema` function is used to extract the `Type` portion of a schema, resulting in a new schema that retains only the type-specific properties from the original schema. This excludes any initial encoding or transformation logic applied to the original schema.

**Function Signature**

```ts showLineNumbers=false
declare const typeSchema: <A, I, R>(schema: Schema<A, I, R>) => Schema<A>
```

**Example** (Extracting Only Type-Specific Properties)

```ts twoslash
import { Schema } from 'effect'

const Original = Schema.Struct({
  quantity: Schema.NumberFromString.pipe(Schema.greaterThanOrEqualTo(2)),
})

// This creates a schema where 'quantity' is defined as a number
// that must be greater than or equal to 2.
const TypeSchema = Schema.typeSchema(Original)

// TypeSchema is equivalent to:
const TypeSchema2 = Schema.Struct({
  quantity: Schema.Number.pipe(Schema.greaterThanOrEqualTo(2)),
})
```
