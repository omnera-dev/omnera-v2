## Guards

Use `Either.isLeft` and `Either.isRight` to check whether an `Either` is a `Left` or `Right` value.

**Example** (Using Guards to Check the Type of Either)

```ts twoslash
import { Either } from 'effect'

const foo = Either.right(42)

if (Either.isLeft(foo)) {
  console.log(`The left value is: ${foo.left}`)
} else {
  console.log(`The Right value is: ${foo.right}`)
}
// Output: "The Right value is: 42"
```
