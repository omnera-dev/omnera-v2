## Comparing Effect.gen with async/await

If you are familiar with `async`/`await`, you may notice that the flow of writing code is similar.

Let's compare the two approaches:

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const increment = (x: number) => x + 1

const divide = (a: number, b: number): Promise<number> =>
  b === 0
    ? Promise.reject(new Error("Cannot divide by zero"))
    : Promise.resolve(a / b)

const task1 = Promise.resolve(10)

const task2 = Promise.resolve(2)

const program = async function () {
  const a = await task1
  const b = await task2
  const n1 = await divide(a, b)
  const n2 = increment(n1)
  return `Result is: ${n2}`
}

program().then(console.log) // Output: "Result is: 6"
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const increment = (x: number) => x + 1

const divide = (a: number, b: number): Effect.Effect<number, Error> =>
  b === 0
    ? Effect.fail(new Error("Cannot divide by zero"))
    : Effect.succeed(a / b)

const task1 = Effect.promise(() => Promise.resolve(10))

const task2 = Effect.promise(() => Promise.resolve(2))

const program = Effect.gen(function* () {
  const a = yield* task1
  const b = yield* task2
  const n1 = yield* divide(a, b)
  const n2 = increment(n1)
  return `Result is: ${n2}`
})

Effect.runPromise(program).then(console.log)
// Output: "Result is: 6"
```

</TabItem>

</Tabs>

It's important to note that although the code appears similar, the two programs are not identical. The purpose of comparing them side by side is just to highlight the resemblance in how they are written.
