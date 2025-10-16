## Using Built-in Equivalences

The module provides several built-in equivalence relations for common data types:

| Equivalence | Description                                 |
| ----------- | ------------------------------------------- |
| `string`    | Uses strict equality (`===`) for strings    |
| `number`    | Uses strict equality (`===`) for numbers    |
| `boolean`   | Uses strict equality (`===`) for booleans   |
| `symbol`    | Uses strict equality (`===`) for symbols    |
| `bigint`    | Uses strict equality (`===`) for bigints    |
| `Date`      | Compares `Date` objects by their timestamps |

**Example** (Using Built-in Equivalences)

```ts twoslash
import { Equivalence } from "effect"

console.log(Equivalence.string("apple", "apple"))
// Output: true

console.log(Equivalence.string("apple", "orange"))
// Output: false

console.log(Equivalence.Date(new Date(2023, 1, 1), new Date(2023, 1, 1)))
// Output: true

console.log(Equivalence.Date(new Date(2023, 1, 1), new Date(2023, 10, 1)))
// Output: false
```
