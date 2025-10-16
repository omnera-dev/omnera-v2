## Unique Symbols

You can create a schema for unique symbols using `Schema.UniqueSymbolFromSelf`.

**Example** (Creating a Schema for a Unique Symbol)

```ts twoslash
import { Schema } from "effect"

const mySymbol = Symbol.for("mySymbol")

const schema = Schema.UniqueSymbolFromSelf(mySymbol)

//     ┌─── typeof mySymbol
//     ▼
type Type = typeof schema.Type

Schema.decodeUnknownSync(schema)(null)
/*
throws:
ParseError: Expected Symbol(mySymbol), actual null
*/
```
