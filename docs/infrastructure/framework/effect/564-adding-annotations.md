## Adding Annotations

Defining a class with `Schema.Class` is similar to creating a [transformation](/docs/schema/transformations/) schema that converts a struct schema into a [declaration](/docs/schema/advanced-usage/#declaring-new-data-types) schema representing the class type.

For example, consider the following class definition:

```ts twoslash
import { Schema } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {}
```

Under the hood, this definition creates a transformation schema that maps:

```ts showLineNumbers=false
Schema.Struct({
  id: Schema.Number,
  name: Schema.NonEmptyString,
})
```

to a schema representing the `Person` class:

```ts showLineNumbers=false
Schema.declare((input) => input instanceof Person)
```

So, defining a schema with `Schema.Class` involves three schemas:

- The "from" schema (the struct)
- The "to" schema (the class)
- The "transformation" schema (struct -> class)

You can annotate each of these schemas by passing a tuple as the second argument to the `Schema.Class` API.

**Example** (Annotating Different Parts of the Class Schema)

```ts twoslash
import { Schema, SchemaAST } from 'effect'

class Person extends Schema.Class<Person>('Person')(
  {
    id: Schema.Number,
    name: Schema.NonEmptyString,
  },
  [
    // Annotations for the "to" schema
    { description: `"to" description` },

    // Annotations for the "transformation schema
    { description: `"transformation" description` },

    // Annotations for the "from" schema
    { description: `"from" description` },
  ]
) {}

console.log(SchemaAST.getDescriptionAnnotation(Person.ast.to))
// Output: { _id: 'Option', _tag: 'Some', value: '"to" description' }

console.log(SchemaAST.getDescriptionAnnotation(Person.ast))
// Output: { _id: 'Option', _tag: 'Some', value: '"transformation" description' }

console.log(SchemaAST.getDescriptionAnnotation(Person.ast.from))
// Output: { _id: 'Option', _tag: 'Some', value: '"from" description' }
```

If you do not want to annotate all three schemas, you can pass `undefined` for the ones you wish to skip.

**Example** (Skipping Annotations)

```ts twoslash
import { Schema, SchemaAST } from 'effect'

class Person extends Schema.Class<Person>('Person')(
  {
    id: Schema.Number,
    name: Schema.NonEmptyString,
  },
  [
    // No annotations for the "to" schema
    undefined,

    // Annotations for the "transformation schema
    { description: `"transformation" description` },
  ]
) {}

console.log(SchemaAST.getDescriptionAnnotation(Person.ast.to))
// Output: { _id: 'Option', _tag: 'None' }

console.log(SchemaAST.getDescriptionAnnotation(Person.ast))
// Output: { _id: 'Option', _tag: 'Some', value: '"transformation" description' }

console.log(SchemaAST.getDescriptionAnnotation(Person.ast.from))
// Output: { _id: 'Option', _tag: 'None' }
```

By default, the unique identifier used to define the class is also applied as the default `identifier` annotation for the Class Schema.

**Example** (Default Identifier Annotation)

```ts twoslash
import { Schema, SchemaAST } from 'effect'

// Used as default identifier annotation ────┐
//                                           |
//                                           ▼
class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {}

console.log(SchemaAST.getIdentifierAnnotation(Person.ast.to))
// Output: { _id: 'Option', _tag: 'Some', value: 'Person' }
```
