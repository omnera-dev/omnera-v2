## Error Handling in Constructors

Default constructors are considered "unsafe" because they throw an error if the input does not conform to the schema. This error includes a detailed description of what went wrong. The intention behind default constructors is to provide a straightforward way to create valid values, such as for tests or configurations, where invalid inputs are expected to be exceptional cases.

If you need a "safe" constructor that does not throw errors but instead returns a result indicating success or failure, you can use `Schema.validateEither`.

**Example** (Using `Schema.validateEither` for Safe Validation)

```ts twoslash
import { Schema } from "effect"

const schema = Schema.NumberFromString.pipe(Schema.between(1, 10))

// Create a safe constructor that validates an unknown input
const safeMake = Schema.validateEither(schema)

// Valid input returns a Right value
console.log(safeMake(5))
/*
Output:
{ _id: 'Either', _tag: 'Right', right: 5 }
*/

// Invalid input returns a Left value with detailed error information
console.log(safeMake(20))
/*
Output:
{
  _id: 'Either',
  _tag: 'Left',
  left: {
    _id: 'ParseError',
    message: 'between(1, 10)\n' +
      '└─ Predicate refinement failure\n' +
      '   └─ Expected a number between 1 and 10, actual 20'
  }
}
*/

// This will throw an error because it's unsafe
schema.make(20)
/*
throws:
ParseError: between(1, 10)
└─ Predicate refinement failure
   └─ Expected a number between 1 and 10, actual 20
*/
```
