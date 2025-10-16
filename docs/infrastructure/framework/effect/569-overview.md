## Overview

import { Aside } from "@astrojs/starlight/components"

When working with data structures, it can be helpful to create values that conform to a schema with minimal effort.
For this purpose, the Schema module provides default constructors for various schema types, including `Structs`, `Records`, `filters`, and `brands`.

<Aside type="note" title="Constructor Scope">
  Default constructors associated with a schema of type `Schema<A, I, R>` operate specifically on the **decoded type** (`A`), not the encoded type (`I`).

- **`A` (Decoded Type)**: This is the type produced after decoding and validation. The constructor creates values of this type.
- `I` (Encoded Type): This is the type expected when decoding raw input. The constructor does not accept this type directly.

This distinction is important when working with schemas that transform data. For example, if a schema **decodes a string into a number**, the default constructor will only accept **numbers**, not strings.

</Aside>

Default constructors are **unsafe**, meaning they **throw an error** if the input does not conform to the schema.
If you need a safer alternative, consider using [Schema.validateEither](#error-handling-in-constructors), which returns a result indicating success or failure instead of throwing an error.

**Example** (Using a Refinement Default Constructor)

```ts twoslash
import { Schema } from 'effect'

const schema = Schema.NumberFromString.pipe(Schema.between(1, 10))

// The constructor only accepts numbers
console.log(schema.make(5))
// Output: 5

// This will throw an error because the number is outside the valid range
console.log(schema.make(20))
/*
throws:
ParseError: between(1, 10)
└─ Predicate refinement failure
   └─ Expected a number between 1 and 10, actual 20
*/
```
