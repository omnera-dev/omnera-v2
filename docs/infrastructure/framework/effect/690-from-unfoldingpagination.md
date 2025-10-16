## From Unfolding/Pagination

In functional programming, the concept of `unfold` can be thought of as the counterpart to `fold`.

With `fold`, we process a data structure and produce a return value. For example, we can take an `Array<number>` and calculate the sum of its elements.

On the other hand, `unfold` represents an operation where we start with an initial value and generate a recursive data structure, adding one element at a time using a specified state function. For example, we can create a sequence of natural numbers starting from `1` and using the `increment` function as the state function.

### Unfold

#### unfold

The Stream module includes an `unfold` function defined as follows:

```ts showLineNumbers=false
declare const unfold: <S, A>(
  initialState: S,
  step: (s: S) => Option.Option<readonly [A, S]>
) => Stream<A>
```

Here's how it works:

- **initialState**. This is the initial state value.
- **step**. The state function `step` takes the current state `s` as input. If the result of this function is `None`, the stream ends. If it's `Some<[A, S]>`, the next element in the stream is `A`, and the state `S` is updated for the next step process.

For example, let's create a stream of natural numbers using `Stream.unfold`:

```ts twoslash
import { Stream, Effect, Option } from "effect"

const stream = Stream.unfold(1, (n) => Option.some([n, n + 1]))

Effect.runPromise(Stream.runCollect(stream.pipe(Stream.take(5)))).then(
  console.log
)
// { _id: 'Chunk', values: [ 1, 2, 3, 4, 5 ] }
```

#### unfoldEffect

Sometimes, we may need to perform effectful state transformations during the unfolding operation. This is where `Stream.unfoldEffect` comes in handy. It allows us to work with effects while generating streams.

Here's an example of creating an infinite stream of random `1` and `-1` values using `Stream.unfoldEffect`:

```ts twoslash
import { Stream, Effect, Option, Random } from "effect"

const stream = Stream.unfoldEffect(1, (n) =>
  Random.nextBoolean.pipe(
    Effect.map((b) => (b ? Option.some([n, -n]) : Option.some([n, n])))
  )
)

Effect.runPromise(Stream.runCollect(stream.pipe(Stream.take(5)))).then(
  console.log
)
// Example Output: { _id: 'Chunk', values: [ 1, 1, 1, 1, -1 ] }
```

#### Additional Variants

There are also similar operations like `Stream.unfoldChunk` and `Stream.unfoldChunkEffect` tailored for working with `Chunk` data types.

### Pagination

#### paginate

`Stream.paginate` is similar to `Stream.unfold` but allows emitting values one step further.

For example, the following stream emits `0, 1, 2, 3` elements:

```ts twoslash
import { Stream, Effect, Option } from "effect"

const stream = Stream.paginate(0, (n) => [
  n,
  n < 3 ? Option.some(n + 1) : Option.none()
])

Effect.runPromise(Stream.runCollect(stream)).then(console.log)
// { _id: 'Chunk', values: [ 0, 1, 2, 3 ] }
```

Here's how it works:

- We start with an initial value of `0`.
- The provided function takes the current value `n` and returns a tuple. The first element of the tuple is the value to emit (`n`), and the second element determines whether to continue (`Option.some(n + 1)`) or stop (`Option.none()`).

#### Additional Variants

There are also similar operations like `Stream.paginateChunk` and `Stream.paginateChunkEffect` tailored for working with `Chunk` data types.

### Unfolding vs. Pagination

You might wonder about the difference between the `unfold` and `paginate` combinators and when to use one over the other. Let's explore this by diving into an example.

Imagine we have a paginated API that provides a substantial amount of data in a paginated manner. When we make a request to this API, it returns a `ResultPage` object containing the results for the current page and a flag indicating whether it's the last page or if there's more data to retrieve on the next page. Here's a simplified representation of our API:

```ts twoslash
import { Chunk, Effect } from "effect"

type RawData = string

class PageResult {
  constructor(
    readonly results: Chunk.Chunk<RawData>,
    readonly isLast: boolean
  ) {}
}

const pageSize = 2

const listPaginated = (
  pageNumber: number
): Effect.Effect<PageResult, Error> => {
  return Effect.succeed(
    new PageResult(
      Chunk.map(
        Chunk.range(1, pageSize),
        (index) => `Result ${pageNumber}-${index}`
      ),
      pageNumber === 2 // Return 3 pages
    )
  )
}
```

