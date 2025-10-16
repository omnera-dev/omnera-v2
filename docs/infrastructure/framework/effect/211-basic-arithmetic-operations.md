## Basic Arithmetic Operations

The BigDecimal module supports a variety of arithmetic operations that provide precision and avoid the rounding errors common in standard JavaScript arithmetic. Below is a list of supported operations:

| Function          | Description                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `sum`             | Adds two `BigDecimal` values.                                                                                  |
| `subtract`        | Subtracts one `BigDecimal` value from another.                                                                 |
| `multiply`        | Multiplies two `BigDecimal` values.                                                                            |
| `divide`          | Divides one `BigDecimal` value by another, returning an `Option<BigDecimal>`.                                  |
| `unsafeDivide`    | Divides one `BigDecimal` value by another, throwing an error if the divisor is zero.                           |
| `negate`          | Negates a `BigDecimal` value (i.e., changes its sign).                                                         |
| `remainder`       | Returns the remainder of dividing one `BigDecimal` value by another, returning an `Option<BigDecimal>`.        |
| `unsafeRemainder` | Returns the remainder of dividing one `BigDecimal` value by another, throwing an error if the divisor is zero. |
| `sign`            | Returns the sign of a `BigDecimal` value (`-1`, `0`, or `1`).                                                  |
| `abs`             | Returns the absolute value of a `BigDecimal`.                                                                  |

**Example** (Performing Basic Arithmetic with BigDecimal)

```ts twoslash
import { BigDecimal } from "effect"

const dec1 = BigDecimal.unsafeFromString("1.05")
const dec2 = BigDecimal.unsafeFromString("2.10")

// Addition
console.log(String(BigDecimal.sum(dec1, dec2)))
// Output: BigDecimal(3.15)

// Multiplication
console.log(String(BigDecimal.multiply(dec1, dec2)))
// Output: BigDecimal(2.205)

// Subtraction
console.log(String(BigDecimal.subtract(dec2, dec1)))
// Output: BigDecimal(1.05)

// Division (safe, returns Option<BigDecimal>)
console.log(BigDecimal.divide(dec2, dec1))
/*
Output:
{
  _id: 'Option',
  _tag: 'Some',
  value: { _id: 'BigDecimal', value: '2', scale: 0 }
}
*/

// Division (unsafe, throws if divisor is zero)
console.log(String(BigDecimal.unsafeDivide(dec2, dec1)))
// Output: BigDecimal(2)

// Negation
console.log(String(BigDecimal.negate(dec1)))
// Output: BigDecimal(-1.05)

// Modulus (unsafe, throws if divisor is zero)
console.log(
  String(
    BigDecimal.unsafeRemainder(dec2, BigDecimal.unsafeFromString("0.6"))
  )
)
// Output: BigDecimal(0.3)
```

Using `BigDecimal` for arithmetic operations helps to avoid the inaccuracies commonly encountered with floating-point numbers in JavaScript. For example:

**Example** (Avoiding Floating-Point Errors)

```ts twoslash
const dec1 = 1.05
const dec2 = 2.1

console.log(String(dec1 + dec2))
// Output: 3.1500000000000004
```
