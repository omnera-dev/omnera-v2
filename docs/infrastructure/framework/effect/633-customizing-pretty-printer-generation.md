## Customizing Pretty Printer Generation

You can customize how the pretty printer formats output by using the `pretty` annotation within your schema definition.

The `pretty` annotation takes any type parameters provided (`typeParameters`) and formats the value into a string.

**Example** (Custom Pretty Printer for Numbers)

```ts twoslash
import { Pretty, Schema } from "effect"

// Define a schema with a custom pretty annotation
const schema = Schema.Number.annotations({
  pretty: (/**typeParameters**/) => (value) => `my format: ${value}`
})

// Create the pretty printer
const customPrettyPrinter = Pretty.make(schema)

// Format and print a value
console.log(customPrettyPrinter(1))
// Output: "my format: 1"
```

# [Schema Projections](https://effect.website/docs/schema/projections/)
