## Asynchronous API

In the examples below we use `Effect.runPromise` to run an effect and return a `Promise`.
You can also use other APIs such as `Effect.runPromiseExit`, which can capture additional cases like defects (runtime errors) and interruptions.

### okAsync

**Example** (Creating a successful async result)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { okAsync } from 'neverthrow'

const myResultAsync = okAsync({ myData: 'test' })

const result = await myResultAsync

result.isOk() // true
result.isErr() // false
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from 'effect/Either'
import * as Effect from 'effect/Effect'

const myResultAsync = Effect.succeed({ myData: 'test' })

const result = await Effect.runPromise(Effect.either(myResultAsync))

Either.isRight(result) // true
Either.isLeft(result) // false
```

</TabItem>

</Tabs>

### errAsync

**Example** (Creating a failed async result)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { errAsync } from 'neverthrow'

const myResultAsync = errAsync('Oh no')

const myResult = await myResultAsync

myResult.isOk() // false
myResult.isErr() // true
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from 'effect/Either'
import * as Effect from 'effect/Effect'

const myResultAsync = Effect.fail('Oh no')

const result = await Effect.runPromise(Effect.either(myResultAsync))

Either.isRight(result) // false
Either.isLeft(result) // true
```

</TabItem>

</Tabs>

### fromThrowable

**Example** (Wrapping a Promise-returning function that may throw)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ResultAsync } from 'neverthrow'

interface User {}
declare function insertIntoDb(user: User): Promise<User>

// (user: User) => ResultAsync<User, Error>
const insertUser = ResultAsync.fromThrowable(insertIntoDb, () => new Error('Database error'))
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'

interface User {}
declare function insertIntoDb(user: User): Promise<User>

// (user: User) => Effect<User, Error>
const insertUser = (user: User) =>
  Effect.tryPromise({
    try: () => insertIntoDb(user),
    catch: () => new Error('Database error'),
  })
```

</TabItem>

</Tabs>

### map

**Example** (Transforming the success value)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result, ResultAsync } from 'neverthrow'

interface User {
  readonly name: string
}
declare function findUsersIn(country: string): ResultAsync<Array<User>, Error>

const usersInCanada = findUsersIn('Canada')

const namesInCanada = usersInCanada.map((users: Array<User>) => users.map((user) => user.name))

// We can extract the Result using .then() or await
namesInCanada.then((namesResult: Result<Array<string>, Error>) => {
  if (namesResult.isErr()) {
    console.log("Couldn't get the users from the database", namesResult.error)
  } else {
    console.log('Users in Canada are named: ' + namesResult.value.join(','))
  }
})
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'
import * as Either from 'effect/Either'

interface User {
  readonly name: string
}
declare function findUsersIn(country: string): Effect.Effect<Array<User>, Error>

const usersInCanada = findUsersIn('Canada')

const namesInCanada = usersInCanada.pipe(
  Effect.map((users: Array<User>) => users.map((user) => user.name))
)

// We can extract the Either using Effect.either
Effect.runPromise(Effect.either(namesInCanada)).then(
  (namesResult: Either.Either<Array<string>, Error>) => {
    if (Either.isLeft(namesResult)) {
      console.log("Couldn't get the users from the database", namesResult.left)
    } else {
      console.log('Users in Canada are named: ' + namesResult.right.join(','))
    }
  }
)
```

</TabItem>

</Tabs>

### mapErr

**Example** (Transforming the error value)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result, ResultAsync } from 'neverthrow'

interface User {
  readonly name: string
}
declare function findUsersIn(country: string): ResultAsync<Array<User>, Error>

const usersInCanada = findUsersIn('Canada').mapErr((error: Error) => {
  // The only error we want to pass to the user is "Unknown country"
  if (error.message === 'Unknown country') {
    return error.message
  }
  // All other errors will be labelled as a system error
  return 'System error, please contact an administrator.'
})

usersInCanada.then((usersResult: Result<Array<User>, string>) => {
  if (usersResult.isErr()) {
    console.log("Couldn't get the users from the database", usersResult.error)
  } else {
    console.log('Users in Canada are: ' + usersResult.value.join(','))
  }
})
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'
import * as Either from 'effect/Either'

interface User {
  readonly name: string
}
declare function findUsersIn(country: string): Effect.Effect<Array<User>, Error>

const usersInCanada = findUsersIn('Canada').pipe(
  Effect.mapError((error: Error) => {
    // The only error we want to pass to the user is "Unknown country"
    if (error.message === 'Unknown country') {
      return error.message
    }
    // All other errors will be labelled as a system error
    return 'System error, please contact an administrator.'
  })
)

Effect.runPromise(Effect.either(usersInCanada)).then(
  (usersResult: Either.Either<Array<User>, string>) => {
    if (Either.isLeft(usersResult)) {
      console.log("Couldn't get the users from the database", usersResult.left)
    } else {
      console.log('Users in Canada are: ' + usersResult.right.join(','))
    }
  }
)
```

</TabItem>

</Tabs>

### unwrapOr

**Example** (Providing a default value when async fails)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { errAsync } from 'neverthrow'

const unwrapped = await errAsync(0).unwrapOr(10)
// unwrapped = 10
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'

const unwrapped = await Effect.runPromise(Effect.fail(0).pipe(Effect.orElseSucceed(() => 10)))
// unwrapped = 10
```

