## transform

`Schema.transform` creates a new schema by taking the output of one schema (the "source") and making it the input of another schema (the "target"). Use this when you know the transformation will always succeed. If it might fail, use [Schema.transformOrFail](#transformorfail) instead.

### Understanding Input and Output

"Output" and "input" depend on what you are doing (decoding or encoding):

**When decoding:**

- The source schema `Schema<SourceType, SourceEncoded>` produces a `SourceType`.
- The target schema `Schema<TargetType, TargetEncoded>` expects a `TargetEncoded`.
- The decoding path looks like this: `SourceEncoded` → `TargetType`.

If `SourceType` and `TargetEncoded` differ, you can provide a `decode` function to convert the source schema's output into the target schema's input.

**When encoding:**

- The target schema `Schema<TargetType, TargetEncoded>` produces a `TargetEncoded`.
- The source schema `Schema<SourceType, SourceEncoded>` expects a `SourceType`.
- The encoding path looks like this: `TargetType` → `SourceEncoded`.

If `TargetEncoded` and `SourceType` differ, you can provide an `encode` function to convert the target schema's output into the source schema's input.

### Combining Two Primitive Schemas

In this example, we start with a schema that accepts `"on"` or `"off"` and transform it into a boolean schema. The `decode` function turns `"on"` into `true` and `"off"` into `false`. The `encode` function does the reverse. This gives us a `Schema<boolean, "on" | "off">`.

**Example** (Converting a String to a Boolean)

```ts twoslash
import { Schema } from "effect"

// Convert "on"/"off" to boolean and back
const BooleanFromString = Schema.transform(
  // Source schema: "on" or "off"
  Schema.Literal("on", "off"),
  // Target schema: boolean
  Schema.Boolean,
  {
    // optional but you get better error messages from TypeScript
    strict: true,
    // Transformation to convert the output of the
    // source schema ("on" | "off") into the input of the
    // target schema (boolean)
    decode: (literal) => literal === "on", // Always succeeds here
    // Reverse transformation
    encode: (bool) => (bool ? "on" : "off")
  }
)

//     ┌─── "on" | "off"
//     ▼
type Encoded = typeof BooleanFromString.Encoded

//     ┌─── boolean
//     ▼
type Type = typeof BooleanFromString.Type

console.log(Schema.decodeUnknownSync(BooleanFromString)("on"))
// Output: true
```

The `decode` function above never fails by itself. However, the full decoding process can still fail if the input does not fit the source schema. For example, if you provide `"wrong"` instead of `"on"` or `"off"`, the source schema will fail before calling `decode`.

**Example** (Handling Invalid Input)

```ts twoslash collapse={4-12}
import { Schema } from "effect"

// Convert "on"/"off" to boolean and back
const BooleanFromString = Schema.transform(
  Schema.Literal("on", "off"),
  Schema.Boolean,
  {
    strict: true,
    decode: (s) => s === "on",
    encode: (bool) => (bool ? "on" : "off")
  }
)

// Providing input not allowed by the source schema
Schema.decodeUnknownSync(BooleanFromString)("wrong")
/*
throws:
ParseError: ("on" | "off" <-> boolean)
└─ Encoded side transformation failure
   └─ "on" | "off"
      ├─ Expected "on", actual "wrong"
      └─ Expected "off", actual "wrong"
*/
```

### Combining Two Transformation Schemas

Below is an example where both the source and target schemas transform their data:

- The source schema is `Schema.NumberFromString`, which is `Schema<number, string>`.
- The target schema is `BooleanFromString` (defined above), which is `Schema<boolean, "on" | "off">`.

This example involves four types and requires two conversions:

- When decoding, convert a `number` into `"on" | "off"`. For example, treat any positive number as `"on"`.
- When encoding, convert `"on" | "off"` back into a `number`. For example, treat `"on"` as `1` and `"off"` as `-1`.

By composing these transformations, we get a schema that decodes a string into a boolean and encodes a boolean back into a string. The resulting schema is `Schema<boolean, string>`.

**Example** (Combining Two Transformation Schemas)

```ts twoslash collapse={4-12}
import { Schema } from "effect"

// Convert "on"/"off" to boolean and back
const BooleanFromString = Schema.transform(
  Schema.Literal("on", "off"),
  Schema.Boolean,
  {
    strict: true,
    decode: (s) => s === "on",
    encode: (bool) => (bool ? "on" : "off")
  }
)

const BooleanFromNumericString = Schema.transform(
  // Source schema: Convert string -> number
  Schema.NumberFromString,
  // Target schema: Convert "on"/"off" -> boolean
  BooleanFromString,
  {
    strict: true,
    // If number is positive, use "on", otherwise "off"
    decode: (n) => (n > 0 ? "on" : "off"),
    // If boolean is "on", use 1, otherwise -1
    encode: (bool) => (bool === "on" ? 1 : -1)
  }
)

//     ┌─── string
//     ▼
type Encoded = typeof BooleanFromNumericString.Encoded

//     ┌─── boolean
//     ▼
type Type = typeof BooleanFromNumericString.Type

console.log(Schema.decodeUnknownSync(BooleanFromNumericString)("100"))
// Output: true
```

**Example** (Converting an array to a ReadonlySet)

In this example, we convert an array into a `ReadonlySet`. The `decode` function takes an array and creates a new `ReadonlySet`. The `encode` function converts the set back into an array. We also provide the schema of the array items so they are properly validated.

```ts twoslash
import { Schema } from "effect"

// This function builds a schema that converts between a readonly array
// and a readonly set of items
const ReadonlySetFromArray = <A, I, R>(
  itemSchema: Schema.Schema<A, I, R>
): Schema.Schema<ReadonlySet<A>, ReadonlyArray<I>, R> =>
  Schema.transform(
    // Source schema: array of items
    Schema.Array(itemSchema),
    // Target schema: readonly set of items
    // **IMPORTANT** We use `Schema.typeSchema` here to obtain the schema
    // of the items to avoid decoding the elements twice
    Schema.ReadonlySetFromSelf(Schema.typeSchema(itemSchema)),
    {
      strict: true,
      decode: (items) => new Set(items),
      encode: (set) => Array.from(set.values())
    }
  )

const schema = ReadonlySetFromArray(Schema.String)

//     ┌─── readonly string[]
//     ▼
type Encoded = typeof schema.Encoded

//     ┌─── ReadonlySet<string>
//     ▼
type Type = typeof schema.Type

console.log(Schema.decodeUnknownSync(schema)(["a", "b", "c"]))
// Output: Set(3) { 'a', 'b', 'c' }

console.log(Schema.encodeSync(schema)(new Set(["a", "b", "c"])))
// Output: [ 'a', 'b', 'c' ]
```

<Aside type="note" title="Why Schema.typeSchema is used">
  Please note that to define the target schema, we used
  [Schema.typeSchema](/docs/schema/projections/#typeschema). This is
  because the decoding/encoding of the elements is already handled by the
  `from` schema: `Schema.Array(itemSchema)`, avoiding double decoding.
</Aside>

### Non-strict option

In some cases, strict type checking can create issues during data transformations, especially when the types might slightly differ in specific transformations. To address these scenarios, `Schema.transform` offers the option `strict: false`, which relaxes type constraints and allows more flexible transformations.

**Example** (Creating a Clamping Constructor)

Let's consider the scenario where you need to define a constructor `clamp` that ensures a number falls within a specific range. This function returns a schema that "clamps" a number to a specified minimum and maximum range:

```ts twoslash
import { Schema, Number } from "effect"

const clamp =
  (minimum: number, maximum: number) =>
  <A extends number, I, R>(self: Schema.Schema<A, I, R>) =>
    Schema.transform(
      // Source schema
      self,
      // Target schema: filter based on min/max range
      self.pipe(
        Schema.typeSchema,
        Schema.filter((a) => a <= minimum || a >= maximum)
      ),
// @errors: 2345
      {
        strict: true,
        // Clamp the number within the specified range
        decode: (a) => Number.clamp(a, { minimum, maximum }),
        encode: (a) => a
      }
    )
```

In this example, `Number.clamp` returns a `number` that might not be recognized as the specific `A` type, which leads to a type mismatch under strict checking.

There are two ways to resolve this issue:

1. **Using Type Assertion**:
   Adding a type cast can enforce the return type to be treated as type `A`:

   ```ts showLineNumbers=false
   decode: (a) => Number.clamp(a, { minimum, maximum }) as A
   ```

2. **Using the Non-Strict Option**:
   Setting `strict: false` in the transformation options allows the schema to bypass some of TypeScript's type-checking rules, accommodating the type discrepancy:

   ```ts twoslash
   import { Schema, Number } from "effect"

   const clamp =
     (minimum: number, maximum: number) =>
     <A extends number, I, R>(self: Schema.Schema<A, I, R>) =>
       Schema.transform(
         self,
         self.pipe(
           Schema.typeSchema,
           Schema.filter((a) => a >= minimum && a <= maximum)
         ),
         {
           strict: false,
           decode: (a) => Number.clamp(a, { minimum, maximum }),
           encode: (a) => a
         }
       )
   ```
