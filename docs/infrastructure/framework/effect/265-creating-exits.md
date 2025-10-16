## Creating Exits

The Exit module provides two primary functions for constructing exit values: `Exit.succeed` and `Exit.failCause`.
These functions represent the outcomes of an effectful computation in terms of success or failure.

### succeed

`Exit.succeed` creates an `Exit` value that represents a successful outcome.
You use this function when you want to indicate that a computation completed successfully and to provide the resulting value.

**Example** (Creating a Successful Exit)

```ts twoslash
import { Exit } from "effect"

// Create an Exit representing a successful outcome with the value 42
//
//      ┌─── Exit<number, never>
//      ▼
const successExit = Exit.succeed(42)

console.log(successExit)
// Output: { _id: 'Exit', _tag: 'Success', value: 42 }
```

### failCause

`Exit.failCause` creates an `Exit` value that represents a failure.
The failure is described using a [Cause](/docs/data-types/cause/) object, which can encapsulate expected errors, defects, interruptions, or even composite errors.

**Example** (Creating a Failed Exit)

```ts twoslash
import { Exit, Cause } from "effect"

// Create an Exit representing a failure with an error message
//
//      ┌─── Exit<never, string>
//      ▼
const failureExit = Exit.failCause(Cause.fail("Something went wrong"))

console.log(failureExit)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Something went wrong' }
}
*/
```
