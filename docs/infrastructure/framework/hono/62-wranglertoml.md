# wrangler.toml

services = [
{ binding = "AUTH", service = "auth-service" },
]

````

```ts
// src/client.ts
const client = hc<CreateProfileType>('http://localhost', {
  fetch: c.env.AUTH.fetch.bind(c.env.AUTH),
})
````

## Infer

Use `InferRequestType` and `InferResponseType` to know the type of object to be requested and the type of object to be returned.

```ts
import type { InferRequestType, InferResponseType } from 'hono/client'

// InferRequestType
const $post = client.todo.$post
type ReqType = InferRequestType<typeof $post>['form']

// InferResponseType
type ResType = InferResponseType<typeof $post>
```

## Parsing a Response with type-safety helper

You can use `parseResponse()` helper to easily parse a Response from `hc` with type-safety.

```ts
import { parseResponse, DetailedError } from 'hono/client'

// result contains the parsed response body (automatically parsed based on Content-Type)
const result = await parseResponse(client.hello.$get()).catch((e: DetailedError) => {
  console.error(e)
})
// parseResponse automatically throws an error if response is not ok
```

## Using SWR

You can also use a React Hook library such as [SWR](https://swr.vercel.app).

```tsx
import useSWR from 'swr'
import { hc } from 'hono/client'
import type { InferRequestType } from 'hono/client'
import type { AppType } from '../functions/api/[[route]]'

const App = () => {
  const client = hc<AppType>('/api')
  const $get = client.hello.$get

  const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
    const res = await $get(arg)
    return await res.json()
  }

  const { data, error, isLoading } = useSWR(
    'api-hello',
    fetcher({
      query: {
        name: 'SWR',
      },
    })
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return <h1>{data?.message}</h1>
}

export default App
```

## Using RPC with larger applications

In the case of a larger application, such as the example mentioned in [Building a larger application](/docs/guides/best-practices#building-a-larger-application), you need to be careful about the type of inference.
A simple way to do this is to chain the handlers so that the types are always inferred.

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list authors'))
  .post('/', (c) => c.json('create an author', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list books'))
  .post('/', (c) => c.json('create a book', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

You can then import the sub-routers as you usually would, and make sure you chain their handlers as well, since this is the top level of the app in this case, this is the type we'll want to export.

```ts
// index.ts
import { Hono } from 'hono'
import authors from './authors'
import books from './books'

const app = new Hono()

const routes = app.route('/authors', authors).route('/books', books)

export default app
export type AppType = typeof routes
```

You can now create a new client using the registered AppType and use it as you would normally.

## Known issues

### IDE performance

When using RPC, the more routes you have, the slower your IDE will become. One of the main reasons for this is that massive amounts of type instantiations are executed to infer the type of your app.

For example, suppose your app has a route like this:

```ts
// app.ts
export const app = new Hono().get('foo/:id', (c) => c.json({ ok: true }, 200))
```

Hono will infer the type as follows:

```ts
export const app = Hono<BlankEnv, BlankSchema, '/'>().get<
  'foo/:id',
  'foo/:id',
  JSONRespondReturn<{ ok: boolean }, 200>,
  BlankInput,
  BlankEnv
>('foo/:id', (c) => c.json({ ok: true }, 200))
```

This is a type instantiation for a single route. While the user doesn't need to write these type arguments manually, which is a good thing, it's known that type instantiation takes much time. `tsserver` used in your IDE does this time consuming task every time you use the app. If you have a lot of routes, this can slow down your IDE significantly.

However, we have some tips to mitigate this issue.

#### Hono version mismatch

If your backend is separate from the frontend and lives in a different directory, you need to ensure that the Hono versions match. If you use one Hono version on the backend and another on the frontend, you'll run into issues such as "_Type instantiation is excessively deep and possibly infinite_".

![](https://github.com/user-attachments/assets/e4393c80-29dd-408d-93ab-d55c11ccca05)

#### TypeScript project references

Like in the case of [Hono version mismatch](#hono-version-mismatch), you'll run into issues if your backend and frontend are separate. If you want to access code from the backend (`AppType`, for example) on the frontend, you need to use [project references](https://www.typescriptlang.org/docs/handbook/project-references.html). TypeScript's project references allow one TypeScript codebase to access and use code from another TypeScript codebase. _(source: [Hono RPC And TypeScript Project References](https://catalins.tech/hono-rpc-in-monorepos/))_.

#### Compile your code before using it (recommended)

`tsc` can do heavy tasks like type instantiation at compile time! Then, `tsserver` doesn't need to instantiate all the type arguments every time you use it. It will make your IDE a lot faster!

Compiling your client including the server app gives you the best performance. Put the following code in your project:

```ts
import { app } from './app'
import { hc } from 'hono/client'

// this is a trick to calculate the type when compiling
export type Client = ReturnType<typeof hc<typeof app>>

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<typeof app>(...args)
```

After compiling, you can use `hcWithType` instead of `hc` to get the client with the type already calculated.

```ts
const client = hcWithType('http://localhost:8787/')
const res = await client.posts.$post({
  form: {
    title: 'Hello',
    body: 'Hono is a cool project',
  },
})
```

If your project is a monorepo, this solution does fit well. Using a tool like [`turborepo`](https://turbo.build/repo/docs), you can easily separate the server project and the client project and get better integration managing dependencies between them. Here is [a working example](https://github.com/m-shaka/hono-rpc-perf-tips-example).

You can also coordinate your build process manually with tools like `concurrently` or `npm-run-all`.

#### Specify type arguments manually

This is a bit cumbersome, but you can specify type arguments manually to avoid type instantiation.

```ts
const app = new Hono().get<'foo/:id'>('foo/:id', (c) => c.json({ ok: true }, 200))
```

Specifying just single type argument make a difference in performance, while it may take you a lot of time and effort if you have a lot of routes.

#### Split your app and client into multiple files

As described in [Using RPC with larger applications](#using-rpc-with-larger-applications), you can split your app into multiple apps. You can also create a client for each app:

```ts
// authors-cli.ts
import { app as authorsApp } from './authors'
import { hc } from 'hono/client'

const authorsClient = hc<typeof authorsApp>('/authors')

// books-cli.ts
import { app as booksApp } from './books'
import { hc } from 'hono/client'

const booksClient = hc<typeof booksApp>('/books')
```

This way, `tsserver` doesn't need to instantiate types for all routes at once.
