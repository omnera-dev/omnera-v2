## Default Error Messages

By default, when a parsing error occurs, the system automatically generates an informative message based on the schema's structure and the nature of the error (see [TreeFormatter](/docs/schema/error-formatters/#treeformatter-default) for more informations).
For example, if a required property is missing or a data type does not match, the error message will clearly state the expectation versus the actual input.

**Example** (Type Mismatch)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

Schema.decodeUnknownSync(Person)(null)
// Output: ParseError: Expected { readonly name: string; readonly age: number }, actual null
```

**Example** (Missing Properties)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

Schema.decodeUnknownSync(Person)({}, { errors: 'all' })
/*
throws:
ParseError: { readonly name: string; readonly age: number }
├─ ["name"]
│  └─ is missing
└─ ["age"]
   └─ is missing
*/
```

**Example** (Incorrect Property Type)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

Schema.decodeUnknownSync(Person)({ name: null, age: 'age' }, { errors: 'all' })
/*
throws:
ParseError: { readonly name: string; readonly age: number }
├─ ["name"]
│  └─ Expected string, actual null
└─ ["age"]
   └─ Expected number, actual "age"
*/
```

### Enhancing Clarity in Error Messages with Identifiers

In scenarios where a schema has multiple fields or nested structures, the default error messages can become overly complex and verbose.
To address this, you can enhance the clarity and brevity of these messages by utilizing annotations such as `identifier`, `title`, and `description`.

**Example** (Using Identifiers for Clarity)

```ts twoslash
import { Schema } from 'effect'

const Name = Schema.String.annotations({ identifier: 'Name' })

const Age = Schema.Number.annotations({ identifier: 'Age' })

const Person = Schema.Struct({
  name: Name,
  age: Age,
}).annotations({ identifier: 'Person' })

Schema.decodeUnknownSync(Person)(null)
/*
throws:
ParseError: Expected Person, actual null
*/

Schema.decodeUnknownSync(Person)({}, { errors: 'all' })
/*
throws:
ParseError: Person
├─ ["name"]
│  └─ is missing
└─ ["age"]
   └─ is missing
*/

Schema.decodeUnknownSync(Person)({ name: null, age: null }, { errors: 'all' })
/*
throws:
ParseError: Person
├─ ["name"]
│  └─ Expected Name, actual null
└─ ["age"]
   └─ Expected Age, actual null
*/
```

### Refinements

When a refinement fails, the default error message indicates whether the failure occurred in the "from" part or within the predicate defining the refinement:

**Example** (Refinement Errors)

```ts twoslash
import { Schema } from 'effect'

const Name = Schema.NonEmptyString.annotations({ identifier: 'Name' })

const Age = Schema.Positive.pipe(Schema.int({ identifier: 'Age' }))

const Person = Schema.Struct({
  name: Name,
  age: Age,
}).annotations({ identifier: 'Person' })

// From side failure
Schema.decodeUnknownSync(Person)({ name: null, age: 18 })
/*
throws:
ParseError: Person
└─ ["name"]
   └─ Name
      └─ From side refinement failure
         └─ Expected string, actual null
*/

// Predicate refinement failure
Schema.decodeUnknownSync(Person)({ name: '', age: 18 })
/*
throws:
ParseError: Person
└─ ["name"]
   └─ Name
      └─ Predicate refinement failure
         └─ Expected a non empty string, actual ""
*/
```

In the first example, the error message indicates a "from side" refinement failure in the `name` property, specifying that a string was expected but received `null`.
In the second example, a "predicate" refinement failure is reported, indicating that a non-empty string was expected for `name` but an empty string was provided.

### Transformations

Transformations between different types or formats can occasionally result in errors.
The system provides a structured error message to specify where the error occurred:

- **Encoded Side Failure:** Errors on this side typically indicate that the input to the transformation does not match the expected initial type or format. For example, receiving a `null` when a `string` is expected.
- **Transformation Process Failure:** This type of error arises when the transformation logic itself fails, such as when the input does not meet the criteria specified within the transformation functions.
- **Type Side Failure:** Occurs when the output of a transformation does not meet the schema requirements on the decoded side. This can happen if the transformed value fails subsequent validations or conditions.

**Example** (Transformation Errors)

```ts twoslash
import { ParseResult, Schema } from 'effect'

const schema = Schema.transformOrFail(Schema.String, Schema.String.pipe(Schema.minLength(2)), {
  strict: true,
  decode: (s, _, ast) =>
    s.length > 0 ? ParseResult.succeed(s) : ParseResult.fail(new ParseResult.Type(ast, s)),
  encode: ParseResult.succeed,
})

// Encoded side failure
Schema.decodeUnknownSync(schema)(null)
/*
throws:
ParseError: (string <-> minLength(2))
└─ Encoded side transformation failure
   └─ Expected string, actual null
*/

// transformation failure
Schema.decodeUnknownSync(schema)('')
/*
throws:
ParseError: (string <-> minLength(2))
└─ Transformation process failure
   └─ Expected (string <-> minLength(2)), actual ""
*/

// Type side failure
Schema.decodeUnknownSync(schema)('a')
/*
throws:
ParseError: (string <-> minLength(2))
└─ Type side transformation failure
   └─ minLength(2)
      └─ Predicate refinement failure
         └─ Expected a string at least 2 character(s) long, actual "a"
*/
```
