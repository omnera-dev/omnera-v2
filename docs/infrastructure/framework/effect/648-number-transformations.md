## Number Transformations

### NumberFromString

Transforms a string into a number by parsing the string using the `parse` function of the `effect/Number` module.

It returns an error if the value can't be converted (for example when non-numeric characters are provided).

The following special string values are supported: "NaN", "Infinity", "-Infinity".

**Example** (Parsing Number from String)

```ts twoslash
import { Schema } from "effect"

const schema = Schema.NumberFromString

const decode = Schema.decodeUnknownSync(schema)

// success cases
console.log(decode("1")) // 1
console.log(decode("-1")) // -1
console.log(decode("1.5")) // 1.5
console.log(decode("NaN")) // NaN
console.log(decode("Infinity")) // Infinity
console.log(decode("-Infinity")) // -Infinity

// failure cases
decode("a")
/*
throws:
ParseError: NumberFromString
└─ Transformation process failure
   └─ Expected NumberFromString, actual "a"
*/
```

### clamp

Restricts a number within a specified range.

**Example** (Clamping a Number)

```ts twoslash
import { Schema } from "effect"

// clamps the input to -1 <= x <= 1
const schema = Schema.Number.pipe(Schema.clamp(-1, 1))

const decode = Schema.decodeUnknownSync(schema)

console.log(decode(-3)) // -1
console.log(decode(0)) // 0
console.log(decode(3)) // 1
```

### parseNumber

Transforms a string into a number by parsing the string using the `parse` function of the `effect/Number` module.

It returns an error if the value can't be converted (for example when non-numeric characters are provided).

The following special string values are supported: "NaN", "Infinity", "-Infinity".

**Example** (Parsing and Validating Numbers)

```ts twoslash
import { Schema } from "effect"

const schema = Schema.String.pipe(Schema.parseNumber)

const decode = Schema.decodeUnknownSync(schema)

console.log(decode("1")) // 1
console.log(decode("Infinity")) // Infinity
console.log(decode("NaN")) // NaN
console.log(decode("-"))
/*
throws
ParseError: (string <-> number)
└─ Transformation process failure
   └─ Expected (string <-> number), actual "-"
*/
```
