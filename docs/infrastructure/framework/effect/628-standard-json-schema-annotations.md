## Standard JSON Schema Annotations

Standard JSON Schema annotations such as `title`, `description`, `default`, and `examples` are supported.
These annotations allow you to enrich your schemas with metadata that can enhance readability and provide additional information about the data structure.

**Example** (Using Annotations for Metadata)

```ts twoslash
import { JSONSchema, Schema } from 'effect'

const schema = Schema.String.annotations({
  description: 'my custom description',
  title: 'my custom title',
  default: '',
  examples: ['a', 'b'],
})

const jsonSchema = JSONSchema.make(schema)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string",
  "description": "my custom description",
  "title": "my custom title",
  "examples": [
    "a",
    "b"
  ],
  "default": ""
}
*/
```

### Adding annotations to Struct properties

To enhance the clarity of your JSON schemas, it's advisable to add annotations directly to the property signatures rather than to the type itself.
This method is more semantically appropriate as it links descriptive titles and other metadata specifically to the properties they describe, rather than to the generic type.

**Example** (Annotated Struct Properties)

```ts twoslash
import { JSONSchema, Schema } from 'effect'

const Person = Schema.Struct({
  firstName: Schema.propertySignature(Schema.String).annotations({
    title: 'First name',
  }),
  lastName: Schema.propertySignature(Schema.String).annotations({
    title: 'Last Name',
  }),
})

const jsonSchema = JSONSchema.make(Person)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "firstName",
    "lastName"
  ],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First name"
    },
    "lastName": {
      "type": "string",
      "title": "Last Name"
    }
  },
  "additionalProperties": false
}
*/
```
