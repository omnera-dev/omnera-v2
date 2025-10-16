## Manually Create and Close Scopes

When you're working with multiple scoped resources within a single operation, it's important to understand how their scopes interact.
By default, these scopes are merged into one, but you can have more fine-grained control over when each scope is closed by manually creating and closing them.

Let's start by looking at how scopes are merged by default:

**Example** (Merging Scopes)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Effect.gen(function* () {
  console.log('task 1')
  yield* Effect.addFinalizer(() => Console.log('finalizer after task 1'))
})

const task2 = Effect.gen(function* () {
  console.log('task 2')
  yield* Effect.addFinalizer(() => Console.log('finalizer after task 2'))
})

const program = Effect.gen(function* () {
  // The scopes of both tasks are merged into one
  yield* task1
  yield* task2
})

Effect.runPromise(Effect.scoped(program))
/*
Output:
task 1
task 2
finalizer after task 2
finalizer after task 1
*/
```

In this case, the scopes of `task1` and `task2` are merged into a single scope, and when the program is run, it outputs the tasks and their finalizers in a specific order.

If you want more control over when each scope is closed, you can manually create and close them:

**Example** (Manually Creating and Closing Scopes)

```ts twoslash
import { Console, Effect, Exit, Scope } from 'effect'

const task1 = Effect.gen(function* () {
  console.log('task 1')
  yield* Effect.addFinalizer(() => Console.log('finalizer after task 1'))
})

const task2 = Effect.gen(function* () {
  console.log('task 2')
  yield* Effect.addFinalizer(() => Console.log('finalizer after task 2'))
})

const program = Effect.gen(function* () {
  const scope1 = yield* Scope.make()
  const scope2 = yield* Scope.make()

  // Extend the scope of task1 into scope1
  yield* task1.pipe(Scope.extend(scope1))

  // Extend the scope of task2 into scope2
  yield* task2.pipe(Scope.extend(scope2))

  // Manually close scope1 and scope2
  yield* Scope.close(scope1, Exit.void)
  yield* Console.log('doing something else')
  yield* Scope.close(scope2, Exit.void)
})

Effect.runPromise(program)
/*
Output:
task 1
task 2
finalizer after task 1
doing something else
finalizer after task 2
*/
```

In this example, we create two separate scopes, `scope1` and `scope2`, and extend the scope of each task into its respective scope. When you run the program, it outputs the tasks and their finalizers in a different order.

<Aside type="note" title="Extending a Scope">
  The `Scope.extend` function allows you to extend the scope of an effect
  workflow that requires a scope into another scope without closing the
  scope when the workflow finishes executing. This allows you to extend a
  scoped value into a larger scope.
</Aside>

You might wonder what happens when a scope is closed, but a task within that scope hasn't completed yet.
The key point to note is that the scope closing doesn't force the task to be interrupted.

**Example** (Closing a Scope with Pending Tasks)

```ts twoslash
import { Console, Effect, Exit, Scope } from 'effect'

const task = Effect.gen(function* () {
  yield* Effect.sleep('1 second')
  console.log('Executed')
  yield* Effect.addFinalizer(() => Console.log('Task Finalizer'))
})

const program = Effect.gen(function* () {
  const scope = yield* Scope.make()

  // Close the scope immediately
  yield* Scope.close(scope, Exit.void)
  console.log('Scope closed')

  // This task will be executed even if the scope is closed
  yield* task.pipe(Scope.extend(scope))
})

Effect.runPromise(program)
/*
Output:
Scope closed
Executed <-- after 1 second
Task Finalizer
*/
```
