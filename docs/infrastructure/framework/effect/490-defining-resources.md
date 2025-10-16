## Defining Resources

### acquireRelease

The `Effect.acquireRelease(acquire, release)` function allows you to define resources that are acquired and safely released when they are no longer needed. This is useful for managing resources such as file handles, database connections, or network sockets.

To use `Effect.acquireRelease`, you need to define two actions:

1. **Acquiring the Resource**: An effect describing the acquisition of the resource, e.g., opening a file or establishing a database connection.
2. **Releasing the Resource**: The clean-up effect that ensures the resource is properly released, e.g., closing the file or the connection.

The acquisition process is **uninterruptible** to ensure that partial resource acquisition doesn't leave your system in an inconsistent state.

The `Effect.acquireRelease` function guarantees that once a resource is successfully acquired, its release step is always executed when the `Scope` is closed.

**Example** (Defining a Simple Resource)

```ts twoslash
import { Effect } from 'effect'

// Define an interface for a resource
interface MyResource {
  readonly contents: string
  readonly close: () => Promise<void>
}

// Simulate resource acquisition
const getMyResource = (): Promise<MyResource> =>
  Promise.resolve({
    contents: 'lorem ipsum',
    close: () =>
      new Promise((resolve) => {
        console.log('Resource released')
        resolve()
      }),
  })

// Define how the resource is acquired
const acquire = Effect.tryPromise({
  try: () =>
    getMyResource().then((res) => {
      console.log('Resource acquired')
      return res
    }),
  catch: () => new Error('getMyResourceError'),
})

// Define how the resource is released
const release = (res: MyResource) => Effect.promise(() => res.close())

// Create the resource management workflow
//
//      ┌─── Effect<MyResource, Error, Scope>
//      ▼
const resource = Effect.acquireRelease(acquire, release)
```

In the code above, the `Effect.acquireRelease` function creates a resource workflow that requires a `Scope`:

```ts showLineNumbers=false "Scope"
const resource: Effect<MyResource, Error, Scope>
```

This means that the workflow needs a `Scope` to run, and the resource will automatically be released when the scope is closed.

You can now use the resource by chaining operations using `Effect.andThen` or similar functions.

We can continue working with the resource for as long as we want by using `Effect.andThen` or other Effect operators. For example, here's how we can read the contents:

**Example** (Using the Resource)

```ts twoslash collapse={3-34}
import { Effect } from 'effect'

// Define an interface for a resource
interface MyResource {
  readonly contents: string
  readonly close: () => Promise<void>
}

// Simulate resource acquisition
const getMyResource = (): Promise<MyResource> =>
  Promise.resolve({
    contents: 'lorem ipsum',
    close: () =>
      new Promise((resolve) => {
        console.log('Resource released')
        resolve()
      }),
  })

// Define how the resource is acquired
const acquire = Effect.tryPromise({
  try: () =>
    getMyResource().then((res) => {
      console.log('Resource acquired')
      return res
    }),
  catch: () => new Error('getMyResourceError'),
})

// Define how the resource is released
const release = (res: MyResource) => Effect.promise(() => res.close())

// Create the resource management workflow
const resource = Effect.acquireRelease(acquire, release)

//      ┌─── Effect<void, Error, Scope>
//      ▼
const program = Effect.gen(function* () {
  const res = yield* resource
  console.log(`content is ${res.contents}`)
})
```

To ensure proper resource management, the `Scope` should be closed when you're done with the resource. The `Effect.scoped` function handles this for you by creating a `Scope`, running the effect, and then closing the `Scope` when the effect finishes.

**Example** (Providing the `Scope` with `Effect.scoped`)

```ts twoslash collapse={3-34}
import { Effect } from 'effect'

// Define an interface for a resource
interface MyResource {
  readonly contents: string
  readonly close: () => Promise<void>
}

// Simulate resource acquisition
const getMyResource = (): Promise<MyResource> =>
  Promise.resolve({
    contents: 'lorem ipsum',
    close: () =>
      new Promise((resolve) => {
        console.log('Resource released')
        resolve()
      }),
  })

// Define how the resource is acquired
const acquire = Effect.tryPromise({
  try: () =>
    getMyResource().then((res) => {
      console.log('Resource acquired')
      return res
    }),
  catch: () => new Error('getMyResourceError'),
})

// Define how the resource is released
const release = (res: MyResource) => Effect.promise(() => res.close())

// Create the resource management workflow
const resource = Effect.acquireRelease(acquire, release)

//      ┌─── Effect<void, Error, never>
//      ▼
const program = Effect.scoped(
  Effect.gen(function* () {
    const res = yield* resource
    console.log(`content is ${res.contents}`)
  })
)

// We now have a workflow that is ready to run
Effect.runPromise(program)
/*
Resource acquired
content is lorem ipsum
Resource released
*/
```

