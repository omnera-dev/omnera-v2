## Structs

Struct schemas allow you to define objects with specific fields and constraints. The `make` function can be used to create instances of a struct schema.

**Example** (Creating Struct Instances)

```ts twoslash
import { Schema } from "effect"

const Struct = Schema.Struct({
  name: Schema.NonEmptyString
})

// Successful creation
Struct.make({ name: "a" })

// This will throw an error because the name is empty
Struct.make({ name: "" })
/*
throws
ParseError: { readonly name: NonEmptyString }
└─ ["name"]
   └─ NonEmptyString
      └─ Predicate refinement failure
         └─ Expected NonEmptyString, actual ""
*/
```

In some cases, you might need to bypass validation. While not recommended in most scenarios, `make` provides an option to disable validation.

**Example** (Bypassing Validation)

```ts twoslash
import { Schema } from "effect"

const Struct = Schema.Struct({
  name: Schema.NonEmptyString
})

// Bypass validation during instantiation
Struct.make({ name: "" }, true)

// Or use the `disableValidation` option explicitly
Struct.make({ name: "" }, { disableValidation: true })
```
