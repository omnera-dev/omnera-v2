## keyof

The `Schema.keyof` operation creates a schema that represents the keys of a given object schema.

**Example** (Extracting Keys from an Object Schema)

```ts twoslash
import { Schema } from "effect"

const schema = Schema.Struct({
  a: Schema.String,
  b: Schema.Number
})

const keys = Schema.keyof(schema)

//     ┌─── "a" | "b"
//     ▼
type Type = typeof keys.Type
```

# [Class APIs](https://effect.website/docs/schema/classes/)
