## Type Guards

The `Schema.is` function provides a way to verify if a value conforms to a given schema. It acts as a [type guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates), taking a value of type `unknown` and determining if it matches the structure and type constraints defined in the schema.

Here's how the `Schema.is` function works:

1. **Schema Definition**: Define a schema to describe the structure and constraints of the data type you expect. For instance, `Schema<Type, Encoded, Context>`, where `Type` is the target type you want to validate against.

2. **Type Guard Creation**: Use the schema to create a user-defined type guard, `(u: unknown) => u is Type`. This function can be used at runtime to check if a value meets the requirements of the schema.

<Aside type="note" title="Role of the Encoded Type in Type Guards">
  The type `Encoded`, which is often used in schema transformations, does
  not affect the creation of the type guard. The main purpose is to ensure
  that the input matches the desired type `Type`.
</Aside>

**Example** (Creating and Using a Type Guard)

```ts twoslash
import { Schema } from "effect"

// Define a schema for a Person object
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// Generate a type guard from the schema
const isPerson = Schema.is(Person)

// Test the type guard with various inputs
console.log(isPerson({ name: "Alice", age: 30 }))
// Output: true

console.log(isPerson(null))
// Output: false

console.log(isPerson({}))
// Output: false
```

The generated `isPerson` function has the following signature:

```ts showLineNumbers=false
const isPerson: (
  u: unknown,
  overrideOptions?: number | ParseOptions
) => u is {
  readonly name: string
  readonly age: number
}
```
