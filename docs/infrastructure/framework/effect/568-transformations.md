## Transformations

You can enhance schema classes with effectful transformations to enrich or validate entities, particularly when working with data sourced from external systems like databases or APIs.

**Example** (Effectful Transformation)

The following example demonstrates adding an `age` field to a `Person` class. The `age` value is derived asynchronously based on the `id` field.

```ts twoslash
import { Effect, Option, Schema, ParseResult } from "effect"

// Base class definition
class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.String
}) {}

console.log(Schema.decodeUnknownSync(Person)({ id: 1, name: "name" }))
/*
Output:
Person { id: 1, name: 'name' }
*/

// Simulate fetching age asynchronously based on id
function getAge(id: number): Effect.Effect<number, Error> {
  return Effect.succeed(id + 2)
}

// Extended class with a transformation
class PersonWithTransform extends Person.transformOrFail<PersonWithTransform>(
  "PersonWithTransform"
)(
  {
    age: Schema.optionalWith(Schema.Number, { exact: true, as: "Option" })
  },
  {
    // Decoding logic for the new field
    decode: (input) =>
      Effect.mapBoth(getAge(input.id), {
        onFailure: (e) =>
          new ParseResult.Type(Schema.String.ast, input.id, e.message),
        // Must return { age: Option<number> }
        onSuccess: (age) => ({ ...input, age: Option.some(age) })
      }),
    encode: ParseResult.succeed
  }
) {}

Schema.decodeUnknownPromise(PersonWithTransform)({
  id: 1,
  name: "name"
}).then(console.log)
/*
Output:
PersonWithTransform {
  id: 1,
  name: 'name',
  age: { _id: 'Option', _tag: 'Some', value: 3 }
}
*/

// Extended class with a conditional Transformation
class PersonWithTransformFrom extends Person.transformOrFailFrom<PersonWithTransformFrom>(
  "PersonWithTransformFrom"
)(
  {
    age: Schema.optionalWith(Schema.Number, { exact: true, as: "Option" })
  },
  {
    decode: (input) =>
      Effect.mapBoth(getAge(input.id), {
        onFailure: (e) =>
          new ParseResult.Type(Schema.String.ast, input, e.message),
        // Must return { age?: number }
        onSuccess: (age) => (age > 18 ? { ...input, age } : { ...input })
      }),
    encode: ParseResult.succeed
  }
) {}

Schema.decodeUnknownPromise(PersonWithTransformFrom)({
  id: 1,
  name: "name"
}).then(console.log)
/*
Output:
PersonWithTransformFrom {
  id: 1,
  name: 'name',
  age: { _id: 'Option', _tag: 'None' }
}
*/
```

The decision of which API to use, either `transformOrFail` or `transformOrFailFrom`, depends on when you wish to execute the transformation:

1. Using `transformOrFail`:

   - The transformation occurs at the end of the process.
   - It expects you to provide a value of type `{ age: Option<number> }`.
   - After processing the initial input, the new transformation comes into play, and you need to ensure the final output adheres to the specified structure.

2. Using `transformOrFailFrom`:
   - The new transformation starts as soon as the initial input is handled.
   - You should provide a value `{ age?: number }`.
   - Based on this fresh input, the subsequent transformation `Schema.optionalWith(Schema.Number, { exact: true, as: "Option" })` is executed.
   - This approach allows for immediate handling of the input, potentially influencing the subsequent transformations.

# [Default Constructors](https://effect.website/docs/schema/default-constructors/)
