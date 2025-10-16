## Composition

Combining and reusing schemas is often needed in complex applications, and the `Schema.compose` combinator provides an efficient way to do this. With `Schema.compose`, you can chain two schemas, `Schema<B, A, R1>` and `Schema<C, B, R2>`, into a single schema `Schema<C, A, R1 | R2>`:

**Example** (Composing Schemas to Parse a Delimited String into Numbers)

```ts twoslash
import { Schema } from "effect"

// Schema to split a string by commas into an array of strings
//
//     ┌─── Schema<readonly string[], string, never>
//     ▼
const schema1 = Schema.asSchema(Schema.split(","))

// Schema to convert an array of strings to an array of numbers
//
//     ┌─── Schema<readonly number[], readonly string[], never>
//     ▼
const schema2 = Schema.asSchema(Schema.Array(Schema.NumberFromString))

// Composed schema that takes a string, splits it by commas,
// and converts the result into an array of numbers
//
//     ┌─── Schema<readonly number[], string, never>
//     ▼
const ComposedSchema = Schema.asSchema(Schema.compose(schema1, schema2))
```

### Non-strict Option

When composing schemas, you may encounter cases where the output of one schema does not perfectly match the input of the next, for example, if you have `Schema<R1, A, B>` and `Schema<R2, C, D>` where `C` differs from `B`. To handle these cases, you can use the `{ strict: false }` option to relax type constraints.

**Example** (Using Non-strict Option in Composition)

```ts twoslash
import { Schema } from "effect"

// Without the `strict: false` option,
// this composition raises a TypeScript error
Schema.compose(
// @errors: 2769
  Schema.Union(Schema.Null, Schema.Literal("0")),
  Schema.NumberFromString
)

// Use `strict: false` to allow type flexibility
Schema.compose(
  Schema.Union(Schema.Null, Schema.Literal("0")),
  Schema.NumberFromString,
  { strict: false }
)
```
