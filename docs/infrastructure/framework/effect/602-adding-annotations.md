## Adding Annotations

Embedding metadata within the schema, such as identifiers, JSON schema specifications, and descriptions, enhances understanding and analysis of the schema's constraints and purpose.

**Example** (Adding Metadata with Annotations)

```ts twoslash
import { Schema, JSONSchema } from 'effect'

const LongString = Schema.String.pipe(
  Schema.filter((s) => (s.length >= 10 ? undefined : 'a string at least 10 characters long'), {
    identifier: 'LongString',
    jsonSchema: { minLength: 10 },
    description: 'Lorem ipsum dolor sit amet, ...',
  })
)

console.log(Schema.decodeUnknownSync(LongString)('a'))
/*
throws:
ParseError: LongString
└─ Predicate refinement failure
   └─ a string at least 10 characters long
*/

console.log(JSON.stringify(JSONSchema.make(LongString), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$defs": {
    "LongString": {
      "type": "string",
      "description": "Lorem ipsum dolor sit amet, ...",
      "minLength": 10
    }
  },
  "$ref": "#/$defs/LongString"
}
*/
```
