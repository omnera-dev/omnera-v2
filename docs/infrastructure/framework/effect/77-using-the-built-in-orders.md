## Using the Built-in Orders

The Order module comes with several built-in comparators for common data types:

| Order    | Description                        |
| -------- | ---------------------------------- |
| `string` | Used for comparing strings.        |
| `number` | Used for comparing numbers.        |
| `bigint` | Used for comparing big integers.   |
| `Date`   | Used for comparing `Date` objects. |

**Example** (Using Built-in Comparators)

```ts twoslash
import { Order } from 'effect'

console.log(Order.string('apple', 'banana'))
// Output: -1, as "apple" < "banana"

console.log(Order.number(1, 1))
// Output: 0, as 1 = 1

console.log(Order.bigint(2n, 1n))
// Output: 1, as 2n > 1n
```
