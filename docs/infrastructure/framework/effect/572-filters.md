## Filters

Filters allow you to define constraints on individual values.

**Example** (Using Filters to Enforce Ranges)

```ts twoslash
import { Schema } from 'effect'

const MyNumber = Schema.Number.pipe(Schema.between(1, 10))

// Successful creation
const n = MyNumber.make(5)

// This will throw an error because the number is outside the valid range
MyNumber.make(20)
/*
throws
ParseError: a number between 1 and 10
└─ Predicate refinement failure
   └─ Expected a number between 1 and 10, actual 20
*/

// Bypasses validation
MyNumber.make(20, { disableValidation: true })
```
