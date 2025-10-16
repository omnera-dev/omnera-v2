## Specific Outputs for Schema Types

### Literals

Literals are transformed into `enum` types within JSON Schema.

**Example** (Single Literal)

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Literal("a")

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string",
  "enum": [
    "a"
  ]
}
*/
```

**Example** (Union of literals)

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Literal("a", "b")

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string",
  "enum": [
    "a",
    "b"
  ]
}
*/
```

### Void

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Void

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/schemas/void",
  "title": "void"
}
*/
```

### Any

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Any

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/schemas/any",
  "title": "any"
}
*/
```

### Unknown

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Unknown

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/schemas/unknown",
  "title": "unknown"
}
*/
```

### Object

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Object

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/schemas/object",
  "anyOf": [
    {
      "type": "object"
    },
    {
      "type": "array"
    }
  ],
  "description": "an object in the TypeScript meaning, i.e. the `object` type",
  "title": "object"
}
*/
```

### String

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.String

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string"
}
*/
```

### Number

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Number

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "number"
}
*/
```

### Boolean

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Boolean

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "boolean"
}
*/
```

### Tuples

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Tuple(Schema.String, Schema.Number)

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "minItems": 2,
  "items": [
    {
      "type": "string"
    },
    {
      "type": "number"
    }
  ],
  "additionalItems": false
}
*/
```

### Arrays

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Array(Schema.String)

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "string"
  }
}
*/
```

### Non Empty Arrays

Represents an array with at least one element.

**Example**

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.NonEmptyArray(Schema.String)

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "minItems": 1,
  "items": {
    "type": "string"
  }
}
*/
```

### Structs

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Struct({
  name: Schema.String,
  age: Schema.Number
})

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
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

### Records

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Record({
  key: Schema.String,
  value: Schema.Number
})

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [],
  "properties": {},
  "patternProperties": {
    "": {
      "type": "number"
    }
  }
}
*/
```

### Mixed Structs with Records

Combines fixed properties from a struct with dynamic properties from a record.

**Example**

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Struct(
  {
    name: Schema.String,
    age: Schema.Number
  },
  Schema.Record({
    key: Schema.String,
    value: Schema.Union(Schema.String, Schema.Number)
  })
)

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
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
  "patternProperties": {
    "": {
      "anyOf": [
        {
          "type": "string"
        },
        {
          "type": "number"
        }
      ]
    }
  }
}
*/
```

### Enums

```ts twoslash
import { JSONSchema, Schema } from "effect"

enum Fruits {
  Apple,
  Banana
}

const schema = Schema.Enums(Fruits)

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$comment": "/schemas/enums",
  "anyOf": [
    {
      "type": "number",
      "title": "Apple",
      "enum": [
        0
      ]
    },
    {
      "type": "number",
      "title": "Banana",
      "enum": [
        1
      ]
    }
  ]
}
*/
```

### Template Literals

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.TemplateLiteral(Schema.Literal("a"), Schema.Number)

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string",
  "title": "`a${number}`",
  "description": "a template literal",
  "pattern": "^a[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?$"
}
*/
```

### Unions

Unions are expressed using `anyOf` or `enum`, depending on the types involved:

**Example** (Generic Union)

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Union(Schema.String, Schema.Number)

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "anyOf": [
    {
      "type": "string"
    },
    {
      "type": "number"
    }
  ]
}
*/
```

**Example** (Union of literals)

```ts twoslash
import { JSONSchema, Schema } from "effect"

const schema = Schema.Literal("a", "b")

console.log(JSON.stringify(JSONSchema.make(schema), null, 2))
/*
Output:
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "string",
  "enum": [
    "a",
    "b"
  ]
}
*/
```
