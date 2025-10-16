## Error Tracking

With `Effect.succeed` and `Effect.fail`, you can explicitly handle success and failure cases and the type system will ensure that errors are tracked and accounted for.

**Example** (Rewriting a Division Function)

Here's how you can rewrite the [`divide`](#why-not-throw-errors) function using Effect, making error handling explicit.

```ts twoslash
import { Effect } from "effect"

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)
```

In this example, the `divide` function indicates in its return type `Effect<number, Error>` that the operation can either succeed with a `number` or fail with an `Error`.

```text showLineNumbers=false
         ┌─── Produces a value of type number
         │       ┌─── Fails with an Error
         ▼       ▼
Effect<number, Error>
```

This clear type signature helps ensure that errors are handled properly and that anyone calling the function is aware of the possible outcomes.

**Example** (Simulating a User Retrieval Operation)

Let's imagine another scenario where we use `Effect.succeed` and `Effect.fail` to model a simple user retrieval operation where the user data is hardcoded, which could be useful in testing scenarios or when mocking data:

```ts twoslash
import { Effect } from "effect"

// Define a User type
interface User {
  readonly id: number
  readonly name: string
}

// A mocked function to simulate fetching a user from a database
const getUser = (userId: number): Effect.Effect<User, Error> => {
  // Normally, you would access a database or API here, but we'll mock it
  const userDatabase: Record<number, User> = {
    1: { id: 1, name: "John Doe" },
    2: { id: 2, name: "Jane Smith" }
  }

  // Check if the user exists in our "database" and return appropriately
  const user = userDatabase[userId]
  if (user) {
    return Effect.succeed(user)
  } else {
    return Effect.fail(new Error("User not found"))
  }
}

// When executed, this will successfully return the user with id 1
const exampleUserEffect = getUser(1)
```

In this example, `exampleUserEffect`, which has the type `Effect<User, Error>`, will either produce a `User` object or an `Error`, depending on whether the user exists in the mocked database.

For a deeper dive into managing errors in your applications, refer to the [Error Management Guide](/docs/error-management/expected-errors/).
