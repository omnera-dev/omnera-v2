## Overview

import { Aside } from "@astrojs/starlight/components"

Expected errors are tracked at the type level by the [Effect data type](/docs/getting-started/the-effect-type/) in the "Error channel":

```text showLineNumbers=false "Error"
         ┌─── Represents the success type
         │        ┌─── Represents the error type
         │        │      ┌─── Represents required dependencies
         ▼        ▼      ▼
Effect<Success, Error, Requirements>
```

This means that the `Effect` type captures not only what the program returns on success but also what type of error it might produce.

**Example** (Creating an Effect That Can Fail)

In this example, we define a program that might randomly fail with an `HttpError`.

```ts twoslash
import { Effect, Random, Data } from 'effect'

// Define a custom error type using Data.TaggedError
class HttpError extends Data.TaggedError('HttpError')<{}> {}

//      ┌─── Effect<string, HttpError, never>
//      ▼
const program = Effect.gen(function* () {
  // Generate a random number between 0 and 1
  const n = yield* Random.next

  // Simulate an HTTP error
  if (n < 0.5) {
    return yield* Effect.fail(new HttpError())
  }

  return 'some result'
})
```

The type of `program` tells us that it can either return a `string` or fail with an `HttpError`:

```ts "string" "HttpError" showLineNumbers=false
const program: Effect<string, HttpError, never>
```

In this case, we use a class to represent the `HttpError` type, which allows us to define both the error type and a constructor.

When using `Data.TaggedError`, a `_tag` field is automatically added to the class

```ts showLineNumbers=false
// This field serves as a discriminant for the error
console.log(new HttpError()._tag)
// Output: "HttpError"
```

This discriminant field will be useful when we discuss APIs like [Effect.catchTag](#catchtag), which help in handling specific error types.

<Aside type="tip" title="Why Tagged Errors Are Useful">
  Adding a discriminant field, such as `_tag`, can be beneficial for
  distinguishing between different types of errors during error handling.
  It also prevents TypeScript from unifying types, ensuring that each
  error is treated uniquely based on its discriminant value.

For more information on constructing tagged errors, see [Data.TaggedError](/docs/error-management/yieldable-errors/#datataggederror).

</Aside>
