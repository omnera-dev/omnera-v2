## Customizing JSON Schema Generation

When working with JSON Schema certain data types, such as `bigint`, lack a direct representation because JSON Schema does not natively support them.
This absence typically leads to an error when the schema is generated.

**Example** (Error Due to Missing Annotation)

Attempting to generate a JSON Schema for unsupported types like `bigint` will lead to a missing annotation error:

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Struct({
  a_bigint_field: Schema.BigIntFromSelf
})

const jsonSchema = JSONSchema.make(schema)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
throws:
Error: Missing annotation
at path: ["a_bigint_field"]
details: Generating a JSON Schema for this schema requires a "jsonSchema" annotation
schema (BigIntKeyword): bigint
*/
```

To address this, you can enhance the schema with a custom `jsonSchema` annotation, defining how you intend to represent such types in JSON Schema:

**Example** (Using Custom Annotation for Unsupported Type)

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Struct({
  // Adding a custom JSON Schema annotation for the `bigint` type
  a_bigint_field: Schema.BigIntFromSelf.annotations({
    jsonSchema: {
      type: "some custom way to represent a bigint in JSON Schema"
    }
  })
})

const jsonSchema = JSONSchema.make(schema)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "a_bigint_field"
  ],
  "properties": {
    "a_bigint_field": {
      "type": "some custom way to represent a bigint in JSON Schema"
    }
  },
  "additionalProperties": false
}
*/
```

### Refinements

When defining a refinement (e.g., through the `Schema.filter` function), you can include a JSON Schema annotation to describe the refinement. This annotation is added as a "fragment" that becomes part of the generated JSON Schema. If a schema contains multiple refinements, their respective annotations are merged into the output.

**Example** (Using Refinements with Merged Annotations)

```ts twoslash
import { JSONSchema, Schema } from "effect"

// Define a schema with a refinement for positive numbers
const Positive = Schema.Number.pipe(
  Schema.filter((n) => n > 0, {
    jsonSchema: { minimum: 0 }
  })
)

// Add an upper bound refinement to the schema
const schema = Positive.pipe(
  Schema.filter((n) => n <= 10, {
    jsonSchema: { maximum: 10 }
  })
)

const jsonSchema = JSONSchema.make(schema)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "number",
  "minimum": 0,
  "maximum": 10
}
*/
```

The `jsonSchema` annotation is defined as a generic object, allowing it to represent non-standard extensions. This flexibility leaves the responsibility of enforcing type constraints to the user.

If you prefer stricter type enforcement or need to support non-standard extensions, you can introduce a `satisfies` constraint on the object literal. This constraint should be used in conjunction with the typing library of your choice.

**Example** (Ensuring Type Correctness)

In the following example, we've used the `@types/json-schema` package to provide TypeScript definitions for JSON Schema. This approach not only ensures type correctness but also enables autocomplete suggestions in your IDE.

```ts twoslash
import { JSONSchema, Schema } from "effect"
import type { JSONSchema7 } from "json-schema"

const Positive = Schema.Number.pipe(
  Schema.filter((n) => n > 0, {
    jsonSchema: { minimum: 0 } // Generic object, no type enforcement
  })
)

const schema = Positive.pipe(
  Schema.filter((n) => n <= 10, {
    jsonSchema: { maximum: 10 } satisfies JSONSchema7 // Enforces type constraints
  })
)

const jsonSchema = JSONSchema.make(schema)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "number",
  "minimum": 0,
  "maximum": 10
}
*/
```

For schema types other than refinements, you can override the default generated JSON Schema by providing a custom `jsonSchema` annotation. The content of this annotation will replace the system-generated schema.

**Example** (Custom Annotation for a Struct)

```ts twoslash
import { JSONSchema, Schema } from "effect"

// Define a struct with a custom JSON Schema annotation
const schema = Schema.Struct({ foo: Schema.String }).annotations({
  jsonSchema: { type: "object" }
})

const jsonSchema = JSONSchema.make(schema)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object"
}
the default would be:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "foo"
  ],
  "properties": {
    "foo": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
*/
```
