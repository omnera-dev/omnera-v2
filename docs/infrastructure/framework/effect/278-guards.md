## Guards

You can check whether an `Option` is a `Some` or a `None` using the `Option.isSome` and `Option.isNone` guards.

**Example** (Using Guards to Check Option Values)

```ts twoslash
import { Option } from "effect"

const foo = Option.some(1)

console.log(Option.isSome(foo))
// Output: true

if (Option.isNone(foo)) {
  console.log("Option is empty")
} else {
  console.log(`Option has a value: ${foo.value}`)
}
// Output: "Option has a value: 1"
```
