## Interop With Data

The [Data](/docs/data-types/data/) module in the Effect ecosystem simplifies value comparison by automatically implementing the [Equal](/docs/trait/equal/) and [Hash](/docs/trait/hash/) traits. This eliminates the need for manual implementations, making equality checks straightforward.

**Example** (Comparing Structs with Data)

```ts twoslash
import { Data, Equal } from 'effect'

const person1 = Data.struct({ name: 'Alice', age: 30 })
const person2 = Data.struct({ name: 'Alice', age: 30 })

console.log(Equal.equals(person1, person2))
// Output: true
```

By default, schemas like `Schema.Struct` do not implement the `Equal` and `Hash` traits. This means that two decoded objects with identical values will not be considered equal.

**Example** (Default Behavior Without `Equal` and `Hash`)

```ts twoslash
import { Schema } from 'effect'
import { Equal } from 'effect'

const schema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

const decode = Schema.decode(schema)

const person1 = decode({ name: 'Alice', age: 30 })
const person2 = decode({ name: 'Alice', age: 30 })

console.log(Equal.equals(person1, person2))
// Output: false
```

The `Schema.Data` function can be used to enhance a schema by including the `Equal` and `Hash` traits. This allows the resulting objects to support value-based equality.

**Example** (Using `Schema.Data` to Add Equality)

```ts twoslash
import { Schema } from 'effect'
import { Equal } from 'effect'

const schema = Schema.Data(
  Schema.Struct({
    name: Schema.String,
    age: Schema.Number,
  })
)

const decode = Schema.decode(schema)

const person1 = decode({ name: 'Alice', age: 30 })
const person2 = decode({ name: 'Alice', age: 30 })

console.log(Equal.equals(person1, person2))
// Output: true
```
