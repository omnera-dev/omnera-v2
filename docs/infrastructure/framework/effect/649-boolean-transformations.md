## Boolean Transformations

### Not

Negates a boolean value.

**Example** (Negating Boolean)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.Not)

console.log(decode(true)) // false
console.log(decode(false)) // true
```
