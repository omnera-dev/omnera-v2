## Decoding

When working with unknown data types in TypeScript, decoding them into a known structure can be challenging. Luckily, `effect/Schema` provides several functions to help with this process. Let's explore how to decode unknown values using these functions.

| API                    | Description                                                                      |
| ---------------------- | -------------------------------------------------------------------------------- |
| `decodeUnknownSync`    | Synchronously decodes a value and throws an error if parsing fails.              |
| `decodeUnknownOption`  | Decodes a value and returns an [Option](/docs/data-types/option/) type.          |
| `decodeUnknownEither`  | Decodes a value and returns an [Either](/docs/data-types/either/) type.          |
| `decodeUnknownPromise` | Decodes a value and returns a `Promise`.                                         |
| `decodeUnknown`        | Decodes a value and returns an [Effect](/docs/getting-started/the-effect-type/). |

### decodeUnknownSync

The `Schema.decodeUnknownSync` function is useful when you want to parse a value and immediately throw an error if the parsing fails.

**Example** (Using `decodeUnknownSync` for Immediate Decoding)

```ts twoslash
import { Schema } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// Simulate an unknown input
const input: unknown = { name: "Alice", age: 30 }

// Example of valid input matching the schema
console.log(Schema.decodeUnknownSync(Person)(input))
// Output: { name: 'Alice', age: 30 }

// Example of invalid input that does not match the schema
console.log(Schema.decodeUnknownSync(Person)(null))
/*
throws:
ParseError: Expected { readonly name: string; readonly age: number }, actual null
*/
```

### decodeUnknownEither

The `Schema.decodeUnknownEither` function allows you to parse a value and receive the result as an [Either](/docs/data-types/either/), representing success (`Right`) or failure (`Left`). This approach lets you handle parsing errors more gracefully without throwing exceptions.

**Example** (Using `Schema.decodeUnknownEither` for Error Handling)

```ts twoslash
import { Schema } from "effect"
import { Either } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

const decode = Schema.decodeUnknownEither(Person)

// Simulate an unknown input
const input: unknown = { name: "Alice", age: 30 }

// Attempt decoding a valid input
const result1 = decode(input)
if (Either.isRight(result1)) {
  console.log(result1.right)
  /*
  Output:
  { name: "Alice", age: 30 }
  */
}

// Simulate decoding an invalid input
const result2 = decode(null)
if (Either.isLeft(result2)) {
  console.log(result2.left)
  /*
  Output:
  {
    _id: 'ParseError',
    message: 'Expected { readonly name: string; readonly age: number }, actual null'
  }
  */
}
```

### decodeUnknown

If your schema involves asynchronous transformations, the `Schema.decodeUnknownSync` and `Schema.decodeUnknownEither` functions will not be suitable.
In such cases, you should use the `Schema.decodeUnknown` function, which returns an [Effect](/docs/getting-started/the-effect-type/).

**Example** (Handling Asynchronous Decoding)

```ts twoslash
import { Schema } from "effect"
import { Effect } from "effect"

const PersonId = Schema.Number

const Person = Schema.Struct({
  id: PersonId,
  name: Schema.String,
  age: Schema.Number
})

const asyncSchema = Schema.transformOrFail(PersonId, Person, {
  strict: true,
  // Decode with simulated async transformation
  decode: (id) =>
    Effect.succeed({ id, name: "name", age: 18 }).pipe(
      Effect.delay("10 millis")
    ),
  encode: (person) =>
    Effect.succeed(person.id).pipe(Effect.delay("10 millis"))
})

// Attempting to use a synchronous decoder on an async schema
console.log(Schema.decodeUnknownEither(asyncSchema)(1))
/*
Output:
{
  _id: 'Either',
  _tag: 'Left',
  left: {
    _id: 'ParseError',
    message: '(number <-> { readonly id: number; readonly name: string; readonly age: number })\n' +
      '└─ cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work'
  }
}
*/

// Decoding asynchronously with `Schema.decodeUnknown`
Effect.runPromise(Schema.decodeUnknown(asyncSchema)(1)).then(console.log)
/*
Output:
{ id: 1, name: 'name', age: 18 }
*/
```

In the code above, the first approach using `Schema.decodeUnknownEither` results in an error indicating that the transformation cannot be resolved synchronously.
This occurs because `Schema.decodeUnknownEither` is not designed for async operations.
The second approach, which uses `Schema.decodeUnknown`, works correctly, allowing you to handle asynchronous transformations and return the expected result.
