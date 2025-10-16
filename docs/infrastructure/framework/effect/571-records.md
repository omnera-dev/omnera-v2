## Records

Record schemas allow you to define key-value mappings where the keys and values must meet specific criteria.

**Example** (Creating Record Instances)

```ts twoslash
import { Schema } from 'effect'

const Record = Schema.Record({
  key: Schema.String,
  value: Schema.NonEmptyString,
})

// Successful creation
Record.make({ a: 'a', b: 'b' })

// This will throw an error because 'b' is empty
Record.make({ a: 'a', b: '' })
/*
throws
ParseError: { readonly [x: string]: NonEmptyString }
└─ ["b"]
   └─ NonEmptyString
      └─ Predicate refinement failure
         └─ Expected NonEmptyString, actual ""
*/

// Bypasses validation
Record.make({ a: 'a', b: '' }, { disableValidation: true })
```
