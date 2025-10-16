## String Transformations

### split

Splits a string by a specified delimiter into an array of substrings.

**Example** (Splitting a String by Comma)

```ts twoslash
import { Schema } from 'effect'

const schema = Schema.split(',')

const decode = Schema.decodeUnknownSync(schema)

console.log(decode('')) // [""]
console.log(decode(',')) // ["", ""]
console.log(decode('a,')) // ["a", ""]
console.log(decode('a,b')) // ["a", "b"]
```

### Trim

Removes whitespace from the beginning and end of a string.

**Example** (Trimming Whitespace)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.Trim)

console.log(decode('a')) // "a"
console.log(decode(' a')) // "a"
console.log(decode('a ')) // "a"
console.log(decode(' a ')) // "a"
```

<Aside type="tip" title="Trimmed Check">
  If you were looking for a combinator to check if a string is trimmed,
  check out the `Schema.trimmed` filter.
</Aside>

### Lowercase

Converts a string to lowercase.

**Example** (Converting to Lowercase)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.Lowercase)

console.log(decode('A')) // "a"
console.log(decode(' AB')) // " ab"
console.log(decode('Ab ')) // "ab "
console.log(decode(' ABc ')) // " abc "
```

<Aside type="tip" title="Lowercase And Lowercased">
  If you were looking for a combinator to check if a string is lowercased,
  check out the `Schema.Lowercased` schema or the `Schema.lowercased`
  filter.
</Aside>

### Uppercase

Converts a string to uppercase.

**Example** (Converting to Uppercase)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.Uppercase)

console.log(decode('a')) // "A"
console.log(decode(' ab')) // " AB"
console.log(decode('aB ')) // "AB "
console.log(decode(' abC ')) // " ABC "
```

<Aside type="tip" title="Uppercase And Uppercased">
  If you were looking for a combinator to check if a string is uppercased,
  check out the `Schema.Uppercased` schema or the `Schema.uppercased`
  filter.
</Aside>

### Capitalize

Converts the first character of a string to uppercase.

**Example** (Capitalizing a String)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.Capitalize)

console.log(decode('aa')) // "Aa"
console.log(decode(' ab')) // " ab"
console.log(decode('aB ')) // "AB "
console.log(decode(' abC ')) // " abC "
```

<Aside type="tip" title="Capitalize And Capitalized">
  If you were looking for a combinator to check if a string is
  capitalized, check out the `Schema.Capitalized` schema or the
  `Schema.capitalized` filter.
</Aside>

### Uncapitalize

Converts the first character of a string to lowercase.

**Example** (Uncapitalizing a String)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.Uncapitalize)

console.log(decode('AA')) // "aA"
console.log(decode(' AB')) // " AB"
console.log(decode('Ab ')) // "ab "
console.log(decode(' AbC ')) // " AbC "
```

<Aside type="tip" title="Uncapitalize And Uncapitalized">
  If you were looking for a combinator to check if a string is
  uncapitalized, check out the `Schema.Uncapitalized` schema or the
  `Schema.uncapitalized` filter.
</Aside>

### parseJson

The `Schema.parseJson` constructor offers a method to convert JSON strings into the `unknown` type using the underlying functionality of `JSON.parse`.
It also employs `JSON.stringify` for encoding.

**Example** (Parsing JSON Strings)

```ts twoslash
import { Schema } from 'effect'

const schema = Schema.parseJson()
const decode = Schema.decodeUnknownSync(schema)

// Parse valid JSON strings
console.log(decode('{}')) // Output: {}
console.log(decode(`{"a":"b"}`)) // Output: { a: "b" }

// Attempting to decode an empty string results in an error
decode('')
/*
throws:
ParseError: (JsonString <-> unknown)
└─ Transformation process failure
   └─ Unexpected end of JSON input
*/
```

To further refine the result of JSON parsing, you can provide a schema to the `Schema.parseJson` constructor. This schema will validate that the parsed JSON matches a specific structure.

**Example** (Parsing JSON with Structured Validation)

In this example, `Schema.parseJson` uses a struct schema to ensure the parsed JSON is an object with a numeric property `a`. This adds validation to the parsed data, confirming that it follows the expected structure.

```ts twoslash
import { Schema } from 'effect'

//     ┌─── SchemaClass<{ readonly a: number; }, string, never>
//     ▼
const schema = Schema.parseJson(Schema.Struct({ a: Schema.Number }))
```

### StringFromBase64

Decodes a base64 (RFC4648) encoded string into a UTF-8 string.

**Example** (Decoding Base64)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.StringFromBase64)

console.log(decode('Zm9vYmFy'))
// Output: "foobar"
```

### StringFromBase64Url

Decodes a base64 (URL) encoded string into a UTF-8 string.

**Example** (Decoding Base64 URL)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.StringFromBase64Url)

console.log(decode('Zm9vYmFy'))
// Output: "foobar"
```

### StringFromHex

Decodes a hex encoded string into a UTF-8 string.

**Example** (Decoding Hex String)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.StringFromHex)

console.log(new TextEncoder().encode(decode('0001020304050607')))
/*
Output:
Uint8Array(8) [
  0, 1, 2, 3,
  4, 5, 6, 7
]
*/
```

### StringFromUriComponent

Decodes a URI-encoded string into a UTF-8 string. It is useful for encoding and decoding data in URLs.

**Example** (Decoding URI Component)

```ts twoslash
import { Schema } from 'effect'

const PaginationSchema = Schema.Struct({
  maxItemPerPage: Schema.Number,
  page: Schema.Number,
})

const UrlSchema = Schema.compose(Schema.StringFromUriComponent, Schema.parseJson(PaginationSchema))

console.log(Schema.encodeSync(UrlSchema)({ maxItemPerPage: 10, page: 1 }))
// Output: %7B%22maxItemPerPage%22%3A10%2C%22page%22%3A1%7D
```
