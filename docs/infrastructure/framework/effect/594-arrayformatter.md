## ArrayFormatter

The `ArrayFormatter` provides a structured, array-based approach to formatting errors. It represents each error as an object, making it easier to analyze and address multiple issues during data decoding or encoding. Each error object includes properties like `_tag`, `path`, and `message` for clarity.

**Example** (Single Error in Array Format)

```ts twoslash
import { Either, Schema, ParseResult } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

const decode = Schema.decodeUnknownEither(Person)

const result = decode({})
if (Either.isLeft(result)) {
  console.error("Decoding failed:")
  console.error(ParseResult.ArrayFormatter.formatErrorSync(result.left))
}
/*
Decoding failed:
[ { _tag: 'Missing', path: [ 'name' ], message: 'is missing' } ]
*/
```

In this example:

- `_tag`: Indicates the type of error (`Missing`).
- `path`: Specifies the location of the error in the data (`['name']`).
- `message`: Describes the issue (`'is missing'`).

### Handling Multiple Errors

By default, decoding functions like `Schema.decodeUnknownEither` report only the first error. To list all errors, use the `{ errors: "all" }` option.

**Example** (Listing All Errors)

```ts twoslash
import { Either, Schema, ParseResult } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

const decode = Schema.decodeUnknownEither(Person, { errors: "all" })

const result = decode({})
if (Either.isLeft(result)) {
  console.error("Decoding failed:")
  console.error(ParseResult.ArrayFormatter.formatErrorSync(result.left))
}
/*
Decoding failed:
[
  { _tag: 'Missing', path: [ 'name' ], message: 'is missing' },
  { _tag: 'Missing', path: [ 'age' ], message: 'is missing' }
]
*/
```