</TabItem>

</Tabs>

### andThen

**Example** (Chaining multiple async computations)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result, ResultAsync } from 'neverthrow'

interface User {}
declare function validateUser(user: User): ResultAsync<User, Error>
declare function insertUser(user: User): ResultAsync<User, Error>
declare function sendNotification(user: User): ResultAsync<void, Error>

const user: User = {}

const resAsync = validateUser(user).andThen(insertUser).andThen(sendNotification)

resAsync.then((res: Result<void, Error>) => {
  if (res.isErr()) {
    console.log('Oops, at least one step failed', res.error)
  } else {
    console.log('User has been validated, inserted and notified successfully.')
  }
})
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'
import * as Either from 'effect/Either'

interface User {}
declare function validateUser(user: User): Effect.Effect<User, Error>
declare function insertUser(user: User): Effect.Effect<User, Error>
declare function sendNotification(user: User): Effect.Effect<void, Error>

const user: User = {}

const resAsync = validateUser(user).pipe(
  Effect.andThen(insertUser),
  Effect.andThen(sendNotification)
)

Effect.runPromise(Effect.either(resAsync)).then((res: Either.Either<void, Error>) => {
  if (Either.isLeft(res)) {
    console.log('Oops, at least one step failed', res.left)
  } else {
    console.log('User has been validated, inserted and notified successfully.')
  }
})
```

</TabItem>

</Tabs>

### orElse

**Example** (Fallback when an async operation fails)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ResultAsync, ok } from 'neverthrow'

interface User {}
declare function fetchUserData(id: string): ResultAsync<User, Error>
declare function getDefaultUser(): User

const userId = '123'

// Try to fetch user data, but provide a default if it fails
const userResult = fetchUserData(userId).orElse(() => ok(getDefaultUser()))

userResult.then((result) => {
  if (result.isOk()) {
    console.log('User data:', result.value)
  }
})
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'
import * as Either from 'effect/Either'

interface User {}
declare function fetchUserData(id: string): Effect.Effect<User, Error>
declare function getDefaultUser(): User

const userId = '123'

// Try to fetch user data, but provide a default if it fails
const userResult = fetchUserData(userId).pipe(Effect.orElse(() => Effect.succeed(getDefaultUser())))

Effect.runPromise(Effect.either(userResult)).then((result) => {
  if (Either.isRight(result)) {
    console.log('User data:', result.right)
  }
})
```

</TabItem>

</Tabs>

### match

**Example** (Handling success and failure at the end of a chain)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ResultAsync } from 'neverthrow'

interface User {
  readonly name: string
}
declare function validateUser(user: User): ResultAsync<User, Error>
declare function insertUser(user: User): ResultAsync<User, Error>

const user: User = { name: 'John' }

// Handle both cases at the end of the chain using match
const resultMessage = await validateUser(user)
  .andThen(insertUser)
  .match(
    (user: User) => `User ${user.name} has been successfully created`,
    (error: Error) => `User could not be created because ${error.message}`
  )
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'

interface User {
  readonly name: string
}
declare function validateUser(user: User): Effect.Effect<User, Error>
declare function insertUser(user: User): Effect.Effect<User, Error>

const user: User = { name: 'John' }

// Handle both cases at the end of the chain using match
const resultMessage = await Effect.runPromise(
  validateUser(user).pipe(
    Effect.andThen(insertUser),
    Effect.match({
      onSuccess: (user) => `User ${user.name} has been successfully created`,
      onFailure: (error) => `User could not be created because ${error.message}`,
    })
  )
)
```

</TabItem>

</Tabs>

### combine

**Example** (Combining multiple async results)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ResultAsync, okAsync } from 'neverthrow'

const resultList: ResultAsync<number, string>[] = [okAsync(1), okAsync(2)]

// const combinedList: ResultAsync<number[], string>
const combinedList = ResultAsync.combine(resultList)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Effect from 'effect/Effect'

const resultList: Effect.Effect<number, string>[] = [Effect.succeed(1), Effect.succeed(2)]

// const combinedList: Effect<number[], string>
const combinedList = Effect.all(resultList)
```

</TabItem>

</Tabs>

### combineWithAllErrors

**Example** (Collecting all errors instead of failing fast)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ResultAsync, okAsync, errAsync } from 'neverthrow'

const resultList: ResultAsync<number, string>[] = [
  okAsync(123),
  errAsync('boooom!'),
  okAsync(456),
  errAsync('ahhhhh!'),
]

const result = await ResultAsync.combineWithAllErrors(resultList)
// result is Err(['boooom!', 'ahhhhh!'])
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect, identity } from 'effect'

const resultList: Effect.Effect<number, string>[] = [
  Effect.succeed(123),
  Effect.fail('boooom!'),
  Effect.succeed(456),
  Effect.fail('ahhhhh!'),
]

const result = await Effect.runPromise(Effect.either(Effect.validateAll(resultList, identity)))
// result is left(['boooom!', 'ahhhhh!'])
```

</TabItem>

</Tabs>
