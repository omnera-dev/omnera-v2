## Collecting

### all

Combines multiple effects into one, returning results based on the input structure.

Use `Effect.all` when you need to run multiple effects and combine their results into a single output. It supports tuples, iterables, structs, and records, making it flexible for different input types.

If any effect fails, it stops execution (short-circuiting) and propagates the error. To change this behavior, you can use the [`mode`](#the-mode-option) option, which allows all effects to run and collect results as [Either](/docs/data-types/either/) or [Option](/docs/data-types/option/).

You can control the execution order (e.g., sequential vs. concurrent) using the [Concurrency Options](/docs/concurrency/basic-concurrency/#concurrency-options).

For instance, if the input is a tuple:

```ts showLineNumbers=false
//         ┌─── a tuple of effects
//         ▼
Effect.all([effect1, effect2, ...])
```

the effects are executed sequentially, and the result is a new effect containing the results as a tuple. The results in the tuple match the order of the effects passed to `Effect.all`.

Let's explore examples for different types of structures: tuples, iterables, objects, and records.

**Example** (Combining Effects in Tuples)

```ts twoslash
import { Effect, Console } from 'effect'

const tupleOfEffects = [
  Effect.succeed(42).pipe(Effect.tap(Console.log)),
  Effect.succeed('Hello').pipe(Effect.tap(Console.log)),
] as const

//      ┌─── Effect<[number, string], never, never>
//      ▼
const resultsAsTuple = Effect.all(tupleOfEffects)

Effect.runPromise(resultsAsTuple).then(console.log)
/*
Output:
42
Hello
[ 42, 'Hello' ]
*/
```

**Example** (Combining Effects in Iterables)

```ts twoslash
import { Effect, Console } from 'effect'

const iterableOfEffects: Iterable<Effect.Effect<number>> = [1, 2, 3].map((n) =>
  Effect.succeed(n).pipe(Effect.tap(Console.log))
)

//      ┌─── Effect<number[], never, never>
//      ▼
const resultsAsArray = Effect.all(iterableOfEffects)

Effect.runPromise(resultsAsArray).then(console.log)
/*
Output:
1
2
3
[ 1, 2, 3 ]
*/
```

**Example** (Combining Effects in Structs)

```ts twoslash
import { Effect, Console } from 'effect'

const structOfEffects = {
  a: Effect.succeed(42).pipe(Effect.tap(Console.log)),
  b: Effect.succeed('Hello').pipe(Effect.tap(Console.log)),
}

//      ┌─── Effect<{ a: number; b: string; }, never, never>
//      ▼
const resultsAsStruct = Effect.all(structOfEffects)

Effect.runPromise(resultsAsStruct).then(console.log)
/*
Output:
42
Hello
{ a: 42, b: 'Hello' }
*/
```

**Example** (Combining Effects in Records)

```ts twoslash
import { Effect, Console } from 'effect'

const recordOfEffects: Record<string, Effect.Effect<number>> = {
  key1: Effect.succeed(1).pipe(Effect.tap(Console.log)),
  key2: Effect.succeed(2).pipe(Effect.tap(Console.log)),
}

//      ┌─── Effect<{ [x: string]: number; }, never, never>
//      ▼
const resultsAsRecord = Effect.all(recordOfEffects)

Effect.runPromise(resultsAsRecord).then(console.log)
/*
Output:
1
2
{ key1: 1, key2: 2 }
*/
```

#### Short-Circuiting Behavior

The `Effect.all` function stops execution on the first error it encounters, this is called "short-circuiting".
If any effect in the collection fails, the remaining effects will not run, and the error will be propagated.

**Example** (Bail Out on First Failure)

```ts twoslash
import { Effect, Console } from 'effect'

const program = Effect.all([
  Effect.succeed('Task1').pipe(Effect.tap(Console.log)),
  Effect.fail('Task2: Oh no!').pipe(Effect.tap(Console.log)),
  // Won't execute due to earlier failure
  Effect.succeed('Task3').pipe(Effect.tap(Console.log)),
])

Effect.runPromiseExit(program).then(console.log)
/*
Output:
Task1
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Task2: Oh no!' }
}
*/
```

You can override this behavior by using the `mode` option.

#### The `mode` option

The `{ mode: "either" }` option changes the behavior of `Effect.all` to ensure all effects run, even if some fail. Instead of stopping on the first failure, this mode collects both successes and failures, returning an array of `Either` instances where each result is either a `Right` (success) or a `Left` (failure).

**Example** (Collecting Results with `mode: "either"`)

```ts twoslash /{ mode: "either" }/
import { Effect, Console } from 'effect'

const effects = [
  Effect.succeed('Task1').pipe(Effect.tap(Console.log)),
  Effect.fail('Task2: Oh no!').pipe(Effect.tap(Console.log)),
  Effect.succeed('Task3').pipe(Effect.tap(Console.log)),
]

const program = Effect.all(effects, { mode: 'either' })

Effect.runPromiseExit(program).then(console.log)
/*
Output:
Task1
Task3
{
  _id: 'Exit',
  _tag: 'Success',
  value: [
    { _id: 'Either', _tag: 'Right', right: 'Task1' },
    { _id: 'Either', _tag: 'Left', left: 'Task2: Oh no!' },
    { _id: 'Either', _tag: 'Right', right: 'Task3' }
  ]
}
*/
```

Similarly, the `{ mode: "validate" }` option uses `Option` to indicate success or failure. Each effect returns `None` for success and `Some` with the error for failure.

**Example** (Collecting Results with `mode: "validate"`)

```ts twoslash /{ mode: "validate" }/
import { Effect, Console } from 'effect'

const effects = [
  Effect.succeed('Task1').pipe(Effect.tap(Console.log)),
  Effect.fail('Task2: Oh no!').pipe(Effect.tap(Console.log)),
  Effect.succeed('Task3').pipe(Effect.tap(Console.log)),
]

const program = Effect.all(effects, { mode: 'validate' })

Effect.runPromiseExit(program).then((result) => console.log('%o', result))
/*
Output:
Task1
Task3
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Fail',
    failure: [
      { _id: 'Option', _tag: 'None' },
      { _id: 'Option', _tag: 'Some', value: 'Task2: Oh no!' },
      { _id: 'Option', _tag: 'None' }
    ]
  }
}
*/
```

# [Create Effect App](https://effect.website/docs/getting-started/create-effect-app/)
