## FAQ

**Question**. What is the equivalent of starting a promise without immediately waiting for it in Effects?

```ts {10,16} twoslash
const task = (delay: number, name: string) =>
  new Promise((resolve) =>
    setTimeout(() => {
      console.log(`${name} done`)
      return resolve(name)
    }, delay)
  )

export async function program() {
  const r0 = task(2_000, "long running task")
  const r1 = await task(200, "task 2")
  const r2 = await task(100, "task 3")
  return {
    r1,
    r2,
    r0: await r0
  }
}

program().then(console.log)
/*
Output:
task 2 done
task 3 done
long running task done
{ r1: 'task 2', r2: 'task 3', r0: 'long running promise' }
*/
```

**Answer:** You can achieve this by utilizing `Effect.fork` and `Fiber.join`.

```ts {11,17} twoslash
import { Effect, Fiber } from "effect"

const task = (delay: number, name: string) =>
  Effect.gen(function* () {
    yield* Effect.sleep(delay)
    console.log(`${name} done`)
    return name
  })

const program = Effect.gen(function* () {
  const r0 = yield* Effect.fork(task(2_000, "long running task"))
  const r1 = yield* task(200, "task 2")
  const r2 = yield* task(100, "task 3")
  return {
    r1,
    r2,
    r0: yield* Fiber.join(r0)
  }
})

Effect.runPromise(program).then(console.log)
/*
Output:
task 2 done
task 3 done
long running task done
{ r1: 'task 2', r2: 'task 3', r0: 'long running promise' }
*/
```

# [Myths About Effect](https://effect.website/docs/additional-resources/myths/)
