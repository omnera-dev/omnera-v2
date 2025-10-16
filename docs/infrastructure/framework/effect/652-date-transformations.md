## Date transformations

### Date

Converts a string into a **valid** `Date`, ensuring that invalid dates, such as `new Date("Invalid Date")`, are rejected.

**Example** (Parsing and Validating Date)

```ts twoslash
import { Schema } from "effect"

const decode = Schema.decodeUnknownSync(Schema.Date)

console.log(decode("1970-01-01T00:00:00.000Z"))
// Output: 1970-01-01T00:00:00.000Z

decode("a")
/*
throws:
ParseError: Date
└─ Predicate refinement failure
   └─ Expected Date, actual Invalid Date
*/

const validate = Schema.validateSync(Schema.Date)

console.log(validate(new Date(0)))
// Output: 1970-01-01T00:00:00.000Z

console.log(validate(new Date("Invalid Date")))
/*
throws:
ParseError: Date
└─ Predicate refinement failure
   └─ Expected Date, actual Invalid Date
*/
```
