## Batching

Let's assume that `getUserById` and `sendEmail` can be batched. This means that we can send multiple requests in a single HTTP call, reducing the number of API requests and improving performance.

**Step-by-Step Guide to Batching**

1. **Declaring Requests:** We'll start by transforming our requests into structured data models. This involves detailing input parameters, expected outputs, and possible errors. Structuring requests this way not only helps in efficiently managing data but also in comparing different requests to understand if they refer to the same input parameters.

2. **Declaring Resolvers:** Resolvers are designed to handle multiple requests simultaneously. By leveraging the ability to compare requests (ensuring they refer to the same input parameters), resolvers can execute several requests in one go, maximizing the utility of batching.

3. **Defining Queries:** Finally, we'll define queries that utilize these batch-resolvers to perform operations. This step ties together the structured requests and their corresponding resolvers into functional components of the application.

<Aside type="caution" title="Ensuring Request Comparability">
  It's crucial for the requests to be modeled in a way that allows them to
  be comparable. This means implementing comparability (using methods like
  [Equals.equals](/docs/trait/equal/)) to identify and batch identical
  requests effectively.
</Aside>

### Declaring Requests

We'll design a model using the concept of a `Request` that a data source might support:

```ts showLineNumbers=false
Request<Value, Error>
```

A `Request` is a construct representing a request for a value of type `Value`, which might fail with an error of type `Error`.

Let's start by defining a structured model for the types of requests our data sources can handle.

```ts twoslash collapse={7-25}
import { Request, Data } from "effect"

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
// Requests
// ------------------------------

// Define a request to get multiple Todo items which might
// fail with a GetTodosError
interface GetTodos extends Request.Request<Array<Todo>, GetTodosError> {
  readonly _tag: "GetTodos"
}

// Create a tagged constructor for GetTodos requests
const GetTodos = Request.tagged<GetTodos>("GetTodos")

// Define a request to fetch a User by ID which might
// fail with a GetUserError
interface GetUserById extends Request.Request<User, GetUserError> {
  readonly _tag: "GetUserById"
  readonly id: number
}

// Create a tagged constructor for GetUserById requests
const GetUserById = Request.tagged<GetUserById>("GetUserById")

// Define a request to send an email which might
// fail with a SendEmailError
interface SendEmail extends Request.Request<void, SendEmailError> {
  readonly _tag: "SendEmail"
  readonly address: string
  readonly text: string
}

// Create a tagged constructor for SendEmail requests
const SendEmail = Request.tagged<SendEmail>("SendEmail")
```

Each request is defined with a specific data structure that extends from a generic `Request` type, ensuring that each request carries its unique data requirements along with a specific error type.

By using tagged constructors like `Request.tagged`, we can easily instantiate request objects that are recognizable and manageable throughout the application.

### Declaring Resolvers

After defining our requests, the next step is configuring how Effect resolves these requests using `RequestResolver`:

```ts showLineNumbers=false
RequestResolver<A, R>
```

A `RequestResolver` requires an environment `R` and is capable of executing requests of type `A`.

In this section, we'll create individual resolvers for each type of request. The granularity of your resolvers can vary, but typically, they are divided based on the batching capabilities of the corresponding API calls.

