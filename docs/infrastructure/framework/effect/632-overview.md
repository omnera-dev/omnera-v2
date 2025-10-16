## Overview

The `Pretty.make` function is used to create pretty printers that generate a formatted string representation of values based on a schema.

**Example** (Pretty Printer for a Struct Schema)

```ts twoslash
import { Pretty, Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

// Create a pretty printer for the schema
const PersonPretty = Pretty.make(Person)

// Format and print a Person object
console.log(PersonPretty({ name: 'Alice', age: 30 }))
/*
Output:
'{ "name": "Alice", "age": 30 }'
*/
```
