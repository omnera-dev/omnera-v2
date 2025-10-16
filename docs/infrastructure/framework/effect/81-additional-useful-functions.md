## Additional Useful Functions

The Order module provides additional functions for common comparison operations, making it easier to work with ordered values.

### Reversing Order

`Order.reverse` inverts the order of comparison. If you have an `Order` for ascending values, reversing it makes it descending.

**Example** (Reversing an Order)

```ts twoslash
import { Order } from "effect"

const ascendingOrder = Order.number

const descendingOrder = Order.reverse(ascendingOrder)

console.log(ascendingOrder(1, 3))
// Output: -1 (1 < 3 in ascending order)
console.log(descendingOrder(1, 3))
// Output: 1 (1 > 3 in descending order)
```

### Comparing Values

These functions allow you to perform simple comparisons between values:

| API                    | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `lessThan`             | Checks if one value is strictly less than another.       |
| `greaterThan`          | Checks if one value is strictly greater than another.    |
| `lessThanOrEqualTo`    | Checks if one value is less than or equal to another.    |
| `greaterThanOrEqualTo` | Checks if one value is greater than or equal to another. |

**Example** (Using Comparison Functions)

```ts twoslash
import { Order } from "effect"

console.log(Order.lessThan(Order.number)(1, 2))
// Output: true (1 < 2)

console.log(Order.greaterThan(Order.number)(5, 3))
// Output: true (5 > 3)

console.log(Order.lessThanOrEqualTo(Order.number)(2, 2))
// Output: true (2 <= 2)

console.log(Order.greaterThanOrEqualTo(Order.number)(4, 4))
// Output: true (4 >= 4)
```

### Finding Minimum and Maximum

The `Order.min` and `Order.max` functions return the minimum or maximum value between two values, considering the order.

**Example** (Finding Minimum and Maximum Numbers)

```ts twoslash
import { Order } from "effect"

console.log(Order.min(Order.number)(3, 1))
// Output: 1 (1 is the minimum)

console.log(Order.max(Order.number)(5, 8))
// Output: 8 (8 is the maximum)
```

### Clamping Values

`Order.clamp` restricts a value within a given range. If the value is outside the range, it is adjusted to the nearest bound.

**Example** (Clamping Numbers to a Range)

```ts twoslash
import { Order } from "effect"

// Define a function to clamp numbers between 20 and 30
const clampNumbers = Order.clamp(Order.number)({
  minimum: 20,
  maximum: 30
})

// Value 26 is within the range [20, 30], so it remains unchanged
console.log(clampNumbers(26))
// Output: 26

// Value 10 is below the minimum bound, so it is clamped to 20
console.log(clampNumbers(10))
// Output: 20

// Value 40 is above the maximum bound, so it is clamped to 30
console.log(clampNumbers(40))
// Output: 30
```

### Checking Value Range

`Order.between` checks if a value falls within a specified inclusive range.

**Example** (Checking if Numbers Fall Within a Range)

```ts twoslash
import { Order } from "effect"

// Create a function to check if numbers are between 20 and 30
const betweenNumbers = Order.between(Order.number)({
  minimum: 20,
  maximum: 30
})

// Value 26 falls within the range [20, 30], so it returns true
console.log(betweenNumbers(26))
// Output: true

// Value 10 is below the minimum bound, so it returns false
console.log(betweenNumbers(10))
// Output: false

// Value 40 is above the maximum bound, so it returns false
console.log(betweenNumbers(40))
// Output: false
```

# [Cache](https://effect.website/docs/caching/cache/)
