## Arrays

The Schema module allows you to define schemas for arrays, making it easy to validate collections of elements of a specific type.

**Example** (Defining an Array Schema)

```ts twoslash
import { Schema } from "effect"

// Define a schema for an array of numbers
//
//      ┌─── Array$<typeof Schema.Number>
//      ▼
const schema = Schema.Array(Schema.Number)

//     ┌─── readonly number[]
//     ▼
type Type = typeof schema.Type
```

### Mutable Arrays

By default, `Schema.Array` generates a type marked as `readonly`.
To create a schema for a mutable array, you can use the `Schema.mutable` function, which makes the array type mutable in a **shallow** manner.

**Example** (Creating a Mutable Array Schema)

```ts twoslash
import { Schema } from "effect"

// Define a schema for a mutable array of numbers
//
//      ┌─── mutable<Schema.Array$<typeof Schema.Number>>
//      ▼
const schema = Schema.mutable(Schema.Array(Schema.Number))

//     ┌─── number[]
//     ▼
type Type = typeof schema.Type
```

### Exposed Values

You can access the value type of an array schema using the `value` property:

**Example** (Accessing the Value Type of an Array Schema)

```ts twoslash
import { Schema } from "effect"

const schema = Schema.Array(Schema.Number)

// Access the value type of the array schema
//
//      ┌─── typeof Schema.Number
//      ▼
const value = schema.value
```
