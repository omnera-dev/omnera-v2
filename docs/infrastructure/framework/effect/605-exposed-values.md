## Exposed Values

For schemas with filters, you can access the base schema (the schema before the filter was applied) using the `from` property:

```ts twoslash
import { Schema } from "effect"

const LongString = Schema.String.pipe(
  Schema.filter((s) => s.length >= 10)
)

// Access the base schema, which is the string schema
// before the filter was applied
//
//      ┌─── typeof Schema.String
//      ▼
const From = LongString.from
```