### Example Pattern: Sequencing Operations

In certain scenarios, you might need to perform a sequence of chained operations where the success of each operation depends on the previous one. However, if any of the operations fail, you would want to reverse the effects of all previous successful operations. This pattern is valuable when you need to ensure that either all operations succeed, or none of them have any effect at all.

Let's go through an example of implementing this pattern. Suppose we want to create a "Workspace" in our application, which involves creating an S3 bucket, an ElasticSearch index, and a Database entry that relies on the previous two.

To begin, we define the domain model for the required [services](/docs/requirements-management/services/):

- `S3`
- `ElasticSearch`
- `Database`

```ts twoslash
import { Effect, Context, Data } from 'effect'

class S3Error extends Data.TaggedError('S3Error')<{}> {}

interface Bucket {
  readonly name: string
}

class S3 extends Context.Tag('S3')<
  S3,
  {
    readonly createBucket: Effect.Effect<Bucket, S3Error>
    readonly deleteBucket: (bucket: Bucket) => Effect.Effect<void>
  }
>() {}

class ElasticSearchError extends Data.TaggedError('ElasticSearchError')<{}> {}

interface Index {
  readonly id: string
}

class ElasticSearch extends Context.Tag('ElasticSearch')<
  ElasticSearch,
  {
    readonly createIndex: Effect.Effect<Index, ElasticSearchError>
    readonly deleteIndex: (index: Index) => Effect.Effect<void>
  }
>() {}

class DatabaseError extends Data.TaggedError('DatabaseError')<{}> {}

interface Entry {
  readonly id: string
}

class Database extends Context.Tag('Database')<
  Database,
  {
    readonly createEntry: (bucket: Bucket, index: Index) => Effect.Effect<Entry, DatabaseError>
    readonly deleteEntry: (entry: Entry) => Effect.Effect<void>
  }
>() {}
```

Next, we define the three create actions and the overall transaction (`make`) for the workspace.

```ts twoslash collapse={3-48}
import { Effect, Context, Exit, Data } from 'effect'

class S3Error extends Data.TaggedError('S3Error')<{}> {}

interface Bucket {
  readonly name: string
}

class S3 extends Context.Tag('S3')<
  S3,
  {
    readonly createBucket: Effect.Effect<Bucket, S3Error>
    readonly deleteBucket: (bucket: Bucket) => Effect.Effect<void>
  }
>() {}

class ElasticSearchError extends Data.TaggedError('ElasticSearchError')<{}> {}

interface Index {
  readonly id: string
}

class ElasticSearch extends Context.Tag('ElasticSearch')<
  ElasticSearch,
  {
    readonly createIndex: Effect.Effect<Index, ElasticSearchError>
    readonly deleteIndex: (index: Index) => Effect.Effect<void>
  }
>() {}

class DatabaseError extends Data.TaggedError('DatabaseError')<{}> {}

interface Entry {
  readonly id: string
}

class Database extends Context.Tag('Database')<
  Database,
  {
    readonly createEntry: (bucket: Bucket, index: Index) => Effect.Effect<Entry, DatabaseError>
    readonly deleteEntry: (entry: Entry) => Effect.Effect<void>
  }
>() {}

// Create a bucket, and define the release function that deletes the
// bucket if the operation fails.
const createBucket = Effect.gen(function* () {
  const { createBucket, deleteBucket } = yield* S3
  return yield* Effect.acquireRelease(createBucket, (bucket, exit) =>
    // The release function for the Effect.acquireRelease operation is
    // responsible for handling the acquired resource (bucket) after the
    // main effect has completed. It is called regardless of whether the
    // main effect succeeded or failed. If the main effect failed,
    // Exit.isFailure(exit) will be true, and the function will perform
    // a rollback by calling deleteBucket(bucket). If the main effect
    // succeeded, Exit.isFailure(exit) will be false, and the function
    // will return Effect.void, representing a successful, but
    // do-nothing effect.
    Exit.isFailure(exit) ? deleteBucket(bucket) : Effect.void
  )
})

// Create an index, and define the release function that deletes the
// index if the operation fails.
const createIndex = Effect.gen(function* () {
  const { createIndex, deleteIndex } = yield* ElasticSearch
  return yield* Effect.acquireRelease(createIndex, (index, exit) =>
    Exit.isFailure(exit) ? deleteIndex(index) : Effect.void
  )
})

// Create an entry in the database, and define the release function that
// deletes the entry if the operation fails.
const createEntry = (bucket: Bucket, index: Index) =>
  Effect.gen(function* () {
    const { createEntry, deleteEntry } = yield* Database
    return yield* Effect.acquireRelease(createEntry(bucket, index), (entry, exit) =>
      Exit.isFailure(exit) ? deleteEntry(entry) : Effect.void
    )
  })

const make = Effect.scoped(
  Effect.gen(function* () {
    const bucket = yield* createBucket
    const index = yield* createIndex
    return yield* createEntry(bucket, index)
  })
)
```

