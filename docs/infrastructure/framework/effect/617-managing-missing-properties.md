## Managing Missing Properties

When decoding, it's important to understand how missing properties are processed. By default, if a property is not present in the input, it is treated as if it were present with an `undefined` value.

**Example** (Default Behavior of Missing Properties)

```ts twoslash
import { Schema } from 'effect'

const schema = Schema.Struct({ a: Schema.Unknown })
const input = {}

console.log(Schema.decodeUnknownSync(schema)(input))
// Output: { a: undefined }
```

In this example, although the key `"a"` is not present in the input, it is treated as `{ a: undefined }` by default.

If you need your validation logic to differentiate between genuinely missing properties and those explicitly set to `undefined`, you can enable the `exact` option.

**Example** (Setting `exact: true` to Distinguish Missing Properties)

```ts twoslash
import { Schema } from 'effect'

const schema = Schema.Struct({ a: Schema.Unknown })
const input = {}

console.log(Schema.decodeUnknownSync(schema)(input, { exact: true }))
/*
throws
ParseError: { readonly a: unknown }
└─ ["a"]
   └─ is missing
*/
```

For the APIs `Schema.is` and `Schema.asserts`, however, the default behavior is to treat missing properties strictly, where the default for `exact` is `true`:

**Example** (Strict Handling of Missing Properties with `Schema.is` and `Schema.asserts`)

```ts twoslash
import type { SchemaAST } from 'effect'
import { Schema } from 'effect'

const schema = Schema.Struct({ a: Schema.Unknown })
const input = {}

console.log(Schema.is(schema)(input))
// Output: false

console.log(Schema.is(schema)(input, { exact: false }))
// Output: true

const asserts: (
  u: unknown,
  overrideOptions?: SchemaAST.ParseOptions
) => asserts u is {
  readonly a: unknown
} = Schema.asserts(schema)

try {
  asserts(input)
  console.log('asserts passed')
} catch (e: any) {
  console.error('asserts failed')
  console.error(e.message)
}
/*
Output:
asserts failed
{ readonly a: unknown }
└─ ["a"]
  └─ is missing
*/

try {
  asserts(input, { exact: false })
  console.log('asserts passed')
} catch (e: any) {
  console.error('asserts failed')
  console.error(e.message)
}
// Output: asserts passed
```
