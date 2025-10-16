## Creating a Cache

A cache is defined by a lookup function that computes the value for a given key if it's not already cached:

```ts showLineNumbers=false
type Lookup<Key, Value, Error, Requirements> = (key: Key) => Effect<Value, Error, Requirements>
```

The lookup function takes a `Key` and returns an `Effect`, which describes how to compute the value (`Value`). This `Effect` may require an environment (`Requirements`), can fail with an `Error`, and succeed with a `Value`. Since it returns an `Effect`, it can handle both synchronous and asynchronous workflows.

You create a cache by providing a lookup function along with a maximum size and a time-to-live (TTL) for cached values.

```ts showLineNumbers=false
declare const make: <Key, Value, Error, Requirements>(options: {
  readonly capacity: number
  readonly timeToLive: Duration.DurationInput
  readonly lookup: Lookup<Key, Value, Error, Requirements>
}) => Effect<Cache<Key, Value, Error>, never, Requirements>
```

Once a cache is created, the most idiomatic way to work with it is the `get` method.
The `get` method returns the current value in the cache if it exists, or computes a new value, puts it in the cache, and returns it.

If multiple concurrent processes request the same value, it will only be computed once. All other processes will receive the computed value as soon as it is available. This is managed using Effect's fiber-based concurrency model without blocking the underlying thread.

**Example** (Concurrent Cache Lookups)

In this example, we call `timeConsumingEffect` three times concurrently with the same key.
The cache runs this effect only once, so concurrent lookups will wait until the value is available:

```ts twoslash
import { Effect, Cache, Duration } from 'effect'

// Simulating an expensive lookup with a delay
const expensiveLookup = (key: string) => Effect.sleep('2 seconds').pipe(Effect.as(key.length))

const program = Effect.gen(function* () {
  // Create a cache with a capacity of 100 and an infinite TTL
  const cache = yield* Cache.make({
    capacity: 100,
    timeToLive: Duration.infinity,
    lookup: expensiveLookup,
  })

  // Perform concurrent lookups using the same key
  const result = yield* Effect.all([cache.get('key1'), cache.get('key1'), cache.get('key1')], {
    concurrency: 'unbounded',
  })
  console.log('Result of parallel execution of three effects' + `with the same key: ${result}`)

  // Fetch and display cache stats
  const hits = yield* cache.cacheStats.pipe(Effect.map((stats) => stats.hits))
  console.log(`Number of cache hits: ${hits}`)
  const misses = yield* cache.cacheStats.pipe(Effect.map((stats) => stats.misses))
  console.log(`Number of cache misses: ${misses}`)
})

Effect.runPromise(program)
/*
Output:
Result of parallel execution of three effects with the same key: 4,4,4
Number of cache hits: 2
Number of cache misses: 1
*/
```