We then create simple service implementations to test the behavior of our Workspace code.
To achieve this, we will utilize [layers](/docs/requirements-management/layers/) to construct test
These layers will be able to handle various scenarios, including errors, which we can control using the `FailureCase` type.

```ts twoslash collapse={3-95}
import { Effect, Context, Exit, Data, Layer, Console } from 'effect'

class S3Error extends Data.TaggedError('S3Error')<{}> {}

interface Bucket {
  readonly name: string
}

class S3 extends Context.Tag('S3')<
  S3,
  {
    readonly createBucket: Effect.Effect<Bucket, S3Error>
    readonly deleteBucket: (bucket: Bucket) => Effect.Effect<void>
  }
>() {}

class ElasticSearchError extends Data.TaggedError('ElasticSearchError')<{}> {}

interface Index {
  readonly id: string
}

class ElasticSearch extends Context.Tag('ElasticSearch')<
  ElasticSearch,
  {
    readonly createIndex: Effect.Effect<Index, ElasticSearchError>
    readonly deleteIndex: (index: Index) => Effect.Effect<void>
  }
>() {}

class DatabaseError extends Data.TaggedError('DatabaseError')<{}> {}

interface Entry {
  readonly id: string
}

class Database extends Context.Tag('Database')<
  Database,
  {
    readonly createEntry: (bucket: Bucket, index: Index) => Effect.Effect<Entry, DatabaseError>
    readonly deleteEntry: (entry: Entry) => Effect.Effect<void>
  }
>() {}

// Create a bucket, and define the release function that deletes the
// bucket if the operation fails.
const createBucket = Effect.gen(function* () {
  const { createBucket, deleteBucket } = yield* S3
  return yield* Effect.acquireRelease(createBucket, (bucket, exit) =>
    // The release function for the Effect.acquireRelease operation is
    // responsible for handling the acquired resource (bucket) after the
    // main effect has completed. It is called regardless of whether the
    // main effect succeeded or failed. If the main effect failed,
    // Exit.isFailure(exit) will be true, and the function will perform
    // a rollback by calling deleteBucket(bucket). If the main effect
    // succeeded, Exit.isFailure(exit) will be false, and the function
    // will return Effect.void, representing a successful, but
    // do-nothing effect.
    Exit.isFailure(exit) ? deleteBucket(bucket) : Effect.void
  )
})

// Create an index, and define the release function that deletes the
// index if the operation fails.
const createIndex = Effect.gen(function* () {
  const { createIndex, deleteIndex } = yield* ElasticSearch
  return yield* Effect.acquireRelease(createIndex, (index, exit) =>
    Exit.isFailure(exit) ? deleteIndex(index) : Effect.void
  )
})

// Create an entry in the database, and define the release function that
// deletes the entry if the operation fails.
const createEntry = (bucket: Bucket, index: Index) =>
  Effect.gen(function* () {
    const { createEntry, deleteEntry } = yield* Database
    return yield* Effect.acquireRelease(createEntry(bucket, index), (entry, exit) =>
      Exit.isFailure(exit) ? deleteEntry(entry) : Effect.void
    )
  })

const make = Effect.scoped(
  Effect.gen(function* () {
    const bucket = yield* createBucket
    const index = yield* createIndex
    return yield* createEntry(bucket, index)
  })
)

// The `FailureCaseLiterals` type allows us to provide different error
// scenarios while testing our
//
// For example, by providing the value "S3", we can simulate an error
// scenario specific to the S3 service. This helps us ensure that our
// program handles errors correctly and behaves as expected in various
// situations.
//
// Similarly, we can provide other values like "ElasticSearch" or
// "Database" to simulate error scenarios for those  In cases
// where we want to test the absence of errors, we can provide
// `undefined`. By using this parameter, we can thoroughly test our
// services and verify their behavior under different error conditions.
type FailureCaseLiterals = 'S3' | 'ElasticSearch' | 'Database' | undefined

class FailureCase extends Context.Tag('FailureCase')<FailureCase, FailureCaseLiterals>() {}

// Create a test layer for the S3 service

const S3Test = Layer.effect(
  S3,
  Effect.gen(function* () {
    const failureCase = yield* FailureCase
    return {
      createBucket: Effect.gen(function* () {
        console.log('[S3] creating bucket')
        if (failureCase === 'S3') {
          return yield* Effect.fail(new S3Error())
        } else {
          return { name: '<bucket.name>' }
        }
      }),
      deleteBucket: (bucket) => Console.log(`[S3] delete bucket ${bucket.name}`),
    }
  })
)

// Create a test layer for the ElasticSearch service

const ElasticSearchTest = Layer.effect(
  ElasticSearch,
  Effect.gen(function* () {
    const failureCase = yield* FailureCase
    return {
      createIndex: Effect.gen(function* () {
        console.log('[ElasticSearch] creating index')
        if (failureCase === 'ElasticSearch') {
          return yield* Effect.fail(new ElasticSearchError())
        } else {
          return { id: '<index.id>' }
        }
      }),
      deleteIndex: (index) => Console.log(`[ElasticSearch] delete index ${index.id}`),
    }
  })
)

// Create a test layer for the Database service

const DatabaseTest = Layer.effect(
  Database,
  Effect.gen(function* () {
    const failureCase = yield* FailureCase
    return {
      createEntry: (bucket, index) =>
        Effect.gen(function* () {
          console.log(
            '[Database] creating entry for bucket' + `${bucket.name} and index ${index.id}`
          )
          if (failureCase === 'Database') {
            return yield* Effect.fail(new DatabaseError())
          } else {
            return { id: '<entry.id>' }
          }
        }),
      deleteEntry: (entry) => Console.log(`[Database] delete entry ${entry.id}`),
    }
  })
)

// Merge all the test layers for S3, ElasticSearch, and Database
// services into a single layer
const layer = Layer.mergeAll(S3Test, ElasticSearchTest, DatabaseTest)

// Create a runnable effect to test the Workspace code. The effect is
// provided with the test layer and a FailureCase service with undefined
// value (no failure case).
const runnable = make.pipe(Effect.provide(layer), Effect.provideService(FailureCase, undefined))

Effect.runPromise(Effect.either(runnable)).then(console.log)
```

