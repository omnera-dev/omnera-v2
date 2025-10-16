## Built-in Filters

### String Filters

Here is a list of useful string filters provided by the Schema module:

```ts twoslash
import { Schema } from 'effect'

// Specifies maximum length of a string
Schema.String.pipe(Schema.maxLength(5))

// Specifies minimum length of a string
Schema.String.pipe(Schema.minLength(5))

// Equivalent to minLength(1)
Schema.String.pipe(Schema.nonEmptyString())
// or
Schema.NonEmptyString

// Specifies exact length of a string
Schema.String.pipe(Schema.length(5))

// Specifies a range for the length of a string
Schema.String.pipe(Schema.length({ min: 2, max: 4 }))

// Matches a string against a regular expression pattern
Schema.String.pipe(Schema.pattern(/^[a-z]+$/))

// Ensures a string starts with a specific substring
Schema.String.pipe(Schema.startsWith('prefix'))

// Ensures a string ends with a specific substring
Schema.String.pipe(Schema.endsWith('suffix'))

// Checks if a string includes a specific substring
Schema.String.pipe(Schema.includes('substring'))

// Validates that a string has no leading or trailing whitespaces
Schema.String.pipe(Schema.trimmed())

// Validates that a string is entirely in lowercase
Schema.String.pipe(Schema.lowercased())

// Validates that a string is entirely in uppercase
Schema.String.pipe(Schema.uppercased())

// Validates that a string is capitalized
Schema.String.pipe(Schema.capitalized())

// Validates that a string is uncapitalized
Schema.String.pipe(Schema.uncapitalized())
```

<Aside type="tip" title="Trim vs Trimmed">
  The `trimmed` combinator does not make any transformations, it only
  validates. If what you were looking for was a combinator to trim
  strings, then check out the `trim` combinator or the `Trim` schema.
</Aside>

### Number Filters

Here is a list of useful number filters provided by the Schema module:

```ts twoslash
import { Schema } from 'effect'

// Specifies a number greater than 5
Schema.Number.pipe(Schema.greaterThan(5))

// Specifies a number greater than or equal to 5
Schema.Number.pipe(Schema.greaterThanOrEqualTo(5))

// Specifies a number less than 5
Schema.Number.pipe(Schema.lessThan(5))

// Specifies a number less than or equal to 5
Schema.Number.pipe(Schema.lessThanOrEqualTo(5))

// Specifies a number between -2 and 2, inclusive
Schema.Number.pipe(Schema.between(-2, 2))

// Specifies that the value must be an integer
Schema.Number.pipe(Schema.int())
// or
Schema.Int

// Ensures the value is not NaN
Schema.Number.pipe(Schema.nonNaN())
// or
Schema.NonNaN

// Ensures that the provided value is a finite number
// (excluding NaN, +Infinity, and -Infinity)
Schema.Number.pipe(Schema.finite())
// or
Schema.Finite

// Specifies a positive number (> 0)
Schema.Number.pipe(Schema.positive())
// or
Schema.Positive

// Specifies a non-negative number (>= 0)
Schema.Number.pipe(Schema.nonNegative())
// or
Schema.NonNegative

// A non-negative integer
Schema.NonNegativeInt

// Specifies a negative number (< 0)
Schema.Number.pipe(Schema.negative())
// or
Schema.Negative

// Specifies a non-positive number (<= 0)
Schema.Number.pipe(Schema.nonPositive())
// or
Schema.NonPositive

// Specifies a number that is evenly divisible by 5
Schema.Number.pipe(Schema.multipleOf(5))

// A 8-bit unsigned integer (0 to 255)
Schema.Uint8
```

### ReadonlyArray Filters

Here is a list of useful array filters provided by the Schema module:

```ts twoslash
import { Schema } from 'effect'

// Specifies the maximum number of items in the array
Schema.Array(Schema.Number).pipe(Schema.maxItems(2))

// Specifies the minimum number of items in the array
Schema.Array(Schema.Number).pipe(Schema.minItems(2))

// Specifies the exact number of items in the array
Schema.Array(Schema.Number).pipe(Schema.itemsCount(2))
```

### Date Filters

```ts twoslash
import { Schema } from 'effect'

// Specifies a valid date (rejects values like `new Date("Invalid Date")`)
Schema.DateFromSelf.pipe(Schema.validDate())
// or
Schema.ValidDateFromSelf

// Specifies a date greater than the current date
Schema.Date.pipe(Schema.greaterThanDate(new Date()))

// Specifies a date greater than or equal to the current date
Schema.Date.pipe(Schema.greaterThanOrEqualToDate(new Date()))

// Specifies a date less than the current date
Schema.Date.pipe(Schema.lessThanDate(new Date()))

// Specifies a date less than or equal to the current date
Schema.Date.pipe(Schema.lessThanOrEqualToDate(new Date()))

// Specifies a date between two dates
Schema.Date.pipe(Schema.betweenDate(new Date(0), new Date()))
```

