## Combining Branded Types

In some cases, you might need to combine multiple branded types. The Brand module provides the `Brand.all` API for this purpose:

**Example** (Combining Multiple Branded Types)

```ts twoslash
import { Brand } from "effect"

type Int = number & Brand.Brand<"Int">

const Int = Brand.refined<Int>(
  (n) => Number.isInteger(n),
  (n) => Brand.error(`Expected ${n} to be an integer`)
)

type Positive = number & Brand.Brand<"Positive">

const Positive = Brand.refined<Positive>(
  (n) => n > 0,
  (n) => Brand.error(`Expected ${n} to be positive`)
)

// Combine the Int and Positive constructors
// into a new branded constructor PositiveInt
const PositiveInt = Brand.all(Int, Positive)

// Extract the branded type from the PositiveInt constructor
type PositiveInt = Brand.Brand.FromConstructor<typeof PositiveInt>

// Usage example

// Valid positive integer
const good: PositiveInt = PositiveInt(10)

// throws [ { message: 'Expected -5 to be positive' } ]
const bad1: PositiveInt = PositiveInt(-5)

// throws [ { message: 'Expected 3.14 to be an integer' } ]
const bad2: PositiveInt = PositiveInt(3.14)
```

# [Simplifying Excessive Nesting](https://effect.website/docs/code-style/do/)
