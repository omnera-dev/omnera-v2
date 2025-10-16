## Non Empty Arrays

The Schema module also provides a way to define schemas for non-empty arrays, ensuring that the array always contains at least one element.

**Example** (Defining a Non-Empty Array Schema)

```ts twoslash
import { Schema } from 'effect'

// Define a schema for a non-empty array of numbers
//
//      ┌─── NonEmptyArray<typeof Schema.Number>
//      ▼
const schema = Schema.NonEmptyArray(Schema.Number)

//     ┌─── readonly [number, ...number[]]
//     ▼
type Type = typeof schema.Type
```

### Exposed Values

You can access the value type of a non-empty array schema using the `value` property:

**Example** (Accessing the Value Type of a Non-Empty Array Schema)

```ts twoslash
import { Schema } from 'effect'

// Define a schema for a non-empty array of numbers
const schema = Schema.NonEmptyArray(Schema.Number)

// Access the value type of the non-empty array schema
//
//      ┌─── typeof Schema.Number
//      ▼
const value = schema.value
```
