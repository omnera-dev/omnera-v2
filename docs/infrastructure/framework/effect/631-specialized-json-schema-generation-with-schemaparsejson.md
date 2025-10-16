## Specialized JSON Schema Generation with Schema.parseJson

The `Schema.parseJson` function provides a unique approach to JSON Schema generation. Instead of defaulting to a schema for a plain string, which represents the "from" side of the transformation, it generates a schema based on the structure provided within the argument.

This behavior ensures that the generated JSON Schema reflects the intended structure of the parsed data, rather than the raw JSON input.

**Example** (Generating JSON Schema for a Parsed Object)

```ts twoslash
import { JSONSchema, Schema } from "effect"

// Define a schema that parses a JSON string into a structured object
const schema = Schema.parseJson(
  Schema.Struct({
    // Nested parsing: JSON string to a number
    a: Schema.parseJson(Schema.NumberFromString)
  })
)

const jsonSchema = JSONSchema.make(schema)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "a"
  ],
  "properties": {
    "a": {
      "type": "string",
      "contentMediaType": "application/json"
    }
  },
  "additionalProperties": false
}
*/
```

# [Schema to Pretty Printer](https://effect.website/docs/schema/pretty/)
