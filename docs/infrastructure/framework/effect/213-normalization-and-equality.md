## Normalization and Equality

In some cases, two `BigDecimal` values can have different internal representations but still represent the same number.

For example, `1.05` could be internally represented with different scales, such as:

- `105n` with a scale of `2`
- `1050n` with a scale of `3`

To ensure consistency, you can normalize a `BigDecimal` to adjust the scale and remove trailing zeros.

### Normalization

The `BigDecimal.normalize` function adjusts the scale of a `BigDecimal` and eliminates any unnecessary trailing zeros in its internal representation.

**Example** (Normalizing a BigDecimal)

```ts twoslash
import { BigDecimal } from "effect"

const dec = BigDecimal.make(1050n, 3)

console.log(BigDecimal.normalize(dec))
// Output: { _id: 'BigDecimal', value: '105', scale: 2 }
```

### Equality

To check if two `BigDecimal` values are numerically equal, regardless of their internal representation, use the `BigDecimal.equals` function.

**Example** (Checking Equality)

```ts twoslash
import { BigDecimal } from "effect"

const dec1 = BigDecimal.make(105n, 2)
const dec2 = BigDecimal.make(1050n, 3)

console.log(BigDecimal.equals(dec1, dec2))
// Output: true
```

# [Cause](https://effect.website/docs/data-types/cause/)
