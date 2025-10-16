## Primitives

The Schema module provides built-in schemas for common primitive types.

| Schema                  | Equivalent TypeScript Type |
| ----------------------- | -------------------------- |
| `Schema.String`         | `string`                   |
| `Schema.Number`         | `number`                   |
| `Schema.Boolean`        | `boolean`                  |
| `Schema.BigIntFromSelf` | `BigInt`                   |
| `Schema.SymbolFromSelf` | `symbol`                   |
| `Schema.Object`         | `object`                   |
| `Schema.Undefined`      | `undefined`                |
| `Schema.Void`           | `void`                     |
| `Schema.Any`            | `any`                      |
| `Schema.Unknown`        | `unknown`                  |
| `Schema.Never`          | `never`                    |

**Example** (Using a Primitive Schema)

```ts twoslash
import { Schema } from 'effect'

const schema = Schema.String

// Infers the type as string
//
//     ┌─── string
//     ▼
type Type = typeof schema.Type

// Attempt to decode a null value, which will throw a parse error
Schema.decodeUnknownSync(schema)(null)
/*
throws:
ParseError: Expected string, actual null
*/
```