Let's examine the test results for the scenario where `FailureCase` is set to `undefined` (happy path):

```ansi showLineNumbers=false
[S3] creating bucket
[ElasticSearch] creating index
[Database] creating entry for bucket <bucket.name> and index <index.id>
{ _id: 'Either', _tag: 'Right', right: { id: '<entry.id>' } }
```

In this case, all operations succeed, and we see a successful result with `right({ id: '<entry.id>' })`.

Now, let's simulate a failure in the `Database`:

```ts showLineNumbers=false
const runnable = make.pipe(Effect.provide(layer), Effect.provideService(FailureCase, 'Database'))
```

The console output will be:

```ansi showLineNumbers=false
[S3] creating bucket
[ElasticSearch] creating index
[Database] creating entry for bucket <bucket.name> and index <index.id>
[ElasticSearch] delete index <index.id>
[S3] delete bucket <bucket.name>
{ _id: 'Either', _tag: 'Left', left: { _tag: 'DatabaseError' } }
```

You can observe that once the `Database` error occurs, there is a complete rollback that deletes the `ElasticSearch` index first and then the associated `S3` bucket. The result is a failure with `left(new DatabaseError())`.

Let's now make the index creation fail instead:

```ts showLineNumbers=false
const runnable = make.pipe(
  Effect.provide(layer),
  Effect.provideService(FailureCase, 'ElasticSearch')
)
```

In this case, the console output will be:

```ansi showLineNumbers=false
[S3] creating bucket
[ElasticSearch] creating index
[S3] delete bucket <bucket.name>
{ _id: 'Either', _tag: 'Left', left: { _tag: 'ElasticSearchError' } }
```

As expected, once the `ElasticSearch` index creation fails, there is a rollback that deletes the `S3` bucket. The result is a failure with `left(new ElasticSearchError())`.

# [Built-In Schedules](https://effect.website/docs/scheduling/built-in-schedules/)
