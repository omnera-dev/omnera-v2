## required

The `Schema.required` function ensures that all properties in a schema are mandatory.

**Example** (Making All Properties Required)

```ts twoslash
import { Schema } from "effect"

// Create a schema and make all properties required
const schema = Schema.required(
  Schema.Struct({
    a: Schema.optionalWith(Schema.String, { exact: true }),
    b: Schema.optionalWith(Schema.Number, { exact: true })
  })
)

//     ┌─── { readonly a: string; readonly b: number; }
//     ▼
type Type = typeof schema.Type
```

In this example, both `a` and `b` are made required, even though they were initially defined as optional.
