## Omitting

The `omit` static function available in each struct schema can be used to create a new `Struct` by excluding particular properties from an existing `Struct`.

**Example** (Omitting Properties from a Struct)

```ts twoslash
import { Schema } from "effect"

// Define a struct schema with properties "a", "b", and "c"
const MyStruct = Schema.Struct({
  a: Schema.String,
  b: Schema.Number,
  c: Schema.Boolean
})

// Create a new schema that omits property "b"
//
//      ┌─── Schema.Struct<{
//      |      a: typeof Schema.String;
//      |      c: typeof Schema.Boolean;
//      |    }>
//      ▼
const PickedSchema = MyStruct.omit("b")
```

The `Schema.omit` function can be applied more broadly beyond just `Struct` types, such as with unions of schemas.
However it returns a generic `Schema`.

**Example** (Omitting Properties from a Union)

```ts twoslash
import { Schema } from "effect"

// Define a union of two struct schemas
const MyUnion = Schema.Union(
  Schema.Struct({ a: Schema.String, b: Schema.String, c: Schema.String }),
  Schema.Struct({ a: Schema.Number, b: Schema.Number, d: Schema.Number })
)

// Create a new schema that omits property "b"
//
//      ┌─── SchemaClass<{
//      |      readonly a: string | number;
//      |    }>
//      ▼
const PickedSchema = MyUnion.pipe(Schema.omit("b"))
```
