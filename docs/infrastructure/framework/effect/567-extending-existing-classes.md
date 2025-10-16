## Extending existing Classes

The `extend` static utility allows you to enhance an existing schema class by adding **additional** fields and functionality. This approach helps in building on top of existing schemas without redefining them from scratch.

**Example** (Extending a Schema Class)

```ts twoslash
import { Schema } from "effect"

// Define the base class
class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.NonEmptyString
}) {
  // A custom getter that converts the name to uppercase
  get upperName() {
    return this.name.toUpperCase()
  }
}

// Extend the base class to include an "age" field
class PersonWithAge extends Person.extend<PersonWithAge>("PersonWithAge")(
  {
    age: Schema.Number
  }
) {
  // A custom getter to check if the person is an adult
  get isAdult() {
    return this.age >= 18
  }
}

// Usage
const john = new PersonWithAge({ id: 1, name: "John", age: 25 })
console.log(john.upperName) // Output: "JOHN"
console.log(john.isAdult) // Output: true
```

Note that you can only add additional fields when extending a class.

**Example** (Attempting to Overwrite Existing Fields)

```ts twoslash
import { Schema } from "effect"

class Person extends Schema.Class<Person>("Person")({
  id: Schema.Number,
  name: Schema.NonEmptyString
}) {
  get upperName() {
    return this.name.toUpperCase()
  }
}

class BadExtension extends Person.extend<BadExtension>("BadExtension")({
  name: Schema.Number
}) {}
/*
throws:
Error: Duplicate property signature
details: Duplicate key "name"
*/
```

This error occurs because allowing fields to be overwritten is not safe. It could interfere with any getters or methods defined on the class that rely on the original definition. For example, in this case, the `upperName` getter would break if the `name` field was changed to a number.
