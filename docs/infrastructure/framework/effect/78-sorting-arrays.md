## Sorting Arrays

You can sort arrays using these comparators. The `Array` module offers a `sort` function that sorts arrays without altering the original one.

**Example** (Sorting Arrays with `Order`)

```ts twoslash
import { Order, Array } from "effect"

const strings = ["b", "a", "d", "c"]

const result = Array.sort(strings, Order.string)

console.log(strings) // Original array remains unchanged
// Output: [ 'b', 'a', 'd', 'c' ]

console.log(result) // Sorted array
// Output: [ 'a', 'b', 'c', 'd' ]
```

You can also use an `Order` as a comparator with JavaScript's native `Array.sort` method, but keep in mind that this will modify the original array.

**Example** (Using `Order` with Native `Array.prototype.sort`)

```ts twoslash
import { Order } from "effect"

const strings = ["b", "a", "d", "c"]

strings.sort(Order.string) // Modifies the original array

console.log(strings)
// Output: [ 'a', 'b', 'c', 'd' ]
```
