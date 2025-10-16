## Pattern Matching

Use `Option.match` to handle both cases of an `Option` by specifying separate callbacks for `None` and `Some`.

**Example** (Pattern Matching with Option)

```ts twoslash
import { Option } from 'effect'

const foo = Option.some(1)

const message = Option.match(foo, {
  onNone: () => 'Option is empty',
  onSome: (value) => `Option has a value: ${value}`,
})

console.log(message)
// Output: "Option has a value: 1"
```
