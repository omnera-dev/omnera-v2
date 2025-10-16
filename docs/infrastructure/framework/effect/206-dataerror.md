## Data.Error

The `Data.Error` constructor provides a way to define a base class for yieldable errors.

**Example** (Creating and Yielding a Custom Error)

```ts twoslash
import { Effect, Data } from 'effect'

// Define a custom error class extending Data.Error
class MyError extends Data.Error<{ message: string }> {}

export const program = Effect.gen(function* () {
  // Yield a custom error (equivalent to failing with MyError)
  yield* new MyError({ message: 'Oh no!' })
})

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: { message: 'Oh no!' } }
}
*/
```
