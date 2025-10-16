## Synchronous API

### ok

**Example** (Creating a success result)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ok } from "neverthrow"

const result = ok({ myData: "test" })

result.isOk() // true
result.isErr() // false
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

const result = Either.right({ myData: "test" })

Either.isRight(result) // true
Either.isLeft(result) // false
```

</TabItem>

</Tabs>

### err

**Example** (Creating a failure result)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { err } from "neverthrow"

const result = err("Oh no")

result.isOk() // false
result.isErr() // true
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

const result = Either.left("Oh no")

Either.isRight(result) // false
Either.isLeft(result) // true
```

</TabItem>

</Tabs>

### map

**Example** (Transforming the success value)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result } from "neverthrow"

declare function getLines(s: string): Result<Array<string>, Error>

const result = getLines("1\n2\n3\n4\n")

// this Result now has a Array<number> inside it
const newResult = result.map((arr) => arr.map(parseInt))

newResult.isOk() // true
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

declare function getLines(s: string): Either.Either<Array<string>, Error>

const result = getLines("1\n2\n3\n4\n")

// this Either now has a Array<number> inside it
const newResult = result.pipe(Either.map((arr) => arr.map(parseInt)))

Either.isRight(newResult) // true
```

</TabItem>

</Tabs>

### mapErr

**Example** (Transforming the error value)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result } from "neverthrow"

declare function parseHeaders(
  raw: string
): Result<Record<string, string>, string>

const rawHeaders = "nonsensical gibberish and badly formatted stuff"

const result = parseHeaders(rawHeaders)

// const newResult: Result<Record<string, string>, Error>
const newResult = result.mapErr((err) => new Error(err))
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

declare function parseHeaders(
  raw: string
): Either.Either<Record<string, string>, string>

const rawHeaders = "nonsensical gibberish and badly formatted stuff"

const result = parseHeaders(rawHeaders)

// const newResult: Either<Record<string, string>, Error>
const newResult = result.pipe(Either.mapLeft((err) => new Error(err)))
```

</TabItem>

</Tabs>

### unwrapOr

**Example** (Providing a default value)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { err } from "neverthrow"

const result = err("Oh no")

const multiply = (value: number): number => value * 2

const unwrapped = result.map(multiply).unwrapOr(10)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

const result = Either.left("Oh no")

const multiply = (value: number): number => value * 2

const unwrapped = result.pipe(
  Either.map(multiply),
  Either.getOrElse(() => 10)
)
```

</TabItem>

</Tabs>

### andThen

**Example** (Chaining computations that may fail)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ok, Result, err } from "neverthrow"

const sqrt = (n: number): Result<number, string> =>
  n > 0 ? ok(Math.sqrt(n)) : err("n must be positive")

ok(16).andThen(sqrt).andThen(sqrt)
// Ok(2)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

const sqrt = (n: number): Either.Either<number, string> =>
  n > 0 ? Either.right(Math.sqrt(n)) : Either.left("n must be positive")

Either.right(16).pipe(Either.andThen(sqrt), Either.andThen(sqrt))
// Right(2)
```

</TabItem>

</Tabs>

### asyncAndThen

**Example** (Chaining asynchronous computations that may fail)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ok, okAsync } from "neverthrow"

// const result: ResultAsync<number, never>
const result = ok(1).asyncAndThen((n) => okAsync(n + 1))
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"
import * as Effect from "effect/Effect"

// const result: Effect<number, never, never>
const result = Either.right(1).pipe(
  Effect.andThen((n) => Effect.succeed(n + 1))
)
```

</TabItem>

</Tabs>

### orElse

**Example** (Providing an alternative on failure)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result, err, ok } from "neverthrow"

enum DatabaseError {
  PoolExhausted = "PoolExhausted",
  NotFound = "NotFound"
}

const dbQueryResult: Result<string, DatabaseError> = err(
  DatabaseError.NotFound
)

const updatedQueryResult = dbQueryResult.orElse((dbError) =>
  dbError === DatabaseError.NotFound
    ? ok("User does not exist")
    : err(500)
)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

enum DatabaseError {
  PoolExhausted = "PoolExhausted",
  NotFound = "NotFound"
}

const dbQueryResult: Either.Either<string, DatabaseError> = Either.left(
  DatabaseError.NotFound
)

const updatedQueryResult = dbQueryResult.pipe(
  Either.orElse((dbError) =>
    dbError === DatabaseError.NotFound
      ? Either.right("User does not exist")
      : Either.left(500)
  )
)
```

