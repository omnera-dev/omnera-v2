## Caching

While we have significantly optimized request batching, there's another area that can enhance our application's efficiency: caching. Without caching, even with optimized batch processing, the same requests could be executed multiple times, leading to unnecessary data fetching.

In the Effect library, caching is handled through built-in utilities that allow requests to be stored temporarily, preventing the need to re-fetch data that hasn't changed. This feature is crucial for reducing the load on both the server and the network, especially in applications that make frequent similar requests.

Here's how you can implement caching for the `getUserById` query:

```ts {3} showLineNumbers=false
const getUserById = (id: number) =>
  Effect.request(GetUserById({ id }), GetUserByIdResolver).pipe(Effect.withRequestCaching(true))
```
