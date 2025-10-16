## Concurrency Options

Effect provides options to manage how effects are executed, particularly focusing on controlling how many effects run concurrently.

```ts showLineNumbers=false
type Options = {
  readonly concurrency?: Concurrency
}
```

The `concurrency` option is used to determine the level of concurrency, with the following values:

```ts showLineNumbers=false
type Concurrency = number | "unbounded" | "inherit"
```

Let's explore each configuration in detail.

<Aside type="tip" title="Applicability of Concurrency Options">
  The examples here use the `Effect.all` function, but these options apply
  to many other Effect APIs.
</Aside>

### Sequential Execution (Default)

By default, if you don't specify any concurrency option, effects will run sequentially, one after the other. This means each effect starts only after the previous one completes.

**Example** (Sequential Execution)

```ts twoslash
import { Effect, Duration } from "effect"

// Helper function to simulate a task with a delay
const makeTask = (n: number, delay: Duration.DurationInput) =>
  Effect.promise(
    () =>
      new Promise<void>((resolve) => {
        console.log(`start task${n}`) // Logs when the task starts
        setTimeout(() => {
          console.log(`task${n} done`) // Logs when the task finishes
          resolve()
        }, Duration.toMillis(delay))
      })
  )

const task1 = makeTask(1, "200 millis")
const task2 = makeTask(2, "100 millis")

const sequential = Effect.all([task1, task2])

Effect.runPromise(sequential)
/*
Output:
start task1
task1 done
start task2 <-- task2 starts only after task1 completes
task2 done
*/
```

### Numbered Concurrency

You can control how many effects run concurrently by setting a `number` for `concurrency`. For example, `concurrency: 2` allows up to two effects to run at the same time.

**Example** (Limiting to 2 Concurrent Tasks)

```ts twoslash
import { Effect, Duration } from "effect"

// Helper function to simulate a task with a delay
const makeTask = (n: number, delay: Duration.DurationInput) =>
  Effect.promise(
    () =>
      new Promise<void>((resolve) => {
        console.log(`start task${n}`) // Logs when the task starts
        setTimeout(() => {
          console.log(`task${n} done`) // Logs when the task finishes
          resolve()
        }, Duration.toMillis(delay))
      })
  )

const task1 = makeTask(1, "200 millis")
const task2 = makeTask(2, "100 millis")
const task3 = makeTask(3, "210 millis")
const task4 = makeTask(4, "110 millis")
const task5 = makeTask(5, "150 millis")

const numbered = Effect.all([task1, task2, task3, task4, task5], {
  concurrency: 2
})

Effect.runPromise(numbered)
/*
Output:
start task1
start task2 <-- active tasks: task1, task2
task2 done
start task3 <-- active tasks: task1, task3
task1 done
start task4 <-- active tasks: task3, task4
task4 done
start task5 <-- active tasks: task3, task5
task3 done
task5 done
*/
```

### Unbounded Concurrency

When `concurrency: "unbounded"` is used, there's no limit to the number of effects running concurrently.

**Example** (Unbounded Concurrency)

```ts twoslash
import { Effect, Duration } from "effect"

// Helper function to simulate a task with a delay
const makeTask = (n: number, delay: Duration.DurationInput) =>
  Effect.promise(
    () =>
      new Promise<void>((resolve) => {
        console.log(`start task${n}`) // Logs when the task starts
        setTimeout(() => {
          console.log(`task${n} done`) // Logs when the task finishes
          resolve()
        }, Duration.toMillis(delay))
      })
  )

const task1 = makeTask(1, "200 millis")
const task2 = makeTask(2, "100 millis")
const task3 = makeTask(3, "210 millis")
const task4 = makeTask(4, "110 millis")
const task5 = makeTask(5, "150 millis")

const unbounded = Effect.all([task1, task2, task3, task4, task5], {
  concurrency: "unbounded"
})

Effect.runPromise(unbounded)
/*
Output:
start task1
start task2
start task3
start task4
start task5
task2 done
task4 done
task5 done
task1 done
task3 done
*/
```

### Inherit Concurrency

When using `concurrency: "inherit"`, the concurrency level is inherited from the surrounding context. This context can be set using `Effect.withConcurrency(number | "unbounded")`. If no context is provided, the default is `"unbounded"`.

**Example** (Inheriting Concurrency from Context)

```ts twoslash
import { Effect, Duration } from "effect"

// Helper function to simulate a task with a delay
const makeTask = (n: number, delay: Duration.DurationInput) =>
  Effect.promise(
    () =>
      new Promise<void>((resolve) => {
        console.log(`start task${n}`) // Logs when the task starts
        setTimeout(() => {
          console.log(`task${n} done`) // Logs when the task finishes
          resolve()
        }, Duration.toMillis(delay))
      })
  )

const task1 = makeTask(1, "200 millis")
const task2 = makeTask(2, "100 millis")
const task3 = makeTask(3, "210 millis")
const task4 = makeTask(4, "110 millis")
const task5 = makeTask(5, "150 millis")

// Running all tasks with concurrency: "inherit",
// which defaults to "unbounded"
const inherit = Effect.all([task1, task2, task3, task4, task5], {
  concurrency: "inherit"
})

Effect.runPromise(inherit)
/*
Output:
start task1
start task2
start task3
start task4
start task5
task2 done
task4 done
task5 done
task1 done
task3 done
*/
```

If you use `Effect.withConcurrency`, the concurrency configuration will adjust to the specified option.

**Example** (Setting Concurrency Option)

```ts twoslash
import { Effect, Duration } from "effect"

// Helper function to simulate a task with a delay
const makeTask = (n: number, delay: Duration.DurationInput) =>
  Effect.promise(
    () =>
      new Promise<void>((resolve) => {
        console.log(`start task${n}`) // Logs when the task starts
        setTimeout(() => {
          console.log(`task${n} done`) // Logs when the task finishes
          resolve()
        }, Duration.toMillis(delay))
      })
  )

const task1 = makeTask(1, "200 millis")
const task2 = makeTask(2, "100 millis")
const task3 = makeTask(3, "210 millis")
const task4 = makeTask(4, "110 millis")
const task5 = makeTask(5, "150 millis")

// Running tasks with concurrency: "inherit",
// which will inherit the surrounding context
const inherit = Effect.all([task1, task2, task3, task4, task5], {
  concurrency: "inherit"
})

// Setting a concurrency limit of 2
const withConcurrency = inherit.pipe(Effect.withConcurrency(2))

Effect.runPromise(withConcurrency)
/*
Output:
start task1
start task2 <-- active tasks: task1, task2
task2 done
start task3 <-- active tasks: task1, task3
task1 done
start task4 <-- active tasks: task3, task4
task4 done
start task5 <-- active tasks: task3, task5
task3 done
task5 done
*/
```