</TabItem>

</Tabs>

### match

**Example** (Pattern matching on success or failure)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result } from "neverthrow"

declare const myResult: Result<number, string>

myResult.match(
  (value) => `The value is ${value}`,
  (error) => `The error is ${error}`
)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

declare const myResult: Either.Either<number, string>

myResult.pipe(
  Either.match({
    onLeft: (error) => `The error is ${error}`,
    onRight: (value) => `The value is ${value}`
  })
)
```

</TabItem>

</Tabs>

### asyncMap

**Example** (Parsing headers and looking up a user)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result } from "neverthrow"

interface User {}
declare function parseHeaders(
  raw: string
): Result<Record<string, string>, string>
declare function findUserInDatabase(
  authorization: string
): Promise<User | undefined>

const rawHeader = "Authorization: Bearer 1234567890"

// const asyncResult: ResultAsync<User | undefined, string>
const asyncResult = parseHeaders(rawHeader)
  .map((kvMap) => kvMap["Authorization"])
  .asyncMap((authorization) =>
    authorization === undefined
      ? Promise.resolve(undefined)
      : findUserInDatabase(authorization)
  )
```

</TabItem>

<TabItem label="Effect">

```ts twoslash "UnknownException"
import * as Either from "effect/Either"
import * as Effect from "effect/Effect"

interface User {}
declare function parseHeaders(
  raw: string
): Either.Either<Record<string, string>, string>
declare function findUserInDatabase(
  authorization: string
): Promise<User | undefined>

const rawHeader = "Authorization: Bearer 1234567890"

// const asyncResult: Effect<User | undefined, string | UnknownException>
const asyncResult = parseHeaders(rawHeader).pipe(
  Either.map((kvMap) => kvMap["Authorization"]),
  Effect.andThen((authorization) =>
    authorization === undefined
      ? Promise.resolve(undefined)
      : findUserInDatabase(authorization)
  )
)
```

**Note**. In neverthrow, `asyncMap` works with Promises directly.
In Effect, passing a Promise to combinators like `Effect.andThen` automatically lifts it into an `Effect`.
If the Promise rejects, the rejection is turned into an `UnknownException`, which is why the error type is widened to `string | UnknownException`.

</TabItem>

</Tabs>

### combine

**Example** (Combining multiple results)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result, ok } from "neverthrow"

const results: Result<number, string>[] = [ok(1), ok(2)]

// const combined: Result<number[], string>
const combined = Result.combine(results)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"

const results: Either.Either<number, string>[] = [
  Either.right(1),
  Either.right(2)
]

// const combined: Either<number[], string>
const combined = Either.all(results)
```

</TabItem>

</Tabs>

### combineWithAllErrors

**Example** (Collecting all errors and successes)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result, ok, err } from "neverthrow"

const results: Result<number, string>[] = [
  ok(123),
  err("boooom!"),
  ok(456),
  err("ahhhhh!")
]

const result = Result.combineWithAllErrors(results)
// result is Err(['boooom!', 'ahhhhh!'])
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from "effect/Either"
import * as Array from "effect/Array"

const results: Either.Either<number, string>[] = [
  Either.right(123),
  Either.left("boooom!"),
  Either.right(456),
  Either.left("ahhhhh!")
]

const errors = Array.getLefts(results)
// errors is ['boooom!', 'ahhhhh!']

const successes = Array.getRights(results)
// successes is [123, 456]
```

</TabItem>

</Tabs>

**Note**. There is no exact equivalent of `Result.combineWithAllErrors` in Effect.
Use `Array.getLefts` to collect all errors and `Array.getRights` to collect all successes.
