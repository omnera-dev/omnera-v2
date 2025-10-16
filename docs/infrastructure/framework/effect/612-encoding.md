## Encoding

The `Schema` module provides several `encode*` functions to encode data according to a schema:

| API             | Description                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| `encodeSync`    | Synchronously encodes data and throws an error if encoding fails.                                    |
| `encodeOption`  | Encodes data and returns an [Option](/docs/data-types/option/) type.                                 |
| `encodeEither`  | Encodes data and returns an [Either](/docs/data-types/either/) type representing success or failure. |
| `encodePromise` | Encodes data and returns a `Promise`.                                                                |
| `encode`        | Encodes data and returns an [Effect](/docs/getting-started/the-effect-type/).                        |

**Example** (Using `Schema.encodeSync` for Immediate Encoding)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  // Ensure name is a non-empty string
  name: Schema.NonEmptyString,
  // Allow age to be decoded from a string and encoded to a string
  age: Schema.NumberFromString,
})

// Valid input: encoding succeeds and returns expected types
console.log(Schema.encodeSync(Person)({ name: 'Alice', age: 30 }))
// Output: { name: 'Alice', age: '30' }

// Invalid input: encoding fails due to empty name string
console.log(Schema.encodeSync(Person)({ name: '', age: 30 }))
/*
throws:
ParseError: { readonly name: NonEmptyString; readonly age: NumberFromString }
└─ ["name"]
   └─ NonEmptyString
      └─ Predicate refinement failure
         └─ Expected a non empty string, actual ""
*/
```

Note that during encoding, the number value `30` was converted to a string `"30"`.

### Handling Unsupported Encoding

In certain cases, it may not be feasible to support encoding for a schema. While it is generally advised to define schemas that allow both decoding and encoding, there are situations where encoding a particular type is either unsupported or unnecessary. In these instances, the `Forbidden` issue can signal that encoding is not available for certain values.

**Example** (Using `Forbidden` to Indicate Unsupported Encoding)

Here is an example of a transformation that never fails during decoding. It returns an [Either](/docs/data-types/either/) containing either the decoded value or the original input. For encoding, it is reasonable to not support it and use `Forbidden` as the result.

```ts twoslash
import { Either, ParseResult, Schema } from 'effect'

// Define a schema that safely decodes to Either type
export const SafeDecode = <A, I>(self: Schema.Schema<A, I, never>) => {
  const decodeUnknownEither = Schema.decodeUnknownEither(self)
  return Schema.transformOrFail(
    Schema.Unknown,
    Schema.EitherFromSelf({
      left: Schema.Unknown,
      right: Schema.typeSchema(self),
    }),
    {
      strict: true,
      // Decode: map a failed result to the input as Left,
      // successful result as Right
      decode: (input) =>
        ParseResult.succeed(Either.mapLeft(decodeUnknownEither(input), () => input)),
      // Encode: only support encoding Right values,
      // Left values raise Forbidden error
      encode: (actual, _, ast) =>
        Either.match(actual, {
          onLeft: () =>
            ParseResult.fail(new ParseResult.Forbidden(ast, actual, 'cannot encode a Left')),
          // Successfully encode a Right value
          onRight: ParseResult.succeed,
        }),
    }
  )
}
```

**Explanation**

- **Decoding**: The `SafeDecode` function ensures that decoding never fails. It wraps the decoded value in an [Either](/docs/data-types/either/), where a successful decoding results in a `Right` and a failed decoding results in a `Left` containing the original input.
- **Encoding**: The encoding process uses the `Forbidden` error to indicate that encoding a `Left` value is not supported. Only `Right` values are successfully encoded.
