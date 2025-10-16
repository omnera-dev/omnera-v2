## Identifier Annotations

You can add `identifier` annotations to schemas to improve structure and maintainability. Annotated schemas are included in a `$defs` object in the root of the JSON Schema and referenced from there.

**Example** (Using Identifier Annotations)

```ts twoslash
import { JSONSchema, Schema } from 'effect'

const Name = Schema.String.annotations({ identifier: 'Name' })

const Age = Schema.Number.annotations({ identifier: 'Age' })

const Person = Schema.Struct({
  name: Name,
  age: Age,
})

const jsonSchema = JSONSchema.make(Person)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$defs": {
    "Name": {
      "type": "string",
      "description": "a string",
      "title": "string"
    },
    "Age": {
      "type": "number",
      "description": "a number",
      "title": "number"
    }
  },
  "type": "object",
  "required": [
    "name",
    "age"
  ],
  "properties": {
    "name": {
      "$ref": "#/$defs/Name"
    },
    "age": {
      "$ref": "#/$defs/Age"
    }
  },
  "additionalProperties": false
}
*/
```

By using identifier annotations, schemas can be reused and referenced more easily, especially in complex JSON Schemas.
