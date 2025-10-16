## Native enums

The Schema module provides support for native TypeScript enums. You can define a schema for an enum using `Schema.Enums`, allowing you to validate values that belong to the enum.

**Example** (Defining a Schema for an Enum)

```ts twoslash
import { Schema } from "effect"

enum Fruits {
  Apple,
  Banana
}

//      ┌─── Enums<typeof Fruits>
//      ▼
const schema = Schema.Enums(Fruits)

//
//     ┌─── Fruits
//     ▼
type Type = typeof schema.Type
```

### Exposed Values

Enums are accessible through the `enums` property of the schema. You can use this property to retrieve individual members or the entire set of enum values.

```ts twoslash
import { Schema } from "effect"

enum Fruits {
  Apple,
  Banana
}

const schema = Schema.Enums(Fruits)

schema.enums // Returns all enum members
schema.enums.Apple // Access the Apple member
schema.enums.Banana // Access the Banana member
```
