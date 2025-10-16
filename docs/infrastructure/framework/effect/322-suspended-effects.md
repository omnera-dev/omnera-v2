## Suspended Effects

`Effect.suspend` is used to delay the creation of an effect.
It allows you to defer the evaluation of an effect until it is actually needed.
The `Effect.suspend` function takes a thunk that represents the effect, and it wraps it in a suspended effect.

**Syntax**

```ts showLineNumbers=false
const suspendedEffect = Effect.suspend(() => effect)
```

Let's explore some common scenarios where `Effect.suspend` proves useful.

### Lazy Evaluation

When you want to defer the evaluation of an effect until it is required. This can be useful for optimizing the execution of effects, especially when they are not always needed or when their computation is expensive.

Also, when effects with side effects or scoped captures are created, use `Effect.suspend` to re-execute on each invocation.

**Example** (Lazy Evaluation with Side Effects)

```ts twoslash
import { Effect } from "effect"

let i = 0

const bad = Effect.succeed(i++)

const good = Effect.suspend(() => Effect.succeed(i++))

console.log(Effect.runSync(bad)) // Output: 0
console.log(Effect.runSync(bad)) // Output: 0

console.log(Effect.runSync(good)) // Output: 1
console.log(Effect.runSync(good)) // Output: 2
```

<Aside type="note" title="Running Effects">
  This example utilizes `Effect.runSync` to execute effects and display
  their results (refer to [Running
  Effects](/docs/getting-started/running-effects/#runsync) for more
  details).
</Aside>

In this example, `bad` is the result of calling `Effect.succeed(i++)` a single time, which increments the scoped variable but [returns its original value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Increment#postfix_increment). `Effect.runSync(bad)` does not result in any new computation, because `Effect.succeed(i++)` has already been called. On the other hand, each time `Effect.runSync(good)` is called, the thunk passed to `Effect.suspend()` will be executed, outputting the scoped variable's most recent value.

### Handling Circular Dependencies

`Effect.suspend` is helpful in managing circular dependencies between effects, where one effect depends on another, and vice versa.
For example it's fairly common for `Effect.suspend` to be used in recursive functions to escape an eager call.

**Example** (Recursive Fibonacci)

```ts twoslash
import { Effect } from "effect"

const blowsUp = (n: number): Effect.Effect<number> =>
  n < 2
    ? Effect.succeed(1)
    : Effect.zipWith(blowsUp(n - 1), blowsUp(n - 2), (a, b) => a + b)

// console.log(Effect.runSync(blowsUp(32)))
// crash: JavaScript heap out of memory

const allGood = (n: number): Effect.Effect<number> =>
  n < 2
    ? Effect.succeed(1)
    : Effect.zipWith(
        Effect.suspend(() => allGood(n - 1)),
        Effect.suspend(() => allGood(n - 2)),
        (a, b) => a + b
      )

console.log(Effect.runSync(allGood(32))) // Output: 3524578
```

<Aside type="note" title="Running Effects">
  This example utilizes `Effect.zipWith` to combine the results of two
  effects (refer to the documentation on
  [zipping](/docs/getting-started/control-flow/#zipwith) for more
  details).
</Aside>

The `blowsUp` function creates a recursive Fibonacci sequence without deferring execution. Each call to `blowsUp` triggers further immediate recursive calls, rapidly increasing the JavaScript call stack size.

Conversely, `allGood` avoids stack overflow by using `Effect.suspend` to defer the recursive calls. This mechanism doesn't immediately execute the recursive effects but schedules them to be run later, thus keeping the call stack shallow and preventing a crash.

### Unifying Return Type

In situations where TypeScript struggles to unify the returned effect type, `Effect.suspend` can be employed to resolve this issue.

**Example** (Using `Effect.suspend` to Help TypeScript Infer Types)

```ts twoslash
import { Effect } from "effect"

/*
  Without suspend, TypeScript may struggle with type inference.

  Inferred type:
    (a: number, b: number) =>
      Effect<never, Error, never> | Effect<number, never, never>
*/
const withoutSuspend = (a: number, b: number) =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)

/*
  Using suspend to unify return types.

  Inferred type:
    (a: number, b: number) => Effect<number, Error, never>
*/
const withSuspend = (a: number, b: number) =>
  Effect.suspend(() =>
    b === 0
      ? Effect.fail(new Error("Cannot divide by zero"))
      : Effect.succeed(a / b)
  )
```
