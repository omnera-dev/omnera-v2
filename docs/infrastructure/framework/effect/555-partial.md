## partial

The `Schema.partial` function makes all properties within a schema optional.

**Example** (Making All Properties Optional)

```ts twoslash
import { Schema } from 'effect'

// Create a schema with an optional property "a"
const schema = Schema.partial(Schema.Struct({ a: Schema.String }))

//     ┌─── { readonly a?: string | undefined; }
//     ▼
type Type = typeof schema.Type
```

By default, the `Schema.partial` operation adds `undefined` to the type of each property. If you want to avoid this, you can use `Schema.partialWith` and pass `{ exact: true }` as an argument.

**Example** (Defining an Exact Partial Schema)

```ts twoslash
import { Schema } from 'effect'

// Create a schema with an optional property "a" without allowing undefined
const schema = Schema.partialWith(
  Schema.Struct({
    a: Schema.String,
  }),
  { exact: true }
)

//     ┌─── { readonly a?: string; }
//     ▼
type Type = typeof schema.Type
```
