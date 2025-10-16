## Working with Option

### map

The `Option.map` function lets you transform the value inside an `Option` without manually unwrapping and re-wrapping it. If the `Option` holds a value (`Some`), the transformation function is applied. If the `Option` is `None`, the function is ignored, and the `Option` remains unchanged.

**Example** (Mapping a Value in Some)

```ts twoslash
import { Option } from "effect"

// Transform the value inside Some
console.log(Option.map(Option.some(1), (n) => n + 1))
// Output: { _id: 'Option', _tag: 'Some', value: 2 }
```

When dealing with `None`, the mapping function is not executed, and the `Option` remains `None`:

**Example** (Mapping over None)

```ts twoslash
import { Option } from "effect"

// Mapping over None results in None
console.log(Option.map(Option.none(), (n) => n + 1))
// Output: { _id: 'Option', _tag: 'None' }
```

### flatMap

The `Option.flatMap` function is similar to `Option.map`, but it is designed to handle cases where the transformation might return another `Option`. This allows us to chain computations that depend on whether or not a value is present in an `Option`.

Consider a `User` model that includes a nested optional `Address`, which itself contains an optional `street` property:

```ts twoslash {7,12}
import { Option } from "effect"

interface User {
  readonly id: number
  readonly username: string
  readonly email: Option.Option<string>
  readonly address: Option.Option<Address>
}

interface Address {
  readonly city: string
  readonly street: Option.Option<string>
}
```

In this model, the `address` field is an `Option<Address>`, and the `street` field within `Address` is an `Option<string>`.

We can use `Option.flatMap` to extract the `street` property from `address`:

**Example** (Extracting a Nested Optional Property)

```ts twoslash
import { Option } from "effect"

interface Address {
  readonly city: string
  readonly street: Option.Option<string>
}

interface User {
  readonly id: number
  readonly username: string
  readonly email: Option.Option<string>
  readonly address: Option.Option<Address>
}

const user: User = {
  id: 1,
  username: "john_doe",
  email: Option.some("john.doe@example.com"),
  address: Option.some({
    city: "New York",
    street: Option.some("123 Main St")
  })
}

// Use flatMap to extract the street value
const street = user.address.pipe(
  Option.flatMap((address) => address.street)
)

console.log(street)
// Output: { _id: 'Option', _tag: 'Some', value: '123 Main St' }
```

If `user.address` is `Some`, `Option.flatMap` applies the function `(address) => address.street` to retrieve the `street` value.

If `user.address` is `None`, the function is not executed, and `street` remains `None`.

This approach lets us handle nested optional values concisely, avoiding manual checks and making the code cleaner and easier to read.

### filter

The `Option.filter` function allows you to filter an `Option` based on a given predicate. If the predicate is not met or if the `Option` is `None`, the result will be `None`.

**Example** (Filtering an Option Value)

Here's how you can simplify some code using `Option.filter` for a more idiomatic approach:

Original Code

```ts twoslash
import { Option } from "effect"

// Function to remove empty strings from an Option
const removeEmptyString = (input: Option.Option<string>) => {
  if (Option.isSome(input) && input.value === "") {
    return Option.none() // Return None if the value is an empty string
  }
  return input // Otherwise, return the original Option
}

console.log(removeEmptyString(Option.none()))
// Output: { _id: 'Option', _tag: 'None' }

console.log(removeEmptyString(Option.some("")))
// Output: { _id: 'Option', _tag: 'None' }

console.log(removeEmptyString(Option.some("a")))
// Output: { _id: 'Option', _tag: 'Some', value: 'a' }
```

Refactored Idiomatic Code

Using `Option.filter`, we can write the same logic more concisely:

```ts twoslash
import { Option } from "effect"

const removeEmptyString = (input: Option.Option<string>) =>
  Option.filter(input, (value) => value !== "")

console.log(removeEmptyString(Option.none()))
// Output: { _id: 'Option', _tag: 'None' }

console.log(removeEmptyString(Option.some("")))
// Output: { _id: 'Option', _tag: 'None' }

console.log(removeEmptyString(Option.some("a")))
// Output: { _id: 'Option', _tag: 'Some', value: 'a' }
```
