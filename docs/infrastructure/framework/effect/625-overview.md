## Overview

The `JSONSchema.make` function allows you to generate a JSON Schema from a schema.

**Example** (Creating a JSON Schema for a Struct)

The following example defines a `Person` schema with properties for `name` (a string) and `age` (a number). It then generates the corresponding JSON Schema.

```ts twoslash
import { JSONSchema, Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

const jsonSchema = JSONSchema.make(Person)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "name",
    "age"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
*/
```

The `JSONSchema.make` function aims to produce an optimal JSON Schema representing the input part of the decoding phase.
It does this by traversing the schema from the most nested component, incorporating each refinement, and **stops at the first transformation** encountered.

**Example** (Excluding Transformations in JSON Schema)

Consider modifying the `age` field to include both a refinement and a transformation. Only the refinement is reflected in the JSON Schema.

```ts twoslash
import { JSONSchema, Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number.pipe(
    // Refinement included in the JSON Schema
    Schema.int(),
    // Transformation excluded from the JSON Schema
    Schema.clamp(1, 10)
  ),
})

const jsonSchema = JSONSchema.make(Person)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "name",
    "age"
  ],
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "description": "an integer",
      "title": "integer"
    }
  },
  "additionalProperties": false
}
*/
```

In this case, the JSON Schema reflects the integer refinement but does not include the transformation that clamps the value.
