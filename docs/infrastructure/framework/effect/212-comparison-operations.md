## Comparison Operations

The `BigDecimal` module provides several functions for comparing decimal values. These allow you to determine the relative order of two values, find the minimum or maximum, and check specific properties like positivity or integer status.

### Comparison Functions

| Function               | Description                                                              |
| ---------------------- | ------------------------------------------------------------------------ |
| `lessThan`             | Checks if the first `BigDecimal` is smaller than the second.             |
| `lessThanOrEqualTo`    | Checks if the first `BigDecimal` is smaller than or equal to the second. |
| `greaterThan`          | Checks if the first `BigDecimal` is larger than the second.              |
| `greaterThanOrEqualTo` | Checks if the first `BigDecimal` is larger than or equal to the second.  |
| `min`                  | Returns the smaller of two `BigDecimal` values.                          |
| `max`                  | Returns the larger of two `BigDecimal` values.                           |

**Example** (Comparing Two BigDecimal Values)

```ts twoslash
import { BigDecimal } from "effect"

const dec1 = BigDecimal.unsafeFromString("1.05")
const dec2 = BigDecimal.unsafeFromString("2.10")

console.log(BigDecimal.lessThan(dec1, dec2))
// Output: true

console.log(BigDecimal.lessThanOrEqualTo(dec1, dec2))
// Output: true

console.log(BigDecimal.greaterThan(dec1, dec2))
// Output: false

console.log(BigDecimal.greaterThanOrEqualTo(dec1, dec2))
// Output: false

console.log(BigDecimal.min(dec1, dec2))
// Output: { _id: 'BigDecimal', value: '105', scale: 2 }

console.log(BigDecimal.max(dec1, dec2))
// Output: { _id: 'BigDecimal', value: '210', scale: 2 }
```

### Predicates for Comparison

The module also includes predicates to check specific properties of a `BigDecimal`:

| Predicate    | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `isZero`     | Checks if the value is exactly zero.                           |
| `isPositive` | Checks if the value is positive.                               |
| `isNegative` | Checks if the value is negative.                               |
| `between`    | Checks if the value lies within a specified range (inclusive). |
| `isInteger`  | Checks if the value is an integer (i.e., no fractional part).  |

**Example** (Checking the Sign and Properties of BigDecimal Values)

```ts twoslash
import { BigDecimal } from "effect"

const dec1 = BigDecimal.unsafeFromString("1.05")
const dec2 = BigDecimal.unsafeFromString("-2.10")

console.log(BigDecimal.isZero(BigDecimal.unsafeFromString("0")))
// Output: true

console.log(BigDecimal.isPositive(dec1))
// Output: true

console.log(BigDecimal.isNegative(dec2))
// Output: true

console.log(
  BigDecimal.between({
    minimum: BigDecimal.unsafeFromString("1"),
    maximum: BigDecimal.unsafeFromString("2")
  })(dec1)
)
// Output: true

console.log(
  BigDecimal.isInteger(dec2),
  BigDecimal.isInteger(BigDecimal.fromBigInt(3n))
)
// Output: false true
```
