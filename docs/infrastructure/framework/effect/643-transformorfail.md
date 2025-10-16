## transformOrFail

While the [Schema.transform](#transform) function is suitable for error-free transformations,
the `Schema.transformOrFail` function is designed for more complex scenarios where **transformations
can fail** during the decoding or encoding stages.

This function enables decoding/encoding functions to return either a successful result or an error,
making it particularly useful for validating and processing data that might not always conform to expected formats.

### Error Handling

The `Schema.transformOrFail` function utilizes the ParseResult module to manage potential errors:

| Constructor           | Description                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| `ParseResult.succeed` | Indicates a successful transformation, where no errors occurred.                                 |
| `ParseResult.fail`    | Signals a failed transformation, creating a new `ParseError` based on the provided `ParseIssue`. |

Additionally, the ParseResult module provides constructors for dealing with various types of parse issues, such as:

| Parse Issue Type | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `Type`           | Indicates a type mismatch error.                                                              |
| `Missing`        | Used when a required field is missing.                                                        |
| `Unexpected`     | Used for unexpected fields that are not allowed in the schema.                                |
| `Forbidden`      | Flags the decoding or encoding operation being forbidden by the schema.                       |
| `Pointer`        | Points to a specific location in the data where an issue occurred.                            |
| `Refinement`     | Used when a value does not meet a specific refinement or constraint.                          |
| `Transformation` | Flags issues that occur during transformation from one type to another.                       |
| `Composite`      | Represents a composite error, combining multiple issues into one, helpful for grouped errors. |

These tools allow for detailed and specific error handling, enhancing the reliability of data processing operations.

**Example** (Converting a String to a Number)

A common use case for `Schema.transformOrFail` is converting string representations of numbers into actual numeric types. This scenario is typical when dealing with user inputs or data from external sources.

```ts twoslash
import { ParseResult, Schema } from 'effect'

export const NumberFromString = Schema.transformOrFail(
  // Source schema: accepts any string
  Schema.String,
  // Target schema: expects a number
  Schema.Number,
  {
    // optional but you get better error messages from TypeScript
    strict: true,
    decode: (input, options, ast) => {
      const parsed = parseFloat(input)
      // If parsing fails (NaN), return a ParseError with a custom error
      if (isNaN(parsed)) {
        return ParseResult.fail(
          // Create a Type Mismatch error
          new ParseResult.Type(
            // Provide the schema's abstract syntax tree for context
            ast,
            // Include the problematic input
            input,
            // Optional custom error message
            'Failed to convert string to number'
          )
        )
      }
      return ParseResult.succeed(parsed)
    },
    encode: (input, options, ast) => ParseResult.succeed(input.toString()),
  }
)

//     ┌─── string
//     ▼
type Encoded = typeof NumberFromString.Encoded

//     ┌─── number
//     ▼
type Type = typeof NumberFromString.Type

console.log(Schema.decodeUnknownSync(NumberFromString)('123'))
// Output: 123

console.log(Schema.decodeUnknownSync(NumberFromString)('-'))
/*
throws:
ParseError: (string <-> number)
└─ Transformation process failure
   └─ Failed to convert string to number
*/
```

Both `decode` and `encode` functions not only receive the value to transform (`input`), but also the [parse options](/docs/schema/getting-started/#parse-options) that the user sets when using the resulting schema, and the `ast`, which represents the low level definition of the schema you're transforming.

### Async Transformations

In modern applications, especially those interacting with external APIs, you might need to transform data asynchronously. `Schema.transformOrFail` supports asynchronous transformations by allowing you to return an `Effect`.

**Example** (Validating Data with an API Call)

Consider a scenario where you need to validate a person's ID by making an API call. Here's how you can implement it:

```ts twoslash
import { Effect, Schema, ParseResult } from 'effect'

// Define a function to make API requests
const get = (url: string): Effect.Effect<unknown, Error> =>
  Effect.tryPromise({
    try: () =>
      fetch(url).then((res) => {
        if (res.ok) {
          return res.json() as Promise<unknown>
        }
        throw new Error(String(res.status))
      }),
    catch: (e) => new Error(String(e)),
  })

// Create a branded schema for a person's ID
const PeopleId = Schema.String.pipe(Schema.brand('PeopleId'))

// Define a schema with async transformation
const PeopleIdFromString = Schema.transformOrFail(Schema.String, PeopleId, {
  strict: true,
  decode: (s, _, ast) =>
    // Make an API call to validate the ID
    Effect.mapBoth(get(`https://swapi.dev/api/people/${s}`), {
      // Error handling for failed API call
      onFailure: (e) => new ParseResult.Type(ast, s, e.message),
      // Return the ID if the API call succeeds
      onSuccess: () => s,
    }),
  encode: ParseResult.succeed,
})

