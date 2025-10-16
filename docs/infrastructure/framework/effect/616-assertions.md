## Assertions

While type guards verify whether a value conforms to a specific type, the `Schema.asserts` function goes further by asserting that an input matches the schema type `Type` (from `Schema<Type, Encoded, Context>`).
If the input does not match the schema, it throws a detailed error, making it useful for runtime validation.

<Aside type="note" title="Role of the Encoded Type in Assertions">
  The type `Encoded`, which is often used in schema transformations, does
  not affect the creation of the assertion. The main purpose is to ensure
  that the input matches the desired type `Type`.
</Aside>

**Example** (Creating and Using an Assertion)

```ts twoslash
import { Schema } from "effect"

// Define a schema for a Person object
const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// Generate an assertion function from the schema
const assertsPerson: Schema.Schema.ToAsserts<typeof Person> =
  Schema.asserts(Person)

try {
  // Attempt to assert that the input matches the Person schema
  assertsPerson({ name: "Alice", age: "30" })
} catch (e) {
  console.error("The input does not match the schema:")
  console.error(e)
}
/*
throws:
The input does not match the schema:
{
  _id: 'ParseError',
  message: '{ readonly name: string; readonly age: number }\n' +
    '└─ ["age"]\n' +
    '   └─ Expected number, actual "30"'
}
*/

// This input matches the schema and will not throw an error
assertsPerson({ name: "Alice", age: 30 })
```

The `assertsPerson` function generated from the schema has the following signature:

```ts showLineNumbers=false
const assertsPerson: (
  input: unknown,
  overrideOptions?: number | ParseOptions
) => asserts input is {
  readonly name: string
  readonly age: number
}
```
