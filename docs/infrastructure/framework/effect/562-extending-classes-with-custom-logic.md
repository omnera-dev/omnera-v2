## Extending Classes with Custom Logic

Schema classes provide the flexibility to include custom getters and methods, allowing you to extend their functionality beyond the defined fields.

### Adding Custom Getters

A getter can be used to derive computed values from the fields of the class. For example, a `Person` class can include a getter to return the `name` property in uppercase.

**Example** (Adding a Getter for Uppercase Name)

```ts twoslash
import { Schema } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {
  // Custom getter to return the name in uppercase
  get upperName() {
    return this.name.toUpperCase()
  }
}

const john = new Person({ id: 1, name: 'John' })

// Use the custom getter
console.log(john.upperName)
// Output: "JOHN"
```

### Adding Custom Methods

In addition to getters, you can define methods to encapsulate more complex logic or operations involving the class's fields.

**Example** (Adding a Method)

```ts twoslash
import { Schema } from 'effect'

class Person extends Schema.Class<Person>('Person')({
  id: Schema.Number,
  name: Schema.NonEmptyString,
}) {
  // Custom method to return a greeting
  greet() {
    return `Hello, my name is ${this.name}.`
  }
}

const john = new Person({ id: 1, name: 'John' })

// Use the custom method
console.log(john.greet())
// Output: "Hello, my name is John."
```
