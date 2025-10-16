## Leveraging Classes as Schema Definitions

When you define a class with `Schema.Class`, it serves both as a schema and as a class. This dual functionality allows the class to be used wherever a schema is required.

**Example** (Using a Class in an Array Schema)

```ts twoslash
import { Schema } from "effect"

class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.NonEmptyString
}) {}

// Use the Person class in an array schema
const Persons = Schema.Array(Person)

//     ┌─── readonly Person[]
//     ▼
type Type = typeof Persons.Type
```

### Exposed Values

The class also includes a `fields` static property, which outlines the fields defined during the class creation.

**Example** (Accessing the `fields` Property)

```ts twoslash
import { Schema } from "effect"

class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.NonEmptyString
}) {}

//       ┌─── {
//       |      readonly id: typeof Schema.Number;
//       |      readonly name: typeof Schema.NonEmptyString;
//       |    }
//       ▼
Person.fields
```