//     ┌─── string
//     ▼
type Encoded = typeof PeopleIdFromString.Encoded

//     ┌─── string & Brand<"PeopleId">
//     ▼
type Type = typeof PeopleIdFromString.Type

//     ┌─── never
//     ▼
type Context = typeof PeopleIdFromString.Context

// Run a successful decode operation
Effect.runPromiseExit(Schema.decodeUnknown(PeopleIdFromString)('1')).then(console.log)
/*
Output:
{ _id: 'Exit', _tag: 'Success', value: '1' }
*/

// Run a decode operation that will fail
Effect.runPromiseExit(Schema.decodeUnknown(PeopleIdFromString)('fail')).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: {
      _id: 'ParseError',
      message: '(string <-> string & Brand<"PeopleId">)\n' +
        '└─ Transformation process failure\n' +
        '   └─ Error: 404'
    }
  }
}
*/
```

### Declaring Dependencies

In cases where your transformation depends on external services, you can inject these services in the `decode` or `encode` functions. These dependencies are then tracked in the `Requirements` channel of the schema:

```text showLineNumbers=false "Requirements"
Schema<Type, Encoded, Requirements>
```

**Example** (Validating Data with a Service)

```ts twoslash {46}
import { Context, Effect, Schema, ParseResult, Layer } from 'effect'

// Define a Validation service for dependency injection
class Validation extends Context.Tag('Validation')<
  Validation,
  {
    readonly validatePeopleid: (s: string) => Effect.Effect<void, Error>
  }
>() {}

// Create a branded schema for a person's ID
const PeopleId = Schema.String.pipe(Schema.brand('PeopleId'))

// Transform a string into a validated PeopleId,
// using an external validation service
const PeopleIdFromString = Schema.transformOrFail(Schema.String, PeopleId, {
  strict: true,
  decode: (s, _, ast) =>
    // Asynchronously validate the ID using the injected service
    Effect.gen(function* () {
      // Access the validation service
      const validator = yield* Validation
      // Use service to validate ID
      yield* validator.validatePeopleid(s)
      return s
    }).pipe(Effect.mapError((e) => new ParseResult.Type(ast, s, e.message))),
  encode: ParseResult.succeed, // Encode by simply returning the string
})

//     ┌─── string
//     ▼
type Encoded = typeof PeopleIdFromString.Encoded

//     ┌─── string & Brand<"PeopleId">
//     ▼
type Type = typeof PeopleIdFromString.Type

//     ┌─── Validation
//     ▼
type Context = typeof PeopleIdFromString.Context

// Layer to provide a successful validation service
const SuccessTest = Layer.succeed(Validation, {
  validatePeopleid: (_) => Effect.void,
})

// Run a successful decode operation
Effect.runPromiseExit(
  Schema.decodeUnknown(PeopleIdFromString)('1').pipe(Effect.provide(SuccessTest))
).then(console.log)
/*
Output:
{ _id: 'Exit', _tag: 'Success', value: '1' }
*/

// Layer to provide a failing validation service
const FailureTest = Layer.succeed(Validation, {
  validatePeopleid: (_) => Effect.fail(new Error('404')),
})

// Run a decode operation that will fail
Effect.runPromiseExit(
  Schema.decodeUnknown(PeopleIdFromString)('fail').pipe(Effect.provide(FailureTest))
).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: {
      _id: 'ParseError',
      message: '(string <-> string & Brand<"PeopleId">)\n' +
        '└─ Transformation process failure\n' +
        '   └─ Error: 404'
    }
  }
}
*/
```
