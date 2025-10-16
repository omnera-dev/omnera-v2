# RPC

The RPC feature allows sharing of the API specifications between the server and the client.

First, export the `typeof` your Hono app (commonly called `AppType`)—or just the routes you want available to the client—from your server code.

By accepting `AppType` as a generic parameter, the Hono Client can infer both the input type(s) specified by the Validator, and the output type(s) emitted by handlers returning `c.json()`.

> [!NOTE]
> At this time, responses returned from middleware are [not inferred by the client.](https://github.com/honojs/hono/issues/2719)

> [!NOTE]
> For the RPC types to work properly in a monorepo, in both the Client's and Server's tsconfig.json files, set `"strict": true` in `compilerOptions`. [Read more.](https://github.com/honojs/hono/issues/2270#issuecomment-2143745118)

## Server

All you need to do on the server side is to write a validator and create a variable `route`. The following example uses [Zod Validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator).

```ts{1}
const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
  (c) => {
    // ...
    return c.json(
      {
        ok: true,
        message: 'Created!',
      },
      201
    )
  }
)
```

Then, export the type to share the API spec with the Client.

```ts
export type AppType = typeof route
```

## Client

On the Client side, import `hc` and `AppType` first.

```ts
import type { AppType } from '.'
import { hc } from 'hono/client'
```

`hc` is a function to create a client. Pass `AppType` as Generics and specify the server URL as an argument.

```ts
const client = hc<AppType>('http://localhost:8787/')
```

Call `client.{path}.{method}` and pass the data you wish to send to the server as an argument.

```ts
const res = await client.posts.$post({
  form: {
    title: 'Hello',
    body: 'Hono is a cool project',
  },
})
```

The `res` is compatible with the "fetch" Response. You can retrieve data from the server with `res.json()`.

```ts
if (res.ok) {
  const data = await res.json()
  console.log(data.message)
}
```

### Cookies

To make the client send cookies with every request, add `{ 'init': { 'credentials": 'include' } }` to the options when you're creating the client.

```ts
// client.ts
const client = hc<AppType>('http://localhost:8787/', {
  init: {
    credentials: 'include',
  },
})

// This request will now include any cookies you might have set
const res = await client.posts.$get({
  query: {
    id: '123',
  },
})
```

## Status code

If you explicitly specify the status code, such as `200` or `404`, in `c.json()`. It will be added as a type for passing to the client.

```ts
// server.ts
const app = new Hono().get(
  '/posts',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('query')
    const post: Post | undefined = await getPost(id)

    if (post === undefined) {
      return c.json({ error: 'not found' }, 404) // Specify 404
    }

    return c.json({ post }, 200) // Specify 200
  }
)

export type AppType = typeof app
```

You can get the data by the status code.

```ts
// client.ts
const client = hc<AppType>('http://localhost:8787/')

const res = await client.posts.$get({
  query: {
    id: '123',
  },
})

if (res.status === 404) {
  const data: { error: string } = await res.json()
  console.log(data.error)
}

if (res.ok) {
  const data: { post: Post } = await res.json()
  console.log(data.post)
}

// { post: Post } | { error: string }
type ResponseType = InferResponseType<typeof client.posts.$get>

// { post: Post }
type ResponseType200 = InferResponseType<
  typeof client.posts.$get,
  200
>
```

## Not Found

If you want to use a client, you should not use `c.notFound()` for the Not Found response. The data that the client gets from the server cannot be inferred correctly.

```ts
// server.ts
export const routes = new Hono().get(
  '/posts',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('query')
    const post: Post | undefined = await getPost(id)

    if (post === undefined) {
      return c.notFound() // ❌️
    }

    return c.json({ post })
  }
)

// client.ts
import { hc } from 'hono/client'

const client = hc<typeof routes>('/')

const res = await client.posts[':id'].$get({
  param: {
    id: '123',
  },
})

const data = await res.json() // 🙁 data is unknown
```

Please use `c.json()` and specify the status code for the Not Found Response.

```ts
export const routes = new Hono().get(
  '/posts',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('query')
    const post: Post | undefined = await getPost(id)

    if (post === undefined) {
      return c.json({ error: 'not found' }, 404) // Specify 404
    }

    return c.json({ post }, 200) // Specify 200
  }
)
```

## Path parameters

You can also handle routes that include path parameters.

```ts
const route = app.get(
  '/posts/:id',
  zValidator(
    'query',
    z.object({
      page: z.string().optional(),
    })
  ),
  (c) => {
    // ...
    return c.json({
      title: 'Night',
      body: 'Time to sleep',
    })
  }
)
```

Specify the string you want to include in the path with `param`.

```ts
const res = await client.posts[':id'].$get({
  param: {
    id: '123',
  },
  query: {},
})
```

### Include slashes

`hc` function does not URL-encode the values of `param`. To include slashes in parameters, use [regular expressions](/docs/api/routing#regexp).

```ts
// client.ts

// Requests /posts/123/456
const res = await client.posts[':id'].$get({
  param: {
    id: '123/456',
  },
})

// server.ts
const route = app.get(
  '/posts/:id{.+}',
  zValidator(
    'param',
    z.object({
      id: z.string(),
    })
  ),
  (c) => {
    // id: 123/456
    const { id } = c.req.valid('param')
    // ...
  }
)
```

> [!NOTE]
> Basic path parameters without regular expressions do not match slashes. If you pass a `param` containing slashes using the hc function, the server might not route as intended. Encoding the parameters using `encodeURIComponent` is the recommended approach to ensure correct routing.

## Headers

You can append the headers to the request.

```ts
const res = await client.search.$get(
  {
    //...
  },
  {
    headers: {
      'X-Custom-Header': 'Here is Hono Client',
      'X-User-Agent': 'hc',
    },
  }
)
```

To add a common header to all requests, specify it as an argument to the `hc` function.

```ts
const client = hc<AppType>('/api', {
  headers: {
    Authorization: 'Bearer TOKEN',
  },
})
```

## `init` option

You can pass the fetch's `RequestInit` object to the request as the `init` option. Below is an example of aborting a Request.

```ts
import { hc } from 'hono/client'

const client = hc<AppType>('http://localhost:8787/')

const abortController = new AbortController()
const res = await client.api.posts.$post(
  {
    json: {
      // Request body
    },
  },
  {
    // RequestInit object
    init: {
      signal: abortController.signal,
    },
  }
)

// ...

abortController.abort()
```

::: info
A `RequestInit` object defined by `init` takes the highest priority. It could be used to overwrite things set by other options like `body | method | headers`.
:::

## `$url()`

You can get a `URL` object for accessing the endpoint by using `$url()`.

::: warning
You have to pass in an absolute URL for this to work. Passing in a relative URL `/` will result in the following error.

`Uncaught TypeError: Failed to construct 'URL': Invalid URL`

```ts
// ❌ Will throw error
const client = hc<AppType>('/')
client.api.post.$url()

// ✅ Will work as expected
const client = hc<AppType>('http://localhost:8787/')
client.api.post.$url()
```

:::

```ts
const route = app
  .get('/api/posts', (c) => c.json({ posts }))
  .get('/api/posts/:id', (c) => c.json({ post }))

const client = hc<typeof route>('http://localhost:8787/')

let url = client.api.posts.$url()
console.log(url.pathname) // `/api/posts`

url = client.api.posts[':id'].$url({
  param: {
    id: '123',
  },
})
console.log(url.pathname) // `/api/posts/123`
```

## File Uploads

You can upload files using a form body:

```ts
// client
const res = await client.user.picture.$put({
  form: {
    file: new File([fileToUpload], filename, {
      type: fileToUpload.type,
    }),
  },
})
```

```ts
// server
const route = app.put(
  '/user/picture',
  zValidator(
    'form',
    z.object({
      file: z.instanceof(File),
    })
  )
  // ...
)
```

## Custom `fetch` method

You can set the custom `fetch` method.

In the following example script for Cloudflare Worker, the Service Bindings' `fetch` method is used instead of the default `fetch`.

```toml