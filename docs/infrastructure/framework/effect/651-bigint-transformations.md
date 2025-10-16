## BigInt transformations

### BigInt

Converts a string to a `BigInt` using the `BigInt` constructor.

**Example** (Parsing BigInt from String)

```ts twoslash
import { Schema } from "effect"

const decode = Schema.decodeUnknownSync(Schema.BigInt)

// success cases
console.log(decode("1")) // 1n
console.log(decode("-1")) // -1n

// failure cases
decode("a")
/*
throws:
ParseError: bigint
└─ Transformation process failure
   └─ Expected bigint, actual "a"
*/
decode("1.5") // throws
decode("NaN") // throws
decode("Infinity") // throws
decode("-Infinity") // throws
```

### BigIntFromNumber

Converts a number to a `BigInt` using the `BigInt` constructor.

**Example** (Parsing BigInt from Number)

```ts twoslash
import { Schema } from "effect"

const decode = Schema.decodeUnknownSync(Schema.BigIntFromNumber)
const encode = Schema.encodeSync(Schema.BigIntFromNumber)

// success cases
console.log(decode(1)) // 1n
console.log(decode(-1)) // -1n
console.log(encode(1n)) // 1
console.log(encode(-1n)) // -1

// failure cases
decode(1.5)
/*
throws:
ParseError: BigintFromNumber
└─ Transformation process failure
   └─ Expected BigintFromNumber, actual 1.5
*/

decode(NaN) // throws
decode(Infinity) // throws
decode(-Infinity) // throws
encode(BigInt(Number.MAX_SAFE_INTEGER) + 1n) // throws
encode(BigInt(Number.MIN_SAFE_INTEGER) - 1n) // throws
```

### clampBigInt

Restricts a `BigInt` within a specified range.

**Example** (Clamping BigInt)

```ts twoslash
import { Schema } from "effect"

// clamps the input to -1n <= x <= 1n
const schema = Schema.BigIntFromSelf.pipe(Schema.clampBigInt(-1n, 1n))

const decode = Schema.decodeUnknownSync(schema)

console.log(decode(-3n))
// Output: -1n

console.log(decode(0n))
// Output: 0n

console.log(decode(3n))
// Output: 1n
```
