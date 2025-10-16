## Parse Options

The options below provide control over both decoding and encoding behaviors.

### Managing Excess properties

By default, any properties not defined in the schema are removed from the output when parsing a value. This ensures the parsed data conforms strictly to the expected structure.

If you want to detect and handle unexpected properties, use the `onExcessProperty` option (default value: `"ignore"`), which allows you to raise an error for excess properties. This can be helpful when you need to validate and catch unanticipated properties.

**Example** (Setting `onExcessProperty` to `"error"`)

```ts twoslash
import { Schema } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// Excess properties are ignored by default
console.log(
  Schema.decodeUnknownSync(Person)({
    name: "Bob",
    age: 40,
    email: "bob@example.com" // Ignored
  })
)
/*
Output:
{ name: 'Bob', age: 40 }
*/

// With `onExcessProperty` set to "error",
// an error is thrown for excess properties
Schema.decodeUnknownSync(Person)(
  {
    name: "Bob",
    age: 40,
    email: "bob@example.com" // Will raise an error
  },
  { onExcessProperty: "error" }
)
/*
throws
ParseError: { readonly name: string; readonly age: number }
└─ ["email"]
   └─ is unexpected, expected: "name" | "age"
*/
```

To retain extra properties, set `onExcessProperty` to `"preserve"`.

**Example** (Setting `onExcessProperty` to `"preserve"`)

```ts twoslash
import { Schema } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// Excess properties are preserved in the output
console.log(
  Schema.decodeUnknownSync(Person)(
    {
      name: "Bob",
      age: 40,
      email: "bob@example.com"
    },
    { onExcessProperty: "preserve" }
  )
)
/*
{ email: 'bob@example.com', name: 'Bob', age: 40 }
*/
```

### Receive all errors

The `errors` option enables you to retrieve all errors encountered during parsing. By default, only the first error is returned. Setting `errors` to `"all"` provides comprehensive error feedback, which can be useful for debugging or offering detailed validation feedback.

**Example** (Setting `errors` to `"all"`)

```ts twoslash
import { Schema } from "effect"

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

// Attempt to parse with multiple issues in the input data
Schema.decodeUnknownSync(Person)(
  {
    name: "Bob",
    age: "abc",
    email: "bob@example.com"
  },
  { errors: "all", onExcessProperty: "error" }
)
/*
throws
ParseError: { readonly name: string; readonly age: number }
├─ ["email"]
│  └─ is unexpected, expected: "name" | "age"
└─ ["age"]
   └─ Expected number, actual "abc"
*/
```

### Managing Property Order

The `propertyOrder` option provides control over the order of object fields in the output. This feature is particularly useful when the sequence of keys is important for the consuming processes or when maintaining the input order enhances readability and usability.

By default, the `propertyOrder` option is set to `"none"`. This means that the internal system decides the order of keys to optimize parsing speed.
The order of keys in this mode should not be considered stable, and it's recommended not to rely on key ordering as it may change in future updates.

Setting `propertyOrder` to `"original"` ensures that the keys are ordered as they appear in the input during the decoding/encoding process.

**Example** (Synchronous Decoding)

```ts twoslash
import { Schema } from "effect"

const schema = Schema.Struct({
  a: Schema.Number,
  b: Schema.Literal("b"),
  c: Schema.Number
})

// Default decoding, where property order is system-defined
console.log(Schema.decodeUnknownSync(schema)({ b: "b", c: 2, a: 1 }))
// Output may vary: { a: 1, b: 'b', c: 2 }

// Decoding while preserving input order
console.log(
  Schema.decodeUnknownSync(schema)(
    { b: "b", c: 2, a: 1 },
    { propertyOrder: "original" }
  )
)
// Output preserves input order: { b: 'b', c: 2, a: 1 }
```

**Example** (Asynchronous Decoding)

```ts twoslash
import type { Duration } from "effect"
import { Effect, ParseResult, Schema } from "effect"

// Helper function to simulate an async operation in schema
const effectify = (duration: Duration.DurationInput) =>
  Schema.Number.pipe(
    Schema.transformOrFail(Schema.Number, {
      strict: true,
      decode: (x) =>
        Effect.sleep(duration).pipe(
          Effect.andThen(ParseResult.succeed(x))
        ),
      encode: ParseResult.succeed
    })
  )

// Define a structure with asynchronous behavior in each field
const schema = Schema.Struct({
  a: effectify("200 millis"),
  b: effectify("300 millis"),
  c: effectify("100 millis")
}).annotations({ concurrency: 3 })

// Default decoding, where property order is system-defined
Schema.decode(schema)({ a: 1, b: 2, c: 3 })
  .pipe(Effect.runPromise)
  .then(console.log)
// Output decided internally: { c: 3, a: 1, b: 2 }

// Decoding while preserving input order
Schema.decode(schema)({ a: 1, b: 2, c: 3 }, { propertyOrder: "original" })
  .pipe(Effect.runPromise)
  .then(console.log)
// Output preserving input order: { a: 1, b: 2, c: 3 }
```

### Customizing Parsing Behavior at the Schema Level

The `parseOptions` annotation allows you to customize parsing behavior at different schema levels, enabling you to apply unique parsing settings to nested schemas within a structure. Options defined within a schema override parent-level settings and apply to all nested schemas.

**Example** (Using `parseOptions` to Customize Error Handling)

```ts twoslash
import { Schema } from "effect"
import { Either } from "effect"

const schema = Schema.Struct({
  a: Schema.Struct({
    b: Schema.String,
    c: Schema.String
  }).annotations({
    title: "first error only",
    // Limit errors to the first in this sub-schema
    parseOptions: { errors: "first" }
  }),
  d: Schema.String
}).annotations({
  title: "all errors",
  // Capture all errors for the main schema
  parseOptions: { errors: "all" }
})

// Decode input with custom error-handling behavior
const result = Schema.decodeUnknownEither(schema)(
  { a: {} },
  { errors: "first" }
)
if (Either.isLeft(result)) {
  console.log(result.left.message)
}
/*
all errors
├─ ["a"]
│  └─ first error only
│     └─ ["b"]
│        └─ is missing
└─ ["d"]
   └─ is missing
*/
```

**Detailed Output Explanation:**

In this example:

- The main schema is configured to display all errors. Hence, you will see errors related to both the `d` field (since it's missing) and any errors from the `a` subschema.
- The subschema (`a`) is set to display only the first error. Although both `b` and `c` fields are missing, only the first missing field (`b`) is reported.
