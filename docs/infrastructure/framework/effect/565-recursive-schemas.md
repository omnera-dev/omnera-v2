## Recursive Schemas

The `Schema.suspend` combinator is useful when you need to define a schema that depends on itself, like in the case of recursive data structures.
In this example, the `Category` schema depends on itself because it has a field `subcategories` that is an array of `Category` objects.

**Example** (Self-Referencing Schema)

```ts twoslash
import { Schema } from 'effect'

// Define a Category schema with a recursive subcategories field
class Category extends Schema.Class<Category>('Category')({
  name: Schema.String,
  subcategories: Schema.Array(Schema.suspend((): Schema.Schema<Category> => Category)),
}) {}
```

<Aside type="note" title="Correct Inference">
  It is necessary to add an explicit type annotation because otherwise
  TypeScript would struggle to infer types correctly. Without this
  annotation, you might encounter this error message:
</Aside>

**Example** (Missing Type Annotation Error)

```ts twoslash
import { Schema } from 'effect'

// @errors: 2506 7024
class Category extends Schema.Class<Category>('Category')({
  name: Schema.String,
  subcategories: Schema.Array(Schema.suspend(() => Category)),
}) {}
```

### Mutually Recursive Schemas

Sometimes, schemas depend on each other in a mutually recursive way. For instance, an arithmetic expression tree might include `Expression` nodes that can either be numbers or `Operation` nodes, which in turn reference `Expression` nodes.

**Example** (Arithmetic Expression Tree)

```ts twoslash
import { Schema } from 'effect'

class Expression extends Schema.Class<Expression>('Expression')({
  type: Schema.Literal('expression'),
  value: Schema.Union(
    Schema.Number,
    Schema.suspend((): Schema.Schema<Operation> => Operation)
  ),
}) {}

class Operation extends Schema.Class<Operation>('Operation')({
  type: Schema.Literal('operation'),
  operator: Schema.Literal('+', '-'),
  left: Expression,
  right: Expression,
}) {}
```

### Recursive Types with Different Encoded and Type

Defining recursive schemas where the `Encoded` type differs from the `Type` type introduces additional complexity. For instance, if a schema includes fields that transform data (e.g., `NumberFromString`), the `Encoded` and `Type` types may not align.

In such cases, we need to define an interface for the `Encoded` type.

Let's consider an example: suppose we want to add an `id` field to the `Category` schema, where the schema for `id` is `NumberFromString`.
It's important to note that `NumberFromString` is a schema that transforms a string into a number, so the `Type` and `Encoded` types of `NumberFromString` differ, being `number` and `string` respectively.
When we add this field to the `Category` schema, TypeScript raises an error:

```ts twoslash
import { Schema } from 'effect'

class Category extends Schema.Class<Category>('Category')({
  id: Schema.NumberFromString,
  name: Schema.String,
  subcategories: Schema.Array(
    // @errors: 2322
    Schema.suspend((): Schema.Schema<Category> => Category)
  ),
}) {}
```

This error occurs because the explicit annotation `S.suspend((): S.Schema<Category> => Category` is no longer sufficient and needs to be adjusted by explicitly adding the `Encoded` type:

**Example** (Adjusting the Schema with Explicit `Encoded` Type)

```ts twoslash
import { Schema } from 'effect'

interface CategoryEncoded {
  readonly id: string
  readonly name: string
  readonly subcategories: ReadonlyArray<CategoryEncoded>
}

class Category extends Schema.Class<Category>('Category')({
  id: Schema.NumberFromString,
  name: Schema.String,
  subcategories: Schema.Array(
    Schema.suspend((): Schema.Schema<Category, CategoryEncoded> => Category)
  ),
}) {}
```

As we've observed, it's necessary to define an interface for the `Encoded` of the schema to enable recursive schema definition, which can complicate things and be quite tedious.
One pattern to mitigate this is to **separate the field responsible for recursion** from all other fields.

**Example** (Separating Recursive Field)

```ts twoslash
import { Schema } from 'effect'

const fields = {
  id: Schema.NumberFromString,
  name: Schema.String,
  // ...possibly other fields
}

interface CategoryEncoded extends Schema.Struct.Encoded<typeof fields> {
  // Define `subcategories` using recursion
  readonly subcategories: ReadonlyArray<CategoryEncoded>
}

class Category extends Schema.Class<Category>('Category')({
  ...fields, // Include the fields
  subcategories: Schema.Array(
    // Define `subcategories` using recursion
    Schema.suspend((): Schema.Schema<Category, CategoryEncoded> => Category)
  ),
}) {}
```
