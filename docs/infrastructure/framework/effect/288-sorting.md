## Sorting

You can sort a collection of `Option` values using the `Option.getOrder` function. This function helps specify a custom sorting rule for the type of value contained within the `Option`.

**Example** (Sorting Optional Numbers)

Suppose you have a list of optional numbers and want to sort them in ascending order, with empty values (`Option.none()`) treated as the lowest:

```ts twoslash
import { Option, Array, Order } from 'effect'

const items = [Option.some(1), Option.none(), Option.some(2)]

// Create an order for sorting Option values containing numbers
const myOrder = Option.getOrder(Order.number)

console.log(Array.sort(myOrder)(items))
/*
Output:
[
  { _id: 'Option', _tag: 'None' },           // None appears first because it's considered the lowest
  { _id: 'Option', _tag: 'Some', value: 1 }, // Sorted in ascending order
  { _id: 'Option', _tag: 'Some', value: 2 }
]
*/
```

**Example** (Sorting Optional Dates in Reverse Order)

Consider a more complex case where you have a list of objects containing optional dates, and you want to sort them in descending order, with `Option.none()` values at the end:

```ts
import { Option, Array, Order } from 'effect'

const items = [
  { data: Option.some(new Date(10)) },
  { data: Option.some(new Date(20)) },
  { data: Option.none() },
]

// Define the order to sort dates within Option values in reverse
const sorted = Array.sortWith(
  items,
  (item) => item.data,
  Order.reverse(Option.getOrder(Order.Date))
)

console.log(sorted)
/*
Output:
[
  { data: { _id: 'Option', _tag: 'Some', value: '1970-01-01T00:00:00.020Z' } },
  { data: { _id: 'Option', _tag: 'Some', value: '1970-01-01T00:00:00.010Z' } },
  { data: { _id: 'Option', _tag: 'None' } } // None placed last
]
*/
```

# [Redacted](https://effect.website/docs/data-types/redacted/)
