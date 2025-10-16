## Constructing Branded Types

The Brand module provides two main functions for creating branded types: `nominal` and `refined`.

### nominal

The `Brand.nominal` function is designed for defining branded types that do not require runtime validations.
It simply adds a type tag to the underlying type, allowing us to distinguish between values of the same type but with different meanings.
Nominal branded types are useful when we only want to create distinct types for clarity and code organization purposes.

**Example** (Defining Distinct Identifiers with Nominal Branding)

```ts twoslash
import { Brand } from "effect"

// Define UserId as a branded number
type UserId = number & Brand.Brand<"UserId">

// Constructor for UserId
const UserId = Brand.nominal<UserId>()

const getUserById = (id: UserId) => {
  // Logic to retrieve user
}

// Define ProductId as a branded number
type ProductId = number & Brand.Brand<"ProductId">

// Constructor for ProductId
const ProductId = Brand.nominal<ProductId>()

const getProductById = (id: ProductId) => {
  // Logic to retrieve product
}
```

Attempting to assign a non-`ProductId` value will result in a compile-time error:

**Example** (Type Safety with Branded Identifiers)

```ts twoslash
import { Brand } from "effect"

type UserId = number & Brand.Brand<"UserId">

const UserId = Brand.nominal<UserId>()

const getUserById = (id: UserId) => {
  // Logic to retrieve user
}

type ProductId = number & Brand.Brand<"ProductId">

const ProductId = Brand.nominal<ProductId>()

const getProductById = (id: ProductId) => {
  // Logic to retrieve product
}

// Correct usage
getProductById(ProductId(1))

// Incorrect, will result in an error
// @errors: 2345
getProductById(1)

// Also incorrect, will result in an error
// @errors: 2345
getProductById(UserId(1))
```

### refined

The `Brand.refined` function enables the creation of branded types that include data validation. It requires a refinement predicate to check the validity of input data against specific criteria.

When the input data does not meet the criteria, the function uses `Brand.error` to generate a `BrandErrors` data type. This provides detailed information about why the validation failed.

**Example** (Creating a Branded Type with Validation)

```ts twoslash
import { Brand } from "effect"

// Define a branded type 'Int' to represent integer values
type Int = number & Brand.Brand<"Int">

// Define the constructor using 'refined' to enforce integer values
const Int = Brand.refined<Int>(
  // Validation to ensure the value is an integer
  (n) => Number.isInteger(n),
  // Provide an error if validation fails
  (n) => Brand.error(`Expected ${n} to be an integer`)
)
```

**Example** (Using the `Int` Constructor)

```ts twoslash
import { Brand } from "effect"

type Int = number & Brand.Brand<"Int">

const Int = Brand.refined<Int>(
  // Check if the value is an integer
  (n) => Number.isInteger(n),
  // Error message if the value is not an integer
  (n) => Brand.error(`Expected ${n} to be an integer`)
)

// Create a valid Int value
const x: Int = Int(3)
console.log(x) // Output: 3

// Attempt to create an Int with an invalid value
const y: Int = Int(3.14)
// throws [ { message: 'Expected 3.14 to be an integer' } ]
```

Attempting to assign a non-`Int` value will result in a compile-time error:

**Example** (Compile-Time Error for Incorrect Assignments)

```ts twoslash
import { Brand } from "effect"

type Int = number & Brand.Brand<"Int">

const Int = Brand.refined<Int>(
  (n) => Number.isInteger(n),
  (n) => Brand.error(`Expected ${n} to be an integer`)
)

// Correct usage
const good: Int = Int(3)

// Incorrect, will result in an error
// @errors: 2322
const bad1: Int = 3

// Also incorrect, will result in an error
// @errors: 2322
const bad2: Int = 3.14
```
