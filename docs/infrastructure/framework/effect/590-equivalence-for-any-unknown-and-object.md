## Equivalence for Any, Unknown, and Object

When working with the following schemas:

- `Schema.Any`
- `Schema.Unknown`
- `Schema.Object`
- `Schema.Struct({})` (representing the broad `{}` TypeScript type)

the most sensible form of equivalence is to use `Equal.equals` from the [Equal](/docs/trait/equal/) module, which defaults to reference equality (`===`).
This is because these types can hold almost any kind of value.

**Example** (Comparing Empty Objects Using Reference Equality)

```ts twoslash
import { Schema } from 'effect'

const schema = Schema.Struct({})

const input1 = {}
const input2 = {}

console.log(Schema.equivalence(schema)(input1, input2))
// Output: false (because they are different references)
```
