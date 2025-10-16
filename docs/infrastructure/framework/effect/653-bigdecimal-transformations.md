## BigDecimal Transformations

### BigDecimal

Converts a string to a `BigDecimal`.

**Example** (Parsing BigDecimal from String)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.BigDecimal)

console.log(decode('.124'))
// Output: { _id: 'BigDecimal', value: '124', scale: 3 }
```

### BigDecimalFromNumber

Converts a number to a `BigDecimal`.

<Aside type="caution" title="Invalid Range">
  When encoding, this Schema will produce incorrect results if the
  BigDecimal exceeds the 64-bit range of a number.
</Aside>

**Example** (Parsing BigDecimal from Number)

```ts twoslash
import { Schema } from 'effect'

const decode = Schema.decodeUnknownSync(Schema.BigDecimalFromNumber)

console.log(decode(0.111))
// Output: { _id: 'BigDecimal', value: '111', scale: 3 }
```

### clampBigDecimal

Clamps a `BigDecimal` within a specified range.

**Example** (Clamping BigDecimal)

```ts twoslash
import { Schema } from 'effect'
import { BigDecimal } from 'effect'

const schema = Schema.BigDecimal.pipe(
  Schema.clampBigDecimal(BigDecimal.fromNumber(-1), BigDecimal.fromNumber(1))
)

const decode = Schema.decodeUnknownSync(schema)

console.log(decode('-2'))
// Output: { _id: 'BigDecimal', value: '-1', scale: 0 }

console.log(decode('0'))
// Output: { _id: 'BigDecimal', value: '0', scale: 0 }

console.log(decode('3'))
// Output: { _id: 'BigDecimal', value: '1', scale: 0 }
```

# [Sink Concurrency](https://effect.website/docs/sink/concurrency/)
