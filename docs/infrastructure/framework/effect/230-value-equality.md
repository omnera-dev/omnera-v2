## Value Equality

The Data module provides constructors for creating data types with built-in support for equality and hashing, eliminating the need for custom implementations.

This means that two values created using these constructors are considered equal if they have the same structure and values.

### struct

In plain JavaScript, objects are considered equal only if they refer to the exact same instance.

**Example** (Comparing Two Objects in Plain JavaScript)

```ts twoslash
const alice = { name: "Alice", age: 30 }

// This comparison is false because they are different instances
// @errors: 2839
console.log(alice === { name: "Alice", age: 30 }) // Output: false
```

However, the `Data.struct` constructor allows you to compare values based on their structure and content.

**Example** (Creating and Checking Equality of Structs)

```ts twoslash
import { Data, Equal } from "effect"

//      ┌─── { readonly name: string; readonly age: number; }
//      ▼
const alice = Data.struct({ name: "Alice", age: 30 })

// Check if Alice is equal to a new object
// with the same structure and values
console.log(Equal.equals(alice, Data.struct({ name: "Alice", age: 30 })))
// Output: true

// Check if Alice is equal to a plain JavaScript object
// with the same content
console.log(Equal.equals(alice, { name: "Alice", age: 30 }))
// Output: false
```

The comparison performed by `Equal.equals` is **shallow**, meaning nested objects are not compared recursively unless they are also created using `Data.struct`.

**Example** (Shallow Comparison with Nested Objects)

```ts twoslash
import { Data, Equal } from "effect"

const nested = Data.struct({ name: "Alice", nested_field: { value: 42 } })

// This will be false because the nested objects are compared by reference
console.log(
  Equal.equals(
    nested,
    Data.struct({ name: "Alice", nested_field: { value: 42 } })
  )
)
// Output: false
```

To ensure nested objects are compared by structure, use `Data.struct` for them as well.

**Example** (Correctly Comparing Nested Objects)

```ts twoslash
import { Data, Equal } from "effect"

const nested = Data.struct({
  name: "Alice",
  nested_field: Data.struct({ value: 42 })
})

// Now, the comparison returns true
console.log(
  Equal.equals(
    nested,
    Data.struct({
      name: "Alice",
      nested_field: Data.struct({ value: 42 })
    })
  )
)
// Output: true
```

### tuple

To represent your data using tuples, you can use the `Data.tuple` constructor. This ensures that your tuples can be compared structurally.

**Example** (Creating and Checking Equality of Tuples)

```ts twoslash
import { Data, Equal } from "effect"

//      ┌─── readonly [string, number]
//      ▼
const alice = Data.tuple("Alice", 30)

// Check if Alice is equal to a new tuple
// with the same structure and values
console.log(Equal.equals(alice, Data.tuple("Alice", 30)))
// Output: true

// Check if Alice is equal to a plain JavaScript tuple
// with the same content
console.log(Equal.equals(alice, ["Alice", 30]))
// Output: false
```

<Aside type="caution" title="Shallow Comparison">
  `Equal.equals` only checks the top-level structure. Use `Data`
  constructors for nested objects if you need deep comparisons.
</Aside>

### array

You can use `Data.array` to create an array-like data structure that supports structural equality.

**Example** (Creating and Checking Equality of Arrays)

```ts twoslash
import { Data, Equal } from "effect"

//      ┌─── readonly number[]
//      ▼
const numbers = Data.array([1, 2, 3, 4, 5])

// Check if the array is equal to a new array
// with the same values
console.log(Equal.equals(numbers, Data.array([1, 2, 3, 4, 5])))
// Output: true

// Check if the array is equal to a plain JavaScript array
// with the same content
console.log(Equal.equals(numbers, [1, 2, 3, 4, 5]))
// Output: false
```

<Aside type="caution" title="Shallow Comparison">
  `Equal.equals` only checks the top-level structure. Use `Data`
  constructors for nested objects if you need deep comparisons.
</Aside>
