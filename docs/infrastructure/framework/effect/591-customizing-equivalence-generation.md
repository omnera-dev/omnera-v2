## Customizing Equivalence Generation

You can customize the equivalence logic by providing an `equivalence` annotation in the schema definition.

The `equivalence` annotation takes any type parameters provided (`typeParameters`) and two values for comparison, returning a boolean based on the desired condition of equivalence.

**Example** (Custom Equivalence for Strings)

```ts twoslash
import { Schema } from 'effect'

// Define a schema with a custom equivalence annotation
const schema = Schema.String.annotations({
  equivalence: (/**typeParameters**/) => (s1, s2) =>
    // Custom rule: Compare only the first character of the strings
    s1.charAt(0) === s2.charAt(0),
})

// Generate the equivalence function
const customEquivalence = Schema.equivalence(schema)

// Use the custom equivalence function
console.log(customEquivalence('aaa', 'abb'))
// Output: true (both start with 'a')

console.log(customEquivalence('aaa', 'bba'))
// Output: false (strings start with different characters)
```

# [Error Formatters](https://effect.website/docs/schema/error-formatters/)