Our goal is to convert this paginated API into a stream of `RowData` events. For our initial attempt, we might think that using the `Stream.unfold` operation is the way to go:

```ts twoslash collapse={3-26}
import { Chunk, Effect, Stream, Option } from "effect"

type RawData = string

class PageResult {
  constructor(
    readonly results: Chunk.Chunk<RawData>,
    readonly isLast: boolean
  ) {}
}

const pageSize = 2

const listPaginated = (
  pageNumber: number
): Effect.Effect<PageResult, Error> => {
  return Effect.succeed(
    new PageResult(
      Chunk.map(
        Chunk.range(1, pageSize),
        (index) => `Result ${pageNumber}-${index}`
      ),
      pageNumber === 2 // Return 3 pages
    )
  )
}

const firstAttempt = Stream.unfoldChunkEffect(0, (pageNumber) =>
  listPaginated(pageNumber).pipe(
    Effect.map((page) => {
      if (page.isLast) {
        return Option.none()
      }
      return Option.some([page.results, pageNumber + 1] as const)
    })
  )
)

Effect.runPromise(Stream.runCollect(firstAttempt)).then(console.log)
/*
Output:
{
  _id: "Chunk",
  values: [ "Result 0-1", "Result 0-2", "Result 1-1", "Result 1-2" ]
}
*/
```

However, this approach has a drawback, it doesn't include the results from the last page. To work around this, we perform an extra API call to include those missing results:

```ts twoslash collapse={3-26}
import { Chunk, Effect, Stream, Option } from "effect"

type RawData = string

class PageResult {
  constructor(
    readonly results: Chunk.Chunk<RawData>,
    readonly isLast: boolean
  ) {}
}

const pageSize = 2

const listPaginated = (
  pageNumber: number
): Effect.Effect<PageResult, Error> => {
  return Effect.succeed(
    new PageResult(
      Chunk.map(
        Chunk.range(1, pageSize),
        (index) => `Result ${pageNumber}-${index}`
      ),
      pageNumber === 2 // Return 3 pages
    )
  )
}

const secondAttempt = Stream.unfoldChunkEffect(
  Option.some(0),
  (pageNumber) =>
    Option.match(pageNumber, {
      // We already hit the last page
      onNone: () => Effect.succeed(Option.none()),
      // We did not hit the last page yet
      onSome: (pageNumber) =>
        listPaginated(pageNumber).pipe(
          Effect.map((page) =>
            Option.some([
              page.results,
              page.isLast ? Option.none() : Option.some(pageNumber + 1)
            ])
          )
        )
    })
)

Effect.runPromise(Stream.runCollect(secondAttempt)).then(console.log)
/*
Output:
{
  _id: 'Chunk',
  values: [
    'Result 0-1',
    'Result 0-2',
    'Result 1-1',
    'Result 1-2',
    'Result 2-1',
    'Result 2-2'
  ]
}
*/
```

While this approach works, it's clear that `Stream.unfold` isn't the most friendly option for retrieving data from paginated APIs. It requires additional workarounds to include the results from the last page.

This is where `Stream.paginate` comes to the rescue. It provides a more ergonomic way to convert a paginated API into an Effect stream. Let's rewrite our solution using `Stream.paginate`:

```ts twoslash collapse={3-26}
import { Chunk, Effect, Stream, Option } from "effect"

type RawData = string

class PageResult {
  constructor(
    readonly results: Chunk.Chunk<RawData>,
    readonly isLast: boolean
  ) {}
}

const pageSize = 2

const listPaginated = (
  pageNumber: number
): Effect.Effect<PageResult, Error> => {
  return Effect.succeed(
    new PageResult(
      Chunk.map(
        Chunk.range(1, pageSize),
        (index) => `Result ${pageNumber}-${index}`
      ),
      pageNumber === 2 // Return 3 pages
    )
  )
}

const finalAttempt = Stream.paginateChunkEffect(0, (pageNumber) =>
  listPaginated(pageNumber).pipe(
    Effect.andThen((page) => {
      return [
        page.results,
        page.isLast ? Option.none<number>() : Option.some(pageNumber + 1)
      ]
    })
  )
)

Effect.runPromise(Stream.runCollect(finalAttempt)).then(console.log)
/*
Output:
{
  _id: 'Chunk',
  values: [
    'Result 0-1',
    'Result 0-2',
    'Result 1-1',
    'Result 1-2',
    'Result 2-1',
    'Result 2-2'
  ]
}
*/
```
