## Interop with Nullable Types

When dealing with the `Option` data type, you may encounter code that uses `undefined` or `null` to represent optional values. The `Option` module provides several APIs to make interaction with these nullable types straightforward.

### fromNullable

`Option.fromNullable` converts a nullable value (`null` or `undefined`) into an `Option`. If the value is `null` or `undefined`, it returns `Option.none()`. Otherwise, it wraps the value in `Option.some()`.

**Example** (Creating Option from Nullable Values)

```ts twoslash
import { Option } from 'effect'

console.log(Option.fromNullable(null))
// Output: { _id: 'Option', _tag: 'None' }

console.log(Option.fromNullable(undefined))
// Output: { _id: 'Option', _tag: 'None' }

console.log(Option.fromNullable(1))
// Output: { _id: 'Option', _tag: 'Some', value: 1 }
```

If you need to convert an `Option` back to a nullable value, there are two helper methods:

- `Option.getOrNull`: Converts `None` to `null`.
- `Option.getOrUndefined`: Converts `None` to `undefined`.
