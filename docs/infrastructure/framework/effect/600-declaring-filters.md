## Declaring Filters

Filters are declared using the `Schema.filter` function. This function requires two arguments: the schema to be validated and a predicate function. The predicate function is user-defined and determines whether the data satisfies the condition. If the data fails the validation, an error message can be provided.

**Example** (Defining a Minimum String Length Filter)

```ts twoslash
import { Schema } from 'effect'

// Define a string schema with a filter to ensure the string
// is at least 10 characters long
const LongString = Schema.String.pipe(
  Schema.filter(
    // Custom error message for strings shorter than 10 characters
    (s) => s.length >= 10 || 'a string at least 10 characters long'
  )
)

//     ┌─── string
//     ▼
type Type = typeof LongString.Type

console.log(Schema.decodeUnknownSync(LongString)('a'))
/*
throws:
ParseError: { string | filter }
└─ Predicate refinement failure
   └─ a string at least 10 characters long
*/
```

Note that the filter does not alter the schema's `Type`:

```ts showLineNumbers=false
//     ┌─── string
//     ▼
type Type = typeof LongString.Type
```

Filters add additional validation constraints without modifying the schema's underlying type.

<Aside type="tip">
  If you need to modify the `Type`, consider using [Branded
  types](/docs/schema/advanced-usage/#branded-types).
</Aside>
