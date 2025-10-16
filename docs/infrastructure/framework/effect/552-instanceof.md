## instanceOf

When you need to define a schema for your custom data type defined through a `class`, the most convenient and fast way is to use the `Schema.instanceOf` constructor.

**Example** (Defining a Schema with `instanceOf`)

```ts twoslash
import { Schema } from 'effect'

// Define a custom class
class MyData {
  constructor(readonly name: string) {}
}

// Create a schema for the class
const MyDataSchema = Schema.instanceOf(MyData)

//     ┌─── MyData
//     ▼
type Type = typeof MyDataSchema.Type

console.log(Schema.decodeUnknownSync(MyDataSchema)(new MyData('name')))
// Output: MyData { name: 'name' }

console.log(Schema.decodeUnknownSync(MyDataSchema)({ name: 'name' }))
/*
throws:
ParseError: Expected MyData, actual {"name":"name"}
*/
```

The `Schema.instanceOf` constructor is just a lightweight wrapper of the [Schema.declare](/docs/schema/advanced-usage/#declaring-new-data-types) API, which is the primitive in `effect/Schema` for declaring new custom data types.

### Private Constructors

Note that `Schema.instanceOf` can only be used for classes that expose a **public constructor**.
If you try to use it with classes that, for some reason, have marked the constructor as `private`, you'll receive a TypeScript error:

**Example** (Error With Private Constructors)

```ts twoslash
import { Schema } from 'effect'

class MyData {
  static make = (name: string) => new MyData(name)
  private constructor(readonly name: string) {}
}

// @errors: 2345
const MyDataSchema = Schema.instanceOf(MyData)
```

In such cases, you cannot use `Schema.instanceOf`, and you must rely on [Schema.declare](/docs/schema/advanced-usage/#declaring-new-data-types) like this:

**Example** (Using `Schema.declare` With Private Constructors)

```ts twoslash
import { Schema } from 'effect'

class MyData {
  static make = (name: string) => new MyData(name)
  private constructor(readonly name: string) {}
}

const MyDataSchema = Schema.declare(
  (input: unknown): input is MyData => input instanceof MyData
).annotations({ identifier: 'MyData' })

console.log(Schema.decodeUnknownSync(MyDataSchema)(MyData.make('name')))
// Output: MyData { name: 'name' }

console.log(Schema.decodeUnknownSync(MyDataSchema)({ name: 'name' }))
/*
throws:
ParseError: Expected MyData, actual {"name":"name"}
*/
```

### Validating Fields of the Instance

To validate the fields of a class instance, you can use a [filter](/docs/schema/filters/). This approach combines instance validation with additional checks on the instance's fields.

**Example** (Adding Field Validation to an Instance Schema)

```ts twoslash
import { Either, ParseResult, Schema } from 'effect'

class MyData {
  constructor(readonly name: string) {}
}

const MyDataFields = Schema.Struct({
  name: Schema.NonEmptyString,
})

// Define a schema for the class instance with additional field validation
const MyDataSchema = Schema.instanceOf(MyData).pipe(
  Schema.filter((a, options) =>
    // Validate the fields of the instance
    ParseResult.validateEither(MyDataFields)(a, options).pipe(
      // Invert success and failure for filtering
      Either.flip,
      // Return undefined if validation succeeds, or an error if it fails
      Either.getOrUndefined
    )
  )
)

// Example: Valid instance
console.log(Schema.validateSync(MyDataSchema)(new MyData('John')))
// Output: MyData { name: 'John' }

// Example: Invalid instance (empty name)
console.log(Schema.validateSync(MyDataSchema)(new MyData('')))
/*
throws:
ParseError: { MyData | filter }
└─ Predicate refinement failure
   └─ { readonly name: NonEmptyString }
      └─ ["name"]
         └─ NonEmptyString
            └─ Predicate refinement failure
               └─ Expected a non empty string, actual ""
*/
```
