## Recursive and Mutually Recursive Schemas

Recursive and mutually recursive schemas are supported, however it's **mandatory** to use `identifier` annotations for these types of schemas to ensure correct references and definitions within the generated JSON Schema.

**Example** (Recursive Schema with Identifier Annotations)

In this example, the `Category` schema refers to itself, making it necessary to use an `identifier` annotation to facilitate the reference.

```ts twoslash
import { JSONSchema, Schema } from 'effect'

// Define the interface representing a category structure
interface Category {
  readonly name: string
  readonly categories: ReadonlyArray<Category>
}

// Define a recursive schema with a required identifier annotation
const Category = Schema.Struct({
  name: Schema.String,
  categories: Schema.Array(
    // Recursive reference to the Category schema
    Schema.suspend((): Schema.Schema<Category> => Category)
  ),
}).annotations({ identifier: 'Category' })

const jsonSchema = JSONSchema.make(Category)

console.log(JSON.stringify(jsonSchema, null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$defs": {
    "Category": {
      "type": "object",
      "required": [
        "name",
        "categories"
      ],
      "properties": {
        "name": {
          "type": "string"
        },
        "categories": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/Category"
          }
        }
      },
      "additionalProperties": false
    }
  },
  "$ref": "#/$defs/Category"
}
*/
```