```ts twoslash collapse={7-25,31-59}
import { Effect, Request, RequestResolver, Data } from "effect"

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
// Requests
// ------------------------------

// Define a request to get multiple Todo items which might
// fail with a GetTodosError
interface GetTodos extends Request.Request<Array<Todo>, GetTodosError> {
  readonly _tag: "GetTodos"
}

// Create a tagged constructor for GetTodos requests
const GetTodos = Request.tagged<GetTodos>("GetTodos")

// Define a request to fetch a User by ID which might
// fail with a GetUserError
interface GetUserById extends Request.Request<User, GetUserError> {
  readonly _tag: "GetUserById"
  readonly id: number
}

// Create a tagged constructor for GetUserById requests
const GetUserById = Request.tagged<GetUserById>("GetUserById")

// Define a request to send an email which might
// fail with a SendEmailError
interface SendEmail extends Request.Request<void, SendEmailError> {
  readonly _tag: "SendEmail"
  readonly address: string
  readonly text: string
}

// Create a tagged constructor for SendEmail requests
const SendEmail = Request.tagged<SendEmail>("SendEmail")

// ------------------------------
// Resolvers
// ------------------------------

// Assuming GetTodos cannot be batched, we create a standard resolver
const GetTodosResolver = RequestResolver.fromEffect(
  (_: GetTodos): Effect.Effect<Todo[], GetTodosError> =>
    Effect.tryPromise({
      try: () =>
        fetch("https://api.example.demo/todos").then(
          (res) => res.json() as Promise<Array<Todo>>
        ),
      catch: () => new GetTodosError()
    })
)

// Assuming GetUserById can be batched, we create a batched resolver
const GetUserByIdResolver = RequestResolver.makeBatched(
  (requests: ReadonlyArray<GetUserById>) =>
    Effect.tryPromise({
      try: () =>
        fetch("https://api.example.demo/getUserByIdBatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            users: requests.map(({ id }) => ({ id }))
          })
        }).then((res) => res.json()) as Promise<Array<User>>,
      catch: () => new GetUserError()
    }).pipe(
      Effect.andThen((users) =>
        Effect.forEach(requests, (request, index) =>
          Request.completeEffect(request, Effect.succeed(users[index]!))
        )
      ),
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
)

// Assuming SendEmail can be batched, we create a batched resolver
const SendEmailResolver = RequestResolver.makeBatched(
  (requests: ReadonlyArray<SendEmail>) =>
    Effect.tryPromise({
      try: () =>
        fetch("https://api.example.demo/sendEmailBatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emails: requests.map(({ address, text }) => ({
              address,
              text
            }))
          })
        }).then((res) => res.json() as Promise<void>),
      catch: () => new SendEmailError()
    }).pipe(
      Effect.andThen(
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.void)
        )
      ),
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
)
```

