## Overview

import { Aside } from "@astrojs/starlight/components"

In typical application development, when interacting with external APIs, databases, or other data sources, we often define functions that perform requests and handle their results or failures accordingly.

### Simple Model Setup

Here's a basic model that outlines the structure of our data and possible errors:

```ts twoslash
import { Data } from "effect"

// ------------------------------
// Model
// ------------------------------

interface User {
  readonly _tag: "User"
  readonly id: number
  readonly name: string
  readonly email: string
}

class GetUserError extends Data.TaggedError("GetUserError")<{}> {}

interface Todo {
  readonly _tag: "Todo"
  readonly id: number
  readonly message: string
  readonly ownerId: number
}

class GetTodosError extends Data.TaggedError("GetTodosError")<{}> {}

class SendEmailError extends Data.TaggedError("SendEmailError")<{}> {}
```

<Aside type="tip" title="Use Precise Types and Detailed Errors">
  In a real world scenario we may want to use a more precise types instead
  of directly using primitives for identifiers (see [Branded
  Types](/docs/code-style/branded-types/)). Additionally, you may want to
  include more detailed information in the errors.
</Aside>

### Defining API Functions

Let's define functions that interact with an external API, handling common operations such as fetching todos, retrieving user details, and sending emails.

```ts twoslash collapse={7-25}
import { Effect, Data } from "effect"

// ------------------------------
// Model
// ------------------------------

interface User {
  readonly _tag: "User"
  readonly id: number
  readonly name: string
  readonly email: string
}

class GetUserError extends Data.TaggedError("GetUserError")<{}> {}

interface Todo {
  readonly _tag: "Todo"
  readonly id: number
  readonly message: string
  readonly ownerId: number
}

class GetTodosError extends Data.TaggedError("GetTodosError")<{}> {}

class SendEmailError extends Data.TaggedError("SendEmailError")<{}> {}

// ------------------------------
// API
// ------------------------------

// Fetches a list of todos from an external API
const getTodos = Effect.tryPromise({
  try: () =>
    fetch("https://api.example.demo/todos").then(
      (res) => res.json() as Promise<Array<Todo>>
    ),
  catch: () => new GetTodosError()
})

// Retrieves a user by their ID from an external API
const getUserById = (id: number) =>
  Effect.tryPromise({
    try: () =>
      fetch(`https://api.example.demo/getUserById?id=${id}`).then(
        (res) => res.json() as Promise<User>
      ),
    catch: () => new GetUserError()
  })

// Sends an email via an external API
const sendEmail = (address: string, text: string) =>
  Effect.tryPromise({
    try: () =>
      fetch("https://api.example.demo/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ address, text })
      }).then((res) => res.json() as Promise<void>),
    catch: () => new SendEmailError()
  })

// Sends an email to a user by fetching their details first
const sendEmailToUser = (id: number, message: string) =>
  getUserById(id).pipe(
    Effect.andThen((user) => sendEmail(user.email, message))
  )

// Notifies the owner of a todo by sending them an email
const notifyOwner = (todo: Todo) =>
  getUserById(todo.ownerId).pipe(
    Effect.andThen((user) =>
      sendEmailToUser(user.id, `hey ${user.name} you got a todo!`)
    )
  )
```

<Aside type="tip" title="Validating API Responses">
  In a real-world scenario, you might not want to trust your APIs to
  always return the expected data - for this, you can use
  [`effect/Schema`](/docs/schema/introduction/) or similar alternatives
  such as `zod`.
</Aside>

While this approach is straightforward and readable, it may not be the most efficient. Repeated API calls, especially when many todos share the same owner, can significantly increase network overhead and slow down your application.

### Using the API Functions

While these functions are clear and easy to understand, their use may not be the most efficient. For example, notifying todo owners involves repeated API calls which can be optimized.

```ts twoslash collapse={7-25,31-76}
import { Effect, Data } from "effect"

// ------------------------------
// Model
// ------------------------------

interface User {
  readonly _tag: "User"
  readonly id: number
  readonly name: string
  readonly email: string
}

class GetUserError extends Data.TaggedError("GetUserError")<{}> {}

interface Todo {
  readonly _tag: "Todo"
  readonly id: number
  readonly message: string
  readonly ownerId: number
}

class GetTodosError extends Data.TaggedError("GetTodosError")<{}> {}

class SendEmailError extends Data.TaggedError("SendEmailError")<{}> {}

// ------------------------------
// API
// ------------------------------

// Fetches a list of todos from an external API
const getTodos = Effect.tryPromise({
  try: () =>
    fetch("https://api.example.demo/todos").then(
      (res) => res.json() as Promise<Array<Todo>>
    ),
  catch: () => new GetTodosError()
})

// Retrieves a user by their ID from an external API
const getUserById = (id: number) =>
  Effect.tryPromise({
    try: () =>
      fetch(`https://api.example.demo/getUserById?id=${id}`).then(
        (res) => res.json() as Promise<User>
      ),
    catch: () => new GetUserError()
  })

// Sends an email via an external API
const sendEmail = (address: string, text: string) =>
  Effect.tryPromise({
    try: () =>
      fetch("https://api.example.demo/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ address, text })
      }).then((res) => res.json() as Promise<void>),
    catch: () => new SendEmailError()
  })

// Sends an email to a user by fetching their details first
const sendEmailToUser = (id: number, message: string) =>
  getUserById(id).pipe(
    Effect.andThen((user) => sendEmail(user.email, message))
  )

// Notifies the owner of a todo by sending them an email
const notifyOwner = (todo: Todo) =>
  getUserById(todo.ownerId).pipe(
    Effect.andThen((user) =>
      sendEmailToUser(user.id, `hey ${user.name} you got a todo!`)
    )
  )

// Orchestrates operations on todos, notifying their owners
const program = Effect.gen(function* () {
  const todos = yield* getTodos
  yield* Effect.forEach(todos, (todo) => notifyOwner(todo), {
    concurrency: "unbounded"
  })
})
```

This implementation performs an API call for each todo to fetch the owner's details and send an email. If multiple todos have the same owner, this results in redundant API calls.

<Aside type="tip" title="Improving Efficiency with Batch Calls">
  To optimize, consider implementing batch API calls if your backend
  supports them. This reduces the number of HTTP requests by grouping
  multiple operations into a single request, thereby enhancing performance
  and reducing load.
</Aside>
