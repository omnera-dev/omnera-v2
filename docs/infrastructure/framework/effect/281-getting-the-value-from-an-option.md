## Getting the Value from an Option

To retrieve the value stored inside an `Option`, you can use several helper functions provided by the `Option` module. Here's an overview of the available methods:

### getOrThrow

This function extracts the value from a `Some`. If the `Option` is `None`, it throws an error.

**Example** (Retrieving Value or Throwing an Error)

```ts twoslash
import { Option } from 'effect'

console.log(Option.getOrThrow(Option.some(10)))
// Output: 10

console.log(Option.getOrThrow(Option.none()))
// throws: Error: getOrThrow called on a None
```

### getOrNull / getOrUndefined

These functions convert a `None` to either `null` or `undefined`, which is useful when working with non-`Option`-based code.

**Example** (Converting `None` to `null` or `undefined`)

```ts twoslash
import { Option } from 'effect'

console.log(Option.getOrNull(Option.some(5)))
// Output: 5

console.log(Option.getOrNull(Option.none()))
// Output: null

console.log(Option.getOrUndefined(Option.some(5)))
// Output: 5

console.log(Option.getOrUndefined(Option.none()))
// Output: undefined
```

### getOrElse

This function allows you to specify a default value to return when the `Option` is `None`.

**Example** (Providing a Default Value When `None`)

```ts twoslash
import { Option } from 'effect'

console.log(Option.getOrElse(Option.some(5), () => 0))
// Output: 5

console.log(Option.getOrElse(Option.none(), () => 0))
// Output: 0
```
