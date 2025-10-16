## asSchema

To make it easier to work with schemas, built-in schemas are exposed with shorter, opaque types when possible.

The `Schema.asSchema` function allows you to view any schema as `Schema<Type, Encoded, Context>`.

**Example** (Expanding a Schema with `asSchema`)

For example, while `Schema.String` is defined as a class with a type of `typeof Schema.String`, using `Schema.asSchema` provides the schema in its extended form as `Schema<string, string, never>`.

```ts twoslash
import { Schema } from 'effect'

//     ┌─── typeof Schema.String
//     ▼
const schema = Schema.String

//     ┌─── Schema<string, string, never>
//     ▼
const nomalized = Schema.asSchema(schema)
```
