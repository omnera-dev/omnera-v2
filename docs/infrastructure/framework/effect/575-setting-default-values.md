## Setting Default Values

When creating objects, you might want to assign default values to certain fields to simplify object construction. The `Schema.withConstructorDefault` function lets you handle default values, making fields optional in the default constructor.

**Example** (Struct with Required Fields)

In this example, all fields are required when creating a new instance.

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.NonEmptyString,
  age: Schema.Number,
})

// Both name and age must be provided
console.log(Person.make({ name: 'John', age: 30 }))
/*
Output: { name: 'John', age: 30 }
*/
```

**Example** (Struct with Default Value)

Here, the `age` field is optional because it has a default value of `0`.

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.NonEmptyString,
  age: Schema.Number.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => 0)
  ),
})

// The age field is optional and defaults to 0
console.log(Person.make({ name: 'John' }))
/*
Output:
{ name: 'John', age: 0 }
*/

console.log(Person.make({ name: 'John', age: 30 }))
/*
Output:
{ name: 'John', age: 30 }
*/
```

### Nested Structs and Shallow Defaults

Default values in schemas are shallow, meaning that defaults defined in nested structs do not automatically propagate to the top-level constructor.

**Example** (Shallow Defaults in Nested Structs)

```ts twoslash
import { Schema } from 'effect'

const Config = Schema.Struct({
  // Define a nested struct with a default value
  web: Schema.Struct({
    application_url: Schema.String.pipe(
      Schema.propertySignature,
      Schema.withConstructorDefault(() => 'http://localhost')
    ),
    application_port: Schema.Number,
  }),
})

// This will cause a type error because `application_url`
// is missing in the nested struct
// @errors: 2741
Config.make({ web: { application_port: 3000 } })
```

This behavior occurs because the `Schema` interface does not include a type parameter to carry over default constructor types from nested structs.

To work around this limitation, extract the constructor for the nested struct and apply it to its fields directly. This ensures that the nested defaults are respected.

**Example** (Using Nested Struct Constructors)

```ts twoslash
import { Schema } from 'effect'

const Config = Schema.Struct({
  web: Schema.Struct({
    application_url: Schema.String.pipe(
      Schema.propertySignature,
      Schema.withConstructorDefault(() => 'http://localhost')
    ),
    application_port: Schema.Number,
  }),
})

// Extract the nested struct constructor
const { web: Web } = Config.fields

// Use the constructor for the nested struct
console.log(Config.make({ web: Web.make({ application_port: 3000 }) }))
/*
Output:
{
  web: {
    application_url: 'http://localhost',
    application_port: 3000
  }
}
*/
```

### Lazy Evaluation of Defaults

Defaults are lazily evaluated, meaning that a new instance of the default is generated every time the constructor is called:

**Example** (Lazy Evaluation of Defaults)

In this example, the `timestamp` field generates a new value for each instance.

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.NonEmptyString,
  age: Schema.Number.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => 0)
  ),
  timestamp: Schema.Number.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => new Date().getTime())
  ),
})

console.log(Person.make({ name: 'name1' }))
/*
Example Output:
{ age: 0, timestamp: 1714232909221, name: 'name1' }
*/

console.log(Person.make({ name: 'name2' }))
/*
Example Output:
{ age: 0, timestamp: 1714232909227, name: 'name2' }
*/
```

### Reusing Defaults Across Schemas

Default values are also "portable", meaning that if you reuse the same property signature in another schema, the default is carried over:

**Example** (Reusing Defaults in Another Schema)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.NonEmptyString,
  age: Schema.Number.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => 0)
  ),
  timestamp: Schema.Number.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => new Date().getTime())
  ),
})

const AnotherSchema = Schema.Struct({
  foo: Schema.String,
  age: Person.fields.age,
})

console.log(AnotherSchema.make({ foo: 'bar' }))
/*
Output:
{ foo: 'bar', age: 0 }
*/
```

### Using Defaults in Classes

Default values can also be applied when working with the `Class` API, ensuring consistency across class-based schemas.

**Example** (Defaults in a Class)

```ts twoslash
import { Schema } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  name: Schema.NonEmptyString,
  age: Schema.Number.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => 0)
  ),
  timestamp: Schema.Number.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => new Date().getTime())
  ),
}) {}

console.log(new Person({ name: 'name1' }))
/*
Example Output:
Person { age: 0, timestamp: 1714400867208, name: 'name1' }
*/

console.log(new Person({ name: 'name2' }))
/*
Example Output:
Person { age: 0, timestamp: 1714400867215, name: 'name2' }
*/
```

# [Effect Data Types](https://effect.website/docs/schema/effect-data-types/)