### BigInt Filters

Here is a list of useful `BigInt` filters provided by the Schema module:

```ts twoslash
import { Schema } from 'effect'

// Specifies a BigInt greater than 5
Schema.BigInt.pipe(Schema.greaterThanBigInt(5n))

// Specifies a BigInt greater than or equal to 5
Schema.BigInt.pipe(Schema.greaterThanOrEqualToBigInt(5n))

// Specifies a BigInt less than 5
Schema.BigInt.pipe(Schema.lessThanBigInt(5n))

// Specifies a BigInt less than or equal to 5
Schema.BigInt.pipe(Schema.lessThanOrEqualToBigInt(5n))

// Specifies a BigInt between -2n and 2n, inclusive
Schema.BigInt.pipe(Schema.betweenBigInt(-2n, 2n))

// Specifies a positive BigInt (> 0n)
Schema.BigInt.pipe(Schema.positiveBigInt())
// or
Schema.PositiveBigIntFromSelf

// Specifies a non-negative BigInt (>= 0n)
Schema.BigInt.pipe(Schema.nonNegativeBigInt())
// or
Schema.NonNegativeBigIntFromSelf

// Specifies a negative BigInt (< 0n)
Schema.BigInt.pipe(Schema.negativeBigInt())
// or
Schema.NegativeBigIntFromSelf

// Specifies a non-positive BigInt (<= 0n)
Schema.BigInt.pipe(Schema.nonPositiveBigInt())
// or
Schema.NonPositiveBigIntFromSelf
```

### BigDecimal Filters

Here is a list of useful `BigDecimal` filters provided by the Schema module:

```ts twoslash
import { Schema, BigDecimal } from 'effect'

// Specifies a BigDecimal greater than 5
Schema.BigDecimal.pipe(Schema.greaterThanBigDecimal(BigDecimal.unsafeFromNumber(5)))

// Specifies a BigDecimal greater than or equal to 5
Schema.BigDecimal.pipe(Schema.greaterThanOrEqualToBigDecimal(BigDecimal.unsafeFromNumber(5)))
// Specifies a BigDecimal less than 5
Schema.BigDecimal.pipe(Schema.lessThanBigDecimal(BigDecimal.unsafeFromNumber(5)))

// Specifies a BigDecimal less than or equal to 5
Schema.BigDecimal.pipe(Schema.lessThanOrEqualToBigDecimal(BigDecimal.unsafeFromNumber(5)))

// Specifies a BigDecimal between -2 and 2, inclusive
Schema.BigDecimal.pipe(
  Schema.betweenBigDecimal(BigDecimal.unsafeFromNumber(-2), BigDecimal.unsafeFromNumber(2))
)

// Specifies a positive BigDecimal (> 0)
Schema.BigDecimal.pipe(Schema.positiveBigDecimal())

// Specifies a non-negative BigDecimal (>= 0)
Schema.BigDecimal.pipe(Schema.nonNegativeBigDecimal())

// Specifies a negative BigDecimal (< 0)
Schema.BigDecimal.pipe(Schema.negativeBigDecimal())

// Specifies a non-positive BigDecimal (<= 0)
Schema.BigDecimal.pipe(Schema.nonPositiveBigDecimal())
```

### Duration Filters

Here is a list of useful [Duration](/docs/data-types/duration/) filters provided by the Schema module:

```ts twoslash
import { Schema } from 'effect'

// Specifies a duration greater than 5 seconds
Schema.Duration.pipe(Schema.greaterThanDuration('5 seconds'))

// Specifies a duration greater than or equal to 5 seconds
Schema.Duration.pipe(Schema.greaterThanOrEqualToDuration('5 seconds'))

// Specifies a duration less than 5 seconds
Schema.Duration.pipe(Schema.lessThanDuration('5 seconds'))

// Specifies a duration less than or equal to 5 seconds
Schema.Duration.pipe(Schema.lessThanOrEqualToDuration('5 seconds'))

// Specifies a duration between 5 seconds and 10 seconds, inclusive
Schema.Duration.pipe(Schema.betweenDuration('5 seconds', '10 seconds'))
```

# [Getting Started](https://effect.website/docs/schema/getting-started/)
