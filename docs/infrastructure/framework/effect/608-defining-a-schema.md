## Defining a schema

One common way to define a `Schema` is by utilizing the `Struct` constructor.
This constructor allows you to create a new schema that outlines an object with specific properties.
Each property in the object is defined by its own schema, which specifies the data type and any validation rules.

**Example** (Defining a Simple Object Schema)

This `Person` schema describes an object with a `name` (string) and `age` (number) property:

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})
```
