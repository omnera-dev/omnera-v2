## Utilities

### fromThrowable

**Example** (Safely wrapping a throwing function)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result } from 'neverthrow'

type ParseError = { message: string }
const toParseError = (): ParseError => ({ message: 'Parse Error' })

const safeJsonParse = Result.fromThrowable(JSON.parse, toParseError)

// the function can now be used safely,
// if the function throws, the result will be an Err
const result = safeJsonParse('{')
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from 'effect/Either'

type ParseError = { message: string }
const toParseError = (): ParseError => ({ message: 'Parse Error' })

const safeJsonParse = (s: string) => Either.try({ try: () => JSON.parse(s), catch: toParseError })

// the function can now be used safely,
// if the function throws, the result will be an Either
const result = safeJsonParse('{')
```

</TabItem>

</Tabs>

### safeTry

**Example** (Using generators to simplify error handling)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { Result, ok, safeTry } from 'neverthrow'

declare function mayFail1(): Result<number, string>
declare function mayFail2(): Result<number, string>

function myFunc(): Result<number, string> {
  return safeTry<number, string>(function* () {
    return ok(
      (yield* mayFail1().mapErr((e) => `aborted by an error from 1st function, ${e}`)) +
        (yield* mayFail2().mapErr((e) => `aborted by an error from 2nd function, ${e}`))
    )
  })
}
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import * as Either from 'effect/Either'

declare function mayFail1(): Either.Either<number, string>
declare function mayFail2(): Either.Either<number, string>

function myFunc(): Either.Either<number, string> {
  return Either.gen(function* () {
    return (
      (yield* mayFail1().pipe(
        Either.mapLeft((e) => `aborted by an error from 1st function, ${e}`)
      )) +
      (yield* mayFail2().pipe(Either.mapLeft((e) => `aborted by an error from 2nd function, ${e}`)))
    )
  })
}
```

</TabItem>

</Tabs>

**Note**. With `Either.gen`, you do not need to wrap the final value with `Either.right`. The generator's return value becomes the `Right`.

You can also use an async generator function with `safeTry` to represent an asynchronous block.
On the Effect side, the same pattern is written with `Effect.gen` instead of `Either.gen`.

**Example** (Using async generators to handle multiple failures)

<Tabs syncKey="effect-vs-neverthrow">

<TabItem label="neverthrow">

```ts twoslash
import { ResultAsync, safeTry, ok } from 'neverthrow'

declare function mayFail1(): ResultAsync<number, string>
declare function mayFail2(): ResultAsync<number, string>

function myFunc(): ResultAsync<number, string> {
  return safeTry<number, string>(async function* () {
    return ok(
      (yield* mayFail1().mapErr((e) => `aborted by an error from 1st function, ${e}`)) +
        (yield* mayFail2().mapErr((e) => `aborted by an error from 2nd function, ${e}`))
    )
  })
}
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from 'effect'

declare function mayFail1(): Effect.Effect<number, string>
declare function mayFail2(): Effect.Effect<number, string>

function myFunc(): Effect.Effect<number, string> {
  return Effect.gen(function* () {
    return (
      (yield* mayFail1().pipe(
        Effect.mapError((e) => `aborted by an error from 1st function, ${e}`)
      )) +
      (yield* mayFail2().pipe(
        Effect.mapError((e) => `aborted by an error from 2nd function, ${e}`)
      ))
    )
  })
}
```

</TabItem>

</Tabs>

**Note**. With `Effect.gen`, you do not need to wrap the final value with `Effect.succeed`. The generator's return value becomes the `Success`.

# [Effect vs Promise](https://effect.website/docs/additional-resources/effect-vs-promise/)
