## Refining Errors

When working with streams, there might be situations where you want to selectively keep certain errors and terminate the stream with the remaining errors. You can achieve this using the `Stream.refineOrDie` function.

**Example**

```ts twoslash
import { Stream, Option } from "effect"

const stream = Stream.fail(new Error())

const res = Stream.refineOrDie(stream, (error) => {
  if (error instanceof SyntaxError) {
    return Option.some(error)
  }
  return Option.none()
})
```

In this example, `stream` initially fails with a generic `Error`. However, we use `Stream.refineOrDie` to filter and keep only errors of type `SyntaxError`. Any other errors will be terminated, while `SyntaxErrors` will be retained in `refinedStream`.
