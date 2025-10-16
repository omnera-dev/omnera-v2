## encodedBoundSchema

The `Schema.encodedBoundSchema` function is similar to `Schema.encodedSchema` but preserves the refinements up to the first transformation point in the
original schema.

**Function Signature**

```ts showLineNumbers=false
declare const encodedBoundSchema: <A, I, R>(schema: Schema<A, I, R>) => Schema<I>
```

The term "bound" in this context refers to the boundary up to which refinements are preserved when extracting the encoded form of a schema. It essentially marks the limit to which initial validations and structure are maintained before any transformations are applied.

**Example** (Retaining Initial Refinements Only)

```ts twoslash
import { Schema } from 'effect'

const Original = Schema.Struct({
  foo: Schema.String.pipe(Schema.minLength(3), Schema.compose(Schema.Trim)),
})

// The EncodedBoundSchema schema preserves the minLength(3) refinement,
// ensuring the string length condition is enforced
// but omits the Schema.Trim transformation.
const EncodedBoundSchema = Schema.encodedBoundSchema(Original)

// EncodedBoundSchema is equivalent to:
const EncodedBoundSchema2 = Schema.Struct({
  foo: Schema.String.pipe(Schema.minLength(3)),
})
```

# [Schema to Standard Schema](https://effect.website/docs/schema/standard-schema/)
