## Generalizing Branded Types

To enhance the versatility and reusability of branded types, they can be generalized using a standardized approach:

```ts twoslash
const BrandTypeId: unique symbol = Symbol.for("effect/Brand")

// Create a generic Brand interface using a unique identifier
interface Brand<in out ID extends string | symbol> {
  readonly [BrandTypeId]: {
    readonly [id in ID]: ID
  }
}

// Define a ProductId type branded with a unique identifier
type ProductId = number & Brand<"ProductId">

// Define a UserId type branded similarly
type UserId = number & Brand<"UserId">
```

This design allows any type to be branded using a unique identifier, either a string or symbol.

Here's how you can utilize the `Brand` interface, which is readily available from the Brand module, eliminating the need to craft your own implementation:

**Example** (Using the Brand Interface from the Brand Module)

```ts
import { Brand } from "effect"

// Define a ProductId type branded with a unique identifier
type ProductId = number & Brand.Brand<"ProductId">

// Define a UserId type branded similarly
type UserId = number & Brand.Brand<"UserId">
```

However, creating instances of these types directly leads to an error because the type system expects the brand structure:

**Example** (Direct Assignment Error)

```ts twoslash
const BrandTypeId: unique symbol = Symbol.for("effect/Brand")

interface Brand<in out K extends string | symbol> {
  readonly [BrandTypeId]: {
    readonly [k in K]: K
  }
}

type ProductId = number & Brand<"ProductId">

// @errors: 2322
const id: ProductId = 1
```

You cannot directly assign a `number` to `ProductId`. The Brand module provides utilities to correctly construct values of branded types.
