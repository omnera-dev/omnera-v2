## The Role of Short-Circuiting

When working with `Effect.gen`, it is important to understand how it handles errors.
This API will stop execution at the **first error** it encounters and return that error.

How does this affect your code? If you have several operations in sequence, once any one of them fails, the remaining operations will not run, and the error will be returned.

In simpler terms, if something fails at any point, the program will stop right there and deliver the error to you.

**Example** (Halting Execution at the First Error)

```ts twoslash
import { Effect, Console } from "effect"

const task1 = Console.log("task1...")
const task2 = Console.log("task2...")
const failure = Effect.fail("Something went wrong!")
const task4 = Console.log("task4...")

const program = Effect.gen(function* () {
  yield* task1
  yield* task2
  // The program stops here due to the error
  yield* failure
  // The following lines never run
  yield* task4
  return "some result"
})

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
task1...
task2...
(FiberFailure) Error: Something went wrong!
*/
```

Even though execution never reaches code after a failure, TypeScript may still assume that the code below the error is reachable unless you explicitly return after the failure.

For example, consider the following scenario where you want to narrow the type of a variable:

**Example** (Type Narrowing without Explicit Return)

```ts twoslash
import { Effect } from "effect"

type User = {
  readonly name: string
}

// Imagine this function checks a database or an external service
declare function getUserById(id: string): Effect.Effect<User | undefined>

function greetUser(id: string) {
  return Effect.gen(function* () {
    const user = yield* getUserById(id)

    if (user === undefined) {
      // Even though we fail here, TypeScript still thinks
      // 'user' might be undefined later
      yield* Effect.fail(`User with id ${id} not found`)
    }

// @errors: 18048
    return `Hello, ${user.name}!`
  })
}
```

In this example, TypeScript still considers `user` possibly `undefined` because there is no explicit return after the failure.

To fix this, explicitly return right after calling `Effect.fail`:

**Example** (Type Narrowing with Explicit Return)

```ts twoslash {15}
import { Effect } from "effect"

type User = {
  readonly name: string
}

declare function getUserById(id: string): Effect.Effect<User | undefined>

function greetUser(id: string) {
  return Effect.gen(function* () {
    const user = yield* getUserById(id)

    if (user === undefined) {
      // Explicitly return after failing
      return yield* Effect.fail(`User with id ${id} not found`)
    }

    // Now TypeScript knows that 'user' is not undefined
    return `Hello, ${user.name}!`
  })
}
```

<Aside type="note" title="Further Learning">
  To learn more about error handling in Effect, refer to the [Error
  Management](/docs/error-management/two-error-types/) section.
</Aside>
