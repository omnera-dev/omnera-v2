## Custom Annotations

In addition to built-in annotations, you can define custom annotations to meet specific requirements. For instance, here's how to create a `deprecated` annotation:

**Example** (Defining a Custom Annotation)

```ts twoslash
import { Schema } from 'effect'

// Define a unique identifier for your custom annotation
const DeprecatedId = Symbol.for('some/unique/identifier/for/your/custom/annotation')

// Apply the custom annotation to the schema
const MyString = Schema.String.annotations({ [DeprecatedId]: true })

console.log(MyString)
/*
Output:
[class SchemaClass] {
  ast: StringKeyword {
    annotations: {
      [Symbol(@effect/docs/schema/annotation/Title)]: 'string',
      [Symbol(@effect/docs/schema/annotation/Description)]: 'a string',
      [Symbol(some/unique/identifier/for/your/custom/annotation)]: true
    },
    _tag: 'StringKeyword'
  },
  ...
}
*/
```

To make your new custom annotation type-safe, you can use a module augmentation. In the next example, we want our custom annotation to be a boolean.

**Example** (Adding Type Safety to Custom Annotations)

```ts twoslash
import { Schema } from 'effect'

const DeprecatedId = Symbol.for('some/unique/identifier/for/your/custom/annotation')

// Module augmentation
declare module 'effect/Schema' {
  namespace Annotations {
    interface GenericSchema<A> extends Schema<A> {
      [DeprecatedId]?: boolean
    }
  }
}

const MyString = Schema.String.annotations({
  // @errors: 2418
  [DeprecatedId]: 'bad value',
})
```

You can retrieve custom annotations using the `SchemaAST.getAnnotation` helper function.

**Example** (Retrieving a Custom Annotation)

```ts twoslash collapse={4-16}
import { SchemaAST, Schema } from 'effect'
import { Option } from 'effect'

const DeprecatedId = Symbol.for('some/unique/identifier/for/your/custom/annotation')

declare module 'effect/Schema' {
  namespace Annotations {
    interface GenericSchema<A> extends Schema<A> {
      [DeprecatedId]?: boolean
    }
  }
}

const MyString = Schema.String.annotations({ [DeprecatedId]: true })

// Helper function to check if a schema is marked as deprecated
const isDeprecated = <A, I, R>(schema: Schema.Schema<A, I, R>): boolean =>
  SchemaAST.getAnnotation<boolean>(DeprecatedId)(schema.ast).pipe(Option.getOrElse(() => false))

console.log(isDeprecated(Schema.String))
// Output: false

console.log(isDeprecated(MyString))
// Output: true
```

# [Advanced Usage](https://effect.website/docs/schema/advanced-usage/)
