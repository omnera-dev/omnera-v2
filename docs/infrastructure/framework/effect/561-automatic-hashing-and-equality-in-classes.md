## Automatic Hashing and Equality in Classes

Instances of classes created with `Schema.Class` support the [Equal](/docs/trait/equal/) trait through their integration with [Data.Class](/docs/data-types/data/#class). This enables straightforward value comparisons, even across different instances.

### Basic Equality Check

Two class instances are considered equal if their properties have identical values.

**Example** (Comparing Instances with Equal Properties)

```ts twoslash
import { Schema } from 'effect'
import { Equal } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {}

const john1 = new Person({ id: 1, name: 'John' })
const john2 = new Person({ id: 1, name: 'John' })

// Compare instances
console.log(Equal.equals(john1, john2))
// Output: true
```

### Nested or Complex Properties

The `Equal` trait performs comparisons at the first level. If a property is a more complex structure, such as an array, instances may not be considered equal, even if the arrays themselves have identical values.

**Example** (Shallow Equality for Arrays)

```ts twoslash
import { Schema } from 'effect'
import { Equal } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
  hobbies: Schema.Array(Schema.String), // Standard array schema
}) {}

const john1 = new Person({
  id: 1,
  name: 'John',
  hobbies: ['reading', 'coding'],
})
const john2 = new Person({
  id: 1,
  name: 'John',
  hobbies: ['reading', 'coding'],
})

// Equality fails because `hobbies` are not deeply compared
console.log(Equal.equals(john1, john2))
// Output: false
```

To achieve deep equality for nested structures like arrays, use `Schema.Data` in combination with `Data.array`. This enables the library to compare each element of the array rather than treating it as a single entity.

**Example** (Using `Schema.Data` for Deep Equality)

```ts twoslash
import { Schema } from 'effect'
import { Data, Equal } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
  hobbies: Schema.Data(Schema.Array(Schema.String)), // Enable deep equality
}) {}

const john1 = new Person({
  id: 1,
  name: 'John',
  hobbies: Data.array(['reading', 'coding']),
})
const john2 = new Person({
  id: 1,
  name: 'John',
  hobbies: Data.array(['reading', 'coding']),
})

// Equality succeeds because `hobbies` are deeply compared
console.log(Equal.equals(john1, john2))
// Output: true
```
