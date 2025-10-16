## Customizing Request Caching

In real-world applications, effective caching strategies can significantly improve performance by reducing redundant data fetching. The Effect library provides flexible caching mechanisms that can be tailored for specific parts of your application or applied globally.

There may be scenarios where different parts of your application have unique caching requirements—some might benefit from a localized cache, while others might need a global cache setup. Let’s explore how you can configure a custom cache to meet these varied needs.

### Creating a Custom Cache

Here's how you can create a custom cache and apply it to part of your application. This example demonstrates setting up a cache that repeats a task every 10 seconds, caching requests with specific parameters like capacity and TTL (time-to-live).

```ts showLineNumbers=false
const program = Effect.gen(function* () {
  const todos = yield* getTodos
  yield* Effect.forEach(todos, (todo) => notifyOwner(todo), {
    concurrency: 'unbounded',
  })
}).pipe(
  Effect.repeat(Schedule.fixed('10 seconds')),
  Effect.provide(
    Layer.setRequestCache(Request.makeCache({ capacity: 256, timeToLive: '60 minutes' }))
  )
)
```

### Direct Cache Application

You can also construct a cache using `Request.makeCache` and apply it directly to a specific program using `Effect.withRequestCache`. This method ensures that all requests originating from the specified program are managed through the custom cache, provided that caching is enabled.

# [Configuration](https://effect.website/docs/configuration/)
