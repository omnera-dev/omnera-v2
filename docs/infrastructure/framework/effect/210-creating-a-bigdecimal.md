## Creating a BigDecimal

### make

The `make` function creates a `BigDecimal` by specifying a `BigInt` value and a scale. The `scale` determines the number of digits to the right of the decimal point.

**Example** (Creating a BigDecimal with a Specified Scale)

```ts twoslash
import { BigDecimal } from "effect"

// Create a BigDecimal from a BigInt (1n) with a scale of 2
const decimal = BigDecimal.make(1n, 2)

console.log(decimal)
// Output: { _id: 'BigDecimal', value: '1', scale: 2 }

// Convert the BigDecimal to a string
console.log(String(decimal))
// Output: BigDecimal(0.01)

// Format the BigDecimal as a standard decimal string
console.log(BigDecimal.format(decimal))
// Output: 0.01

// Convert the BigDecimal to exponential notation
console.log(BigDecimal.toExponential(decimal))
// Output: 1e-2
```

### fromBigInt

The `fromBigInt` function creates a `BigDecimal` from a `bigint`. The `scale` defaults to `0`, meaning the number has no fractional part.

**Example** (Creating a BigDecimal from a BigInt)

```ts twoslash
import { BigDecimal } from "effect"

const decimal = BigDecimal.fromBigInt(10n)

console.log(decimal)
// Output: { _id: 'BigDecimal', value: '10', scale: 0 }
```

### fromString

Parses a numerical string into a `BigDecimal`. Returns an `Option<BigDecimal>`:

- `Some(BigDecimal)` if the string is valid.
- `None` if the string is invalid.

**Example** (Parsing a String into a BigDecimal)

```ts twoslash
import { BigDecimal } from "effect"

const decimal = BigDecimal.fromString("0.02")

console.log(decimal)
/*
Output:
{
  _id: 'Option',
  _tag: 'Some',
  value: { _id: 'BigDecimal', value: '2', scale: 2 }
}
*/
```

### unsafeFromString

The `unsafeFromString` function is a variant of `fromString` that throws an error if the input string is invalid. Use this only when you are confident that the input will always be valid.

**Example** (Unsafe Parsing of a String)

```ts twoslash
import { BigDecimal } from "effect"

const decimal = BigDecimal.unsafeFromString("0.02")

console.log(decimal)
// Output: { _id: 'BigDecimal', value: '2', scale: 2 }
```

### unsafeFromNumber

Creates a `BigDecimal` from a JavaScript `number`. Throws a `RangeError` for non-finite numbers (`NaN`, `+Infinity`, or `-Infinity`).

**Example** (Unsafe Parsing of a Number)

```ts twoslash
import { BigDecimal } from "effect"

console.log(BigDecimal.unsafeFromNumber(123.456))
// Output: { _id: 'BigDecimal', value: '123456', scale: 3 }
```

<Aside type="caution" title="Avoid Direct Conversion">
  Avoid converting floating-point numbers directly to `BigDecimal`, as
  their representation may already introduce precision issues.
</Aside>
