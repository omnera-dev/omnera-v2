## Symbol transformations

### Symbol

Converts a string to a symbol using `Symbol.for`.

**Example** (Creating Symbols from Strings)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.Symbol)

console.log(decode('a')) // Symbol(a)
```
