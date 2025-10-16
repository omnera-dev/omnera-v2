## Extracting Inferred Types

### Type

Once you've defined a schema (`Schema<Type, Encoded, Context>`), you can extract the inferred type `Type` in two ways:

1. Using the `Schema.Type` utility
2. Accessing the `Type` field directly on your schema

**Example** (Extracting Inferred Type)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

// 1. Using the Schema.Type utility
type Person = Schema.Schema.Type<typeof Person>

// 2. Accessing the Type field directly
type Person2 = typeof Person.Type
```

The resulting type will look like this:

```ts showLineNumbers=false
type Person = {
  readonly name: string
  readonly age: number
}
```

Alternatively, you can extract the `Person` type using the `interface` keyword, which may improve readability and performance in some cases.

**Example** (Extracting Type with an Interface)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

interface Person extends Schema.Schema.Type<typeof Person> {}
```

Both approaches yield the same result, but using an interface provides benefits such as performance advantages and improved readability.

### Encoded

In a `Schema<Type, Encoded, Context>`, the `Encoded` type can differ from the `Type` type, representing the format in which data is encoded. You can extract the `Encoded` type in two ways:

1. Using the `Schema.Encoded` utility
2. Accessing the `Encoded` field directly on the schema

**Example** (Extracting the Encoded Type)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  // a schema that decodes a string to a number
  age: Schema.NumberFromString,
})

// 1. Using the Schema.Encoded utility
type PersonEncoded = Schema.Schema.Encoded<typeof Person>

// 2. Accessing the Encoded field directly
type PersonEncoded2 = typeof Person.Encoded
```

The resulting type is:

```ts showLineNumbers=false
type PersonEncoded = {
  readonly name: string
  readonly age: string
}
```

Note that `age` is of type `string` in the `Encoded` type of the schema and is of type `number` in the `Type` type of the schema.

Alternatively, you can define the `PersonEncoded` type using the `interface` keyword, which can enhance readability and performance.

**Example** (Extracting Encoded Type with an Interface)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  // a schema that decodes a string to a number
  age: Schema.NumberFromString,
})

interface PersonEncoded extends Schema.Schema.Encoded<typeof Person> {}
```

Both approaches yield the same result, but using an interface provides benefits such as performance advantages and improved readability.

### Context

In a `Schema<Type, Encoded, Context>`, the `Context` type represents any external data or dependencies that the schema requires to perform encoding or decoding. You can extract the inferred `Context` type in two ways:

1. Using the `Schema.Context` utility.
2. Accessing the `Context` field on the schema.

**Example** (Extracting the Context Type)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

// 1. Using the Schema.Context utility
type PersonContext = Schema.Schema.Context<typeof Person>

// 2. Accessing the Context field directly
type PersonContext2 = typeof Person.Context
```

### Schemas with Opaque Types

When defining a schema, you may want to create a schema with an opaque type. This is useful when you want to hide the internal structure of the schema and only expose the type of the schema.

**Example** (Creating an Opaque Schema)

To create a schema with an opaque type, you can use the following technique that re-declares the schema:

```ts twoslash
import { Schema } from 'effect'

// Define the schema structure
const _Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

// Declare the type interface to make it opaque
interface Person extends Schema.Schema.Type<typeof _Person> {}

// Re-declare the schema as opaque
const Person: Schema.Schema<Person> = _Person
```

Alternatively, you can use the Class APIs (see the [Class APIs](/docs/schema/classes/) section for more details).

Note that the technique shown above becomes more complex when the schema is defined such that `Type` is different from `Encoded`.

**Example** (Opaque Schema with Different Type and Encoded)

```ts twoslash "NumberFromString"
import { Schema } from 'effect'

// Define the schema structure, with a field that
// decodes a string to a number
const _Person = Schema.Struct({
  name: Schema.String,
  age: Schema.NumberFromString,
})

// Create the `Type` interface for an opaque schema
interface Person extends Schema.Schema.Type<typeof _Person> {}

// Create the `Encoded` interface for an opaque schema
interface PersonEncoded extends Schema.Schema.Encoded<typeof _Person> {}

// Re-declare the schema with opaque Type and Encoded
const Person: Schema.Schema<Person, PersonEncoded> = _Person
```

In this case, the field `"age"` is of type `string` in the `Encoded` type of the schema and is of type `number` in the `Type` type of the schema. Therefore, we need to define **two** interfaces (`PersonEncoded` and `Person`) and use both to redeclare our final schema `Person`.
