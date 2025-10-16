## Errors

In Effect, handling errors is simplified using specialized constructors:

- `Error`
- `TaggedError`

These constructors make defining custom error types straightforward, while also providing useful integrations like equality checks and structured error handling.

### Error

`Data.Error` lets you create an `Error` type with extra fields beyond the typical `message` property.

**Example** (Creating a Custom Error with Additional Fields)

```ts twoslash
import { Data } from 'effect'

// Define a custom error with additional fields
class NotFound extends Data.Error<{ message: string; file: string }> {}

// Create an instance of the custom error
const err = new NotFound({
  message: 'Cannot find this file',
  file: 'foo.txt',
})

console.log(err instanceof Error)
// Output: true

console.log(err.file)
// Output: foo.txt
console.log(err)
/*
Output:
NotFound [Error]: Cannot find this file
  file: 'foo.txt'
  ... stack trace ...
*/
```

You can yield an instance of `NotFound` directly in an [Effect.gen](/docs/getting-started/using-generators/), without needing to use `Effect.fail`.

**Example** (Yielding a Custom Error in `Effect.gen`)

```ts twoslash
import { Data, Effect } from 'effect'

class NotFound extends Data.Error<{ message: string; file: string }> {}

const program = Effect.gen(function* () {
  yield* new NotFound({
    message: 'Cannot find this file',
    file: 'foo.txt',
  })
})

Effect.runPromise(program)
/*
throws:
Error: Cannot find this file
    at ... {
  name: '(FiberFailure) Error',
  [Symbol(effect/Runtime/FiberFailure/Cause)]: {
    _tag: 'Fail',
    error: NotFound [Error]: Cannot find this file
        at ...stack trace...
      file: 'foo.txt'
    }
  }
}
*/
```

### TaggedError

Effect provides a `TaggedError` API to add a `_tag` field automatically to your custom errors. This simplifies error handling with APIs like [Effect.catchTag](/docs/error-management/expected-errors/#catchtag) or [Effect.catchTags](/docs/error-management/expected-errors/#catchtags).

```ts twoslash
import { Data, Effect, Console } from 'effect'

// Define a custom tagged error
class NotFound extends Data.TaggedError('NotFound')<{
  message: string
  file: string
}> {}

const program = Effect.gen(function* () {
  yield* new NotFound({
    message: 'Cannot find this file',
    file: 'foo.txt',
  })
}).pipe(
  // Catch and handle the tagged error
  Effect.catchTag('NotFound', (err) => Console.error(`${err.message} (${err.file})`))
)

Effect.runPromise(program)
// Output: Cannot find this file (foo.txt)
```

### Native Cause Support

Errors created using `Data.Error` or `Data.TaggedError` can include a `cause` property, integrating with the native `cause` feature of JavaScript's `Error` for more detailed error tracing.

**Example** (Using the `cause` Property)

```ts twoslash {22}
import { Data, Effect } from 'effect'

// Define an error with a cause property
class MyError extends Data.Error<{ cause: Error }> {}

const program = Effect.gen(function* () {
  yield* new MyError({
    cause: new Error('Something went wrong'),
  })
})

Effect.runPromise(program)
/*
throws:
Error: An error has occurred
    at ... {
  name: '(FiberFailure) Error',
  [Symbol(effect/Runtime/FiberFailure/Cause)]: {
    _tag: 'Fail',
    error: MyError
        at ...
      [cause]: Error: Something went wrong
          at ...
*/
```

# [DateTime](https://effect.website/docs/data-types/datetime/)
