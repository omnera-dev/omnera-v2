## Validating Properties via Class Constructors

When you define a class using `Schema.Class`, the constructor automatically checks that the provided properties adhere to the schema's rules.

### Defining and Instantiating a Valid Class Instance

The constructor ensures that each property, like `id` and `name`, adheres to the schema. For instance, `id` must be a number, and `name` must be a non-empty string.

**Example** (Creating a Valid Instance)

```ts twoslash
import { Schema } from "effect"

class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.NonEmptyString
}) {}

// Create an instance with valid properties
const john = new Person({ id: 1, name: "John" })
```

### Handling Invalid Properties

If invalid properties are provided during instantiation, the constructor throws an error, explaining why the validation failed.

**Example** (Creating an Instance with Invalid Properties)

```ts twoslash
import { Schema } from "effect"

class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.NonEmptyString
}) {}

// Attempt to create an instance with an invalid `name`
new Person({ id: 1, name: "" })
/*
throws:
ParseError: Person (Constructor)
└─ ["name"]
   └─ NonEmptyString
      └─ Predicate refinement failure
         └─ Expected NonEmptyString, actual ""
*/
```

The error clearly specifies that the `name` field failed to meet the `NonEmptyString` requirement.

### Bypassing Validation

In some scenarios, you might want to bypass the validation logic. While not generally recommended, the library provides an option to do so.

**Example** (Bypassing Validation)

```ts twoslash
import { Schema } from "effect"

class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.NonEmptyString
}) {}

// Bypass validation during instantiation
const john = new Person({ id: 1, name: "" }, true)

// Or use the `disableValidation` option explicitly
new Person({ id: 1, name: "" }, { disableValidation: true })
```
