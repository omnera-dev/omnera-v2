## Definition

To define a class using `Schema.Class`, you need to specify:

- The **type** of the class being created.
- A unique **identifier** for the class.
- The desired **fields**.

**Example** (Defining a Schema Class)

```ts twoslash
import { Schema } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {}
```

In this example, `Person` is both a schema and a TypeScript class. Instances of `Person` are created using the defined schema, ensuring compliance with the specified fields.

**Example** (Creating Instances)

```ts twoslash
import { Schema } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {}

console.log(new Person({ id: 1, name: 'John' }))
/*
Output:
Person { id: 1, name: 'John' }
*/

// Using the factory function
console.log(Person.make({ id: 1, name: 'John' }))
/*
Output:
Person { id: 1, name: 'John' }
*/
```

<Aside type="note" title="Why Use Identifiers?">
  You need to specify an identifier to make the class global. This ensures that two classes with the same identifier refer to the same instance, avoiding reliance on `instanceof` checks.

This behavior is similar to how we handle other class-based APIs like [Context.Tag](/docs/requirements-management/services/#creating-a-service).

Using a unique identifier is particularly useful in scenarios where live reloads can occur, as it helps preserve the instance across reloads. It ensures there is no duplication of instances (although it shouldn't happen, some bundlers and frameworks can behave unpredictably).

</Aside>

### Class Schemas are Transformations

Class schemas [transform](/docs/schema/transformations/) a struct schema into a [declaration](/docs/schema/advanced-usage/#declaring-new-data-types) schema that represents a class type.

- When decoding, a plain object is converted into an instance of the class.
- When encoding, a class instance is converted back into a plain object.

**Example** (Decoding and Encoding a Class)

```ts twoslash
import { Schema } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {}

const person = Person.make({ id: 1, name: 'John' })

// Decode from a plain object into a class instance
const decoded = Schema.decodeUnknownSync(Person)({ id: 1, name: 'John' })
console.log(decoded)
// Output: Person { id: 1, name: 'John' }

// Encode a class instance back into a plain object
const encoded = Schema.encodeUnknownSync(Person)(person)
console.log(encoded)
// Output: { id: 1, name: 'John' }
```

### Defining Classes Without Fields

When your schema does not require any fields, you can define a class with an empty object.

**Example** (Defining and Using a Class Without Arguments)

```ts twoslash
import { Schema } from 'effect'

// Define a class with no fields
class NoArgs extends Schema.Class<NoArgs>('NoArgs')({}) {}

// Create an instance using the default constructor
const noargs1 = new NoArgs()

// Alternatively, create an instance by explicitly passing an empty object
const noargs2 = new NoArgs({})
```

### Defining Classes With Filters

Filters allow you to validate input when decoding, encoding, or creating an instance. Instead of specifying raw fields, you can pass a `Schema.Struct` with a filter applied.

**Example** (Applying a Filter to a Schema Class)

```ts twoslash
import { Schema } from 'effect'

class WithFilter extends Schema.Class<WithFilter>('WithFilter')(
  Schema.Struct({
    a: Schema.NumberFromString,
    b: Schema.NumberFromString,
  }).pipe(Schema.filter(({ a, b }) => a >= b || 'a must be greater than b'))
) {}

// Constructor
console.log(new WithFilter({ a: 1, b: 2 }))
/*
throws:
ParseError: WithFilter (Constructor)
└─ Predicate refinement failure
   └─ a must be greater than b
*/

// Decoding
console.log(Schema.decodeUnknownSync(WithFilter)({ a: '1', b: '2' }))
/*
throws:
ParseError: (WithFilter (Encoded side) <-> WithFilter)
└─ Encoded side transformation failure
   └─ WithFilter (Encoded side)
      └─ Predicate refinement failure
         └─ a must be greater than b
*/
```
