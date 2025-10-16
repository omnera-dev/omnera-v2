## Overview

The `Schema.equivalence` function allows you to generate an [Equivalence](/docs/schema/equivalence/) based on a schema definition.
This function is designed to compare data structures for equivalence according to the rules defined in the schema.

**Example** (Comparing Structs for Equivalence)

```ts twoslash
import { Schema } from 'effect'

const Person = Schema.Struct({
  name: Schema.String,
  age: Schema.Number,
})

// Generate an equivalence function based on the schema
const PersonEquivalence = Schema.equivalence(Person)

const john = { name: 'John', age: 23 }
const alice = { name: 'Alice', age: 30 }

// Use the equivalence function to compare objects

console.log(PersonEquivalence(john, { name: 'John', age: 23 }))
// Output: true

console.log(PersonEquivalence(john, alice))
// Output: false
```
