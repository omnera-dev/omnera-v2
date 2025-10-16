## Branded Types

Branded schemas add metadata to a value to give it a more specific type, while still retaining its original type.

**Example** (Creating Branded Values)

```ts twoslash
import { Schema } from "effect"

const BrandedNumberSchema = Schema.Number.pipe(
  Schema.between(1, 10),
  Schema.brand("MyNumber")
)

// Successful creation
const n = BrandedNumberSchema.make(5)

// This will throw an error because the number is outside the valid range
BrandedNumberSchema.make(20)
/*
throws
ParseError: a number between 1 and 10 & Brand<"MyNumber">
└─ Predicate refinement failure
   └─ Expected a number between 1 and 10 & Brand<"MyNumber">, actual 20
*/

// Bypasses validation
BrandedNumberSchema.make(20, { disableValidation: true })
```

When using default constructors, it is helpful to understand the type of value they produce.

For instance, in the `BrandedNumberSchema` example, the return type of the constructor is `number & Brand<"MyNumber">`. This indicates that the resulting value is a `number` with additional branding information, `"MyNumber"`.

This behavior contrasts with the filter example, where the return type is simply `number`. Branding adds an extra layer of type information, which can assist in identifying and working with your data more effectively.