<Aside type="tip" title="Accessing Context in Resolvers">
  Resolvers can also access the context like any other effect, and there
  are many different ways to create resolvers. For further details,
  consider exploring the reference documentation for the
  [RequestResolver](https://effect-ts.github.io/effect/effect/RequestResolver.ts.html)
  module.
</Aside>

In this configuration:

- **GetTodosResolver** handles the fetching of multiple `Todo` items. It's set up as a standard resolver since we assume it cannot be batched.
- **GetUserByIdResolver** and **SendEmailResolver** are configured as batched resolvers. This setup is based on the assumption that these requests can be processed in batches, enhancing performance and reducing the number of API calls.

### Defining Queries

Now that we've set up our resolvers, we're ready to tie all the pieces together to define our This step will enable us to perform data operations effectively within our application.

```ts twoslash collapse={7-25,31-59,65-136}
import { Effect, Request, RequestResolver, Data } from "effect"

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
// Requests
// ------------------------------

// Define a request to get multiple Todo items which might
// fail with a GetTodosError
interface GetTodos extends Request.Request<Array<Todo>, GetTodosError> {
  readonly _tag: "GetTodos"
}

// Create a tagged constructor for GetTodos requests
const GetTodos = Request.tagged<GetTodos>("GetTodos")

// Define a request to fetch a User by ID which might
// fail with a GetUserError
interface GetUserById extends Request.Request<User, GetUserError> {
  readonly _tag: "GetUserById"
  readonly id: number
}

// Create a tagged constructor for GetUserById requests
const GetUserById = Request.tagged<GetUserById>("GetUserById")

// Define a request to send an email which might
// fail with a SendEmailError
interface SendEmail extends Request.Request<void, SendEmailError> {
  readonly _tag: "SendEmail"
  readonly address: string
  readonly text: string
}

// Create a tagged constructor for SendEmail requests
const SendEmail = Request.tagged<SendEmail>("SendEmail")

// ------------------------------
// Resolvers
// ------------------------------

// Assuming GetTodos cannot be batched, we create a standard resolver
const GetTodosResolver = RequestResolver.fromEffect(
  (_: GetTodos): Effect.Effect<Todo[], GetTodosError> =>
    Effect.tryPromise({
      try: () =>
        fetch("https://api.example.demo/todos").then(
          (res) => res.json() as Promise<Array<Todo>>
        ),
      catch: () => new GetTodosError()
    })
)

// Assuming GetUserById can be batched, we create a batched resolver
const GetUserByIdResolver = RequestResolver.makeBatched(
  (requests: ReadonlyArray<GetUserById>) =>
    Effect.tryPromise({
      try: () =>
        fetch("https://api.example.demo/getUserByIdBatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            users: requests.map(({ id }) => ({ id }))
          })
        }).then((res) => res.json()) as Promise<Array<User>>,
      catch: () => new GetUserError()
    }).pipe(
      Effect.andThen((users) =>
        Effect.forEach(requests, (request, index) =>
          Request.completeEffect(request, Effect.succeed(users[index]!))
        )
      ),
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
)

// Assuming SendEmail can be batched, we create a batched resolver
const SendEmailResolver = RequestResolver.makeBatched(
  (requests: ReadonlyArray<SendEmail>) =>
    Effect.tryPromise({
      try: () =>
        fetch("https://api.example.demo/sendEmailBatch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            emails: requests.map(({ address, text }) => ({
              address,
              text
            }))
          })
        }).then((res) => res.json() as Promise<void>),
      catch: () => new SendEmailError()
    }).pipe(
      Effect.andThen(
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.void)
        )
      ),
      Effect.catchAll((error) =>
        Effect.forEach(requests, (request) =>
          Request.completeEffect(request, Effect.fail(error))
        )
      )
    )
)

// ------------------------------
// Queries
// ------------------------------

// Defines a query to fetch all Todo items
const getTodos: Effect.Effect<
  Array<Todo>,
  GetTodosError
> = Effect.request(GetTodos({}), GetTodosResolver)

// Defines a query to fetch a user by their ID
const getUserById = (id: number) =>
  Effect.request(GetUserById({ id }), GetUserByIdResolver)

// Defines a query to send an email to a specific address
const sendEmail = (address: string, text: string) =>
  Effect.request(SendEmail({ address, text }), SendEmailResolver)

// Composes getUserById and sendEmail to send an email to a specific user
const sendEmailToUser = (id: number, message: string) =>
  getUserById(id).pipe(
    Effect.andThen((user) => sendEmail(user.email, message))
  )

// Uses getUserById to fetch the owner of a Todo and then sends them an email notification
const notifyOwner = (todo: Todo) =>
  getUserById(todo.ownerId).pipe(
    Effect.andThen((user) =>
      sendEmailToUser(user.id, `hey ${user.name} you got a todo!`)
    )
  )
```

By using the `Effect.request` function, we integrate the resolvers with the request model effectively. This approach ensures that each query is optimally resolved using the appropriate resolver.

Although the code structure looks similar to earlier examples, employing resolvers significantly enhances efficiency by optimizing how requests are handled and reducing unnecessary API calls.

```ts {4} showLineNumbers=false
const program = Effect.gen(function* () {
  const todos = yield* getTodos
  yield* Effect.forEach(todos, (todo) => notifyOwner(todo), {
    batching: true
  })
})
```

In the final setup, this program will execute only **3** queries to the APIs, regardless of the number of todos. This contrasts sharply with the traditional approach, which would potentially execute **1 + 2n** queries, where **n** is the number of todos. This represents a significant improvement in efficiency, especially for applications with a high volume of data interactions.

### Disabling Batching

Batching can be locally disabled using the `Effect.withRequestBatching` utility in the following way:

```ts {6} showLineNumbers=false
const program = Effect.gen(function* () {
  const todos = yield* getTodos
  yield* Effect.forEach(todos, (todo) => notifyOwner(todo), {
    concurrency: "unbounded"
  })
}).pipe(Effect.withRequestBatching(false))
```

### Resolvers with Context

In complex applications, resolvers often need access to shared services or configurations to handle requests effectively. However, maintaining the ability to batch requests while providing the necessary context can be challenging. Here, we'll explore how to manage context in resolvers to ensure that batching capabilities are not compromised.

When creating request resolvers, it's crucial to manage the context carefully. Providing too much context or providing varying services to resolvers can make them incompatible for batching. To prevent such issues, the context for the resolver used in `Effect.request` is explicitly set to `never`. This forces developers to clearly define how the context is accessed and used within resolvers.

Consider the following example where we set up an HTTP service that the resolvers can use to execute API calls:

```ts twoslash collapse={7-25,31-59}
import { Effect, Context, RequestResolver, Request, Data } from "effect"

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
// Requests
// ------------------------------

// Define a request to get multiple Todo items which might
// fail with a GetTodosError
interface GetTodos extends Request.Request<Array<Todo>, GetTodosError> {
  readonly _tag: "GetTodos"
}

// Create a tagged constructor for GetTodos requests
const GetTodos = Request.tagged<GetTodos>("GetTodos")

// Define a request to fetch a User by ID which might
// fail with a GetUserError
interface GetUserById extends Request.Request<User, GetUserError> {
  readonly _tag: "GetUserById"
  readonly id: number
}

// Create a tagged constructor for GetUserById requests
const GetUserById = Request.tagged<GetUserById>("GetUserById")

// Define a request to send an email which might
// fail with a SendEmailError
interface SendEmail extends Request.Request<void, SendEmailError> {
  readonly _tag: "SendEmail"
  readonly address: string
  readonly text: string
}

// Create a tagged constructor for SendEmail requests
const SendEmail = Request.tagged<SendEmail>("SendEmail")

// ------------------------------
// Resolvers With Context
// ------------------------------

class HttpService extends Context.Tag("HttpService")<
  HttpService,
  { fetch: typeof fetch }
>() {}

const GetTodosResolver =
  // we create a normal resolver like we did before
  RequestResolver.fromEffect((_: GetTodos) =>
    Effect.andThen(HttpService, (http) =>
      Effect.tryPromise({
        try: () =>
          http
            .fetch("https://api.example.demo/todos")
            .then((res) => res.json() as Promise<Array<Todo>>),
        catch: () => new GetTodosError()
      })
    )
  ).pipe(
    // we list the tags that the resolver can access
    RequestResolver.contextFromServices(HttpService)
  )
```

We can see now that the type of `GetTodosResolver` is no longer a `RequestResolver` but instead it is:

```ts showLineNumbers=false
const GetTodosResolver: Effect<
  RequestResolver<GetTodos, never>,
  never,
  HttpService
>
```

which is an effect that access the `HttpService` and returns a composed resolver that has the minimal context ready to use.

Once we have such effect we can directly use it in our query definition:

```ts showLineNumbers=false
const getTodos: Effect.Effect<Todo[], GetTodosError, HttpService> =
  Effect.request(GetTodos({}), GetTodosResolver)
```

We can see that the Effect correctly requires `HttpService` to be provided.

Alternatively you can create `RequestResolver`s as part of layers direcly accessing or closing over context from construction.

**Example**

```ts twoslash collapse={14-32,38-66,72-92}
import {
  Effect,
  Context,
  RequestResolver,
  Request,
  Layer,
  Data
} from "effect"

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
// Requests
// ------------------------------

// Define a request to get multiple Todo items which might
// fail with a GetTodosError
interface GetTodos extends Request.Request<Array<Todo>, GetTodosError> {
  readonly _tag: "GetTodos"
}

// Create a tagged constructor for GetTodos requests
const GetTodos = Request.tagged<GetTodos>("GetTodos")

// Define a request to fetch a User by ID which might
// fail with a GetUserError
interface GetUserById extends Request.Request<User, GetUserError> {
  readonly _tag: "GetUserById"
  readonly id: number
}

// Create a tagged constructor for GetUserById requests
const GetUserById = Request.tagged<GetUserById>("GetUserById")

// Define a request to send an email which might
// fail with a SendEmailError
interface SendEmail extends Request.Request<void, SendEmailError> {
  readonly _tag: "SendEmail"
  readonly address: string
  readonly text: string
}

// Create a tagged constructor for SendEmail requests
const SendEmail = Request.tagged<SendEmail>("SendEmail")

// ------------------------------
// Resolvers With Context
// ------------------------------

class HttpService extends Context.Tag("HttpService")<
  HttpService,
  { fetch: typeof fetch }
>() {}

const GetTodosResolver =
  // we create a normal resolver like we did before
  RequestResolver.fromEffect((_: GetTodos) =>
    Effect.andThen(HttpService, (http) =>
      Effect.tryPromise({
        try: () =>
          http
            .fetch("https://api.example.demo/todos")
            .then((res) => res.json() as Promise<Array<Todo>>),
        catch: () => new GetTodosError()
      })
    )
  ).pipe(
    // we list the tags that the resolver can access
    RequestResolver.contextFromServices(HttpService)
  )

// ------------------------------
// Layers
// ------------------------------

class TodosService extends Context.Tag("TodosService")<
  TodosService,
  {
    getTodos: Effect.Effect<Array<Todo>, GetTodosError>
  }
>() {}

const TodosServiceLive = Layer.effect(
  TodosService,
  Effect.gen(function* () {
    const http = yield* HttpService
    const resolver = RequestResolver.fromEffect((_: GetTodos) =>
      Effect.tryPromise({
        try: () =>
          http
            .fetch("https://api.example.demo/todos")
            .then<any, Todo[]>((res) => res.json()),
        catch: () => new GetTodosError()
      })
    )
    return {
      getTodos: Effect.request(GetTodos({}), resolver)
    }
  })
)

const getTodos: Effect.Effect<
  Array<Todo>,
  GetTodosError,
  TodosService
> = Effect.andThen(TodosService, (service) => service.getTodos)
```

This way is probably the best for most of the cases given that layers are the natural primitive where to wire services together.
