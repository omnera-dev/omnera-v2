## addFinalizer

The `Effect.addFinalizer` function is a high-level API that allows you to add finalizers to the scope of an effect. A finalizer is a piece of code that is guaranteed to run when the associated scope is closed. The behavior of the finalizer can vary based on the [Exit](/docs/data-types/exit/) value, which represents how the scope was closed—whether successfully or with an error.

**Example** (Adding a Finalizer on Success)

<Tabs syncKey="pipe-vs-gen">

<TabItem label="Using Effect.gen">

```ts twoslash
import { Effect, Console } from 'effect'

//      ┌─── Effect<string, never, Scope>
//      ▼
const program = Effect.gen(function* () {
  yield* Effect.addFinalizer((exit) => Console.log(`Finalizer executed. Exit status: ${exit._tag}`))
  return 'some result'
})

// Wrapping the effect in a scope
//
//      ┌─── Effect<string, never, never>
//      ▼
const runnable = Effect.scoped(program)

Effect.runPromiseExit(runnable).then(console.log)
/*
Output:
Finalizer executed. Exit status: Success
{ _id: 'Exit', _tag: 'Success', value: 'some result' }
*/
```

</TabItem>

<TabItem label="Using pipe">

```ts twoslash
import { Effect, Console } from 'effect'

//      ┌─── Effect<string, never, Scope>
//      ▼
const program = Effect.addFinalizer((exit) =>
  Console.log(`Finalizer executed. Exit status: ${exit._tag}`)
).pipe(Effect.andThen(Effect.succeed('some result')))

// Wrapping the effect in a scope
//
//      ┌─── Effect<string, never, never>
//      ▼
const runnable = Effect.scoped(program)

Effect.runPromiseExit(runnable).then(console.log)
/*
Output:
Finalizer executed. Exit status: Success
{ _id: 'Exit', _tag: 'Success', value: 'some result' }
*/
```

</TabItem>

</Tabs>

In this example, we use `Effect.addFinalizer` to add a finalizer that logs the exit state after the scope is closed. The finalizer will execute when the effect finishes, and it will log whether the effect completed successfully or failed.

The type signature:

```ts showLineNumbers=false "Scope"
const program: Effect<string, never, Scope>
```

shows that the workflow requires a `Scope` to run. You can provide this `Scope` using the `Effect.scoped` function, which creates a new scope, runs the effect within it, and ensures the finalizers are executed when the scope is closed.

<Aside type="note" title="Finalizer Execution Order">
  Finalizers are executed in reverse order of how they were added,
  ensuring that resources are released in the proper sequence, just like
  in stack unwinding.
</Aside>

**Example** (Adding a Finalizer on Failure)

<Tabs syncKey="pipe-vs-gen">

<TabItem label="Using Effect.gen">

```ts twoslash
import { Effect, Console } from 'effect'

//      ┌─── Effect<never, string, Scope>
//      ▼
const program = Effect.gen(function* () {
  yield* Effect.addFinalizer((exit) => Console.log(`Finalizer executed. Exit status: ${exit._tag}`))
  return yield* Effect.fail('Uh oh!')
})

// Wrapping the effect in a scope
//
//      ┌─── Effect<never, string, never>
//      ▼
const runnable = Effect.scoped(program)

Effect.runPromiseExit(runnable).then(console.log)
/*
Output:
Finalizer executed. Exit status: Failure
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Uh oh!' }
}
*/
```

</TabItem>

<TabItem label="Using pipe">

```ts twoslash
import { Effect, Console } from 'effect'

//      ┌─── Effect<never, string, Scope>
//      ▼
const program = Effect.addFinalizer((exit) =>
  Console.log(`Finalizer executed. Exit status: ${exit._tag}`)
).pipe(Effect.andThen(Effect.fail('Uh oh!')))

// Wrapping the effect in a scope
//
//      ┌─── Effect<never, string, never>
//      ▼
const runnable = Effect.scoped(program)

Effect.runPromiseExit(runnable).then(console.log)
/*
Output:
Finalizer executed. Exit status: Failure
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Uh oh!' }
}
*/
```

</TabItem>

</Tabs>

In this case, the finalizer is executed even when the effect fails. The log output reflects that the finalizer runs after the failure, and it logs the failure details.

**Example** (Adding a Finalizer on [Interruption](/docs/concurrency/basic-concurrency/#interruptions))

<Tabs syncKey="pipe-vs-gen">

<TabItem label="Using Effect.gen">

```ts twoslash
import { Effect, Console } from 'effect'

//      ┌─── Effect<never, never, Scope>
//      ▼
const program = Effect.gen(function* () {
  yield* Effect.addFinalizer((exit) => Console.log(`Finalizer executed. Exit status: ${exit._tag}`))
  return yield* Effect.interrupt
})

// Wrapping the effect in a scope
//
//      ┌─── Effect<never, never, never>
//      ▼
const runnable = Effect.scoped(program)

Effect.runPromiseExit(runnable).then(console.log)
/*
Output:
Finalizer executed. Exit status: Failure
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Interrupt',
    fiberId: {
      _id: 'FiberId',
      _tag: 'Runtime',
      id: 0,
      startTimeMillis: ...
    }
  }
}
*/
```

</TabItem>

<TabItem label="Using pipe">

```ts twoslash
import { Effect, Console } from 'effect'

//      ┌─── Effect<never, never, Scope>
//      ▼
const program = Effect.addFinalizer((exit) =>
  Console.log(`Finalizer executed. Exit status: ${exit._tag}`)
).pipe(Effect.andThen(Effect.interrupt))

// Wrapping the effect in a scope
//
//      ┌─── Effect<never, never, never>
//      ▼
const runnable = Effect.scoped(program)

Effect.runPromiseExit(runnable).then(console.log)
/*
Output:
Finalizer executed. Exit status: Failure
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: {
    _id: 'Cause',
    _tag: 'Interrupt',
    fiberId: {
      _id: 'FiberId',
      _tag: 'Runtime',
      id: 0,
      startTimeMillis: ...
    }
  }
}
*/
```

</TabItem>

</Tabs>

This example shows how a finalizer behaves when the effect is interrupted. The finalizer runs after the interruption, and the exit status reflects that the effect was stopped mid-execution.
