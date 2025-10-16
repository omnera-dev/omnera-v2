## How BigDecimal Works

A `BigDecimal` represents a number using two components:

1. `value`: A `BigInt` that stores the digits of the number.
2. `scale`: A 64-bit integer that determines the position of the decimal point.

The number represented by a `BigDecimal` is calculated as: value x 10<sup>-scale</sup>.

- If `scale` is zero or positive, it specifies the number of digits to the right of the decimal point.
- If `scale` is negative, the `value` is multiplied by 10 raised to the power of the negated scale.

For example:

- A `BigDecimal` with `value = 12345n` and `scale = 2` represents `123.45`.
- A `BigDecimal` with `value = 12345n` and `scale = -2` represents `1234500`.

The maximum precision is large but not infinite, limited to 2<sup>63</sup> decimal places.
