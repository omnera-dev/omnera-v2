## Concurrency

### Promise.all()

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const task1 = new Promise<number>((resolve, reject) => {
  console.log("Executing task1...")
  setTimeout(() => {
    console.log("task1 done")
    resolve(1)
  }, 100)
})

const task2 = new Promise<number>((resolve, reject) => {
  console.log("Executing task2...")
  setTimeout(() => {
    console.log("task2 done")
    reject("Uh oh!")
  }, 200)
})

const task3 = new Promise<number>((resolve, reject) => {
  console.log("Executing task3...")
  setTimeout(() => {
    console.log("task3 done")
    resolve(3)
  }, 300)
})

const program = Promise.all([task1, task2, task3])

program.then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
task2 done
Uh oh!
task3 done
*/
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const task1 = Effect.gen(function* () {
  console.log("Executing task1...")
  yield* Effect.sleep("100 millis")
  console.log("task1 done")
  return 1
})

const task2 = Effect.gen(function* () {
  console.log("Executing task2...")
  yield* Effect.sleep("200 millis")
  console.log("task2 done")
  return yield* Effect.fail("Uh oh!")
})

const task3 = Effect.gen(function* () {
  console.log("Executing task3...")
  yield* Effect.sleep("300 millis")
  console.log("task3 done")
  return 3
})

const program = Effect.all([task1, task2, task3], {
  concurrency: "unbounded"
})

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
task2 done
(FiberFailure) Error: Uh oh!
*/
```

</TabItem>

</Tabs>

### Promise.allSettled()

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts
const task1 = new Promise<number>((resolve, reject) => {
  console.log("Executing task1...")
  setTimeout(() => {
    console.log("task1 done")
    resolve(1)
  }, 100)
})

const task2 = new Promise<number>((resolve, reject) => {
  console.log("Executing task2...")
  setTimeout(() => {
    console.log("task2 done")
    reject("Uh oh!")
  }, 200)
})

const task3 = new Promise<number>((resolve, reject) => {
  console.log("Executing task3...")
  setTimeout(() => {
    console.log("task3 done")
    resolve(3)
  }, 300)
})

const program = Promise.allSettled([task1, task2, task3])

program.then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
task2 done
task3 done
[
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'Uh oh!' },
  { status: 'fulfilled', value: 3 }
]
*/
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const task1 = Effect.gen(function* () {
  console.log("Executing task1...")
  yield* Effect.sleep("100 millis")
  console.log("task1 done")
  return 1
})

const task2 = Effect.gen(function* () {
  console.log("Executing task2...")
  yield* Effect.sleep("200 millis")
  console.log("task2 done")
  return yield* Effect.fail("Uh oh!")
})

const task3 = Effect.gen(function* () {
  console.log("Executing task3...")
  yield* Effect.sleep("300 millis")
  console.log("task3 done")
  return 3
})

const program = Effect.forEach(
  [task1, task2, task3],
  (task) => Effect.either(task), // or Effect.exit
  {
    concurrency: "unbounded"
  }
)

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
task2 done
task3 done
[
  {
    _id: "Either",
    _tag: "Right",
    right: 1
  }, {
    _id: "Either",
    _tag: "Left",
    left: "Uh oh!"
  }, {
    _id: "Either",
    _tag: "Right",
    right: 3
  }
]
*/
```

</TabItem>

</Tabs>

### Promise.any()

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts
const task1 = new Promise<number>((resolve, reject) => {
  console.log("Executing task1...")
  setTimeout(() => {
    console.log("task1 done")
    reject("Something went wrong!")
  }, 100)
})

const task2 = new Promise<number>((resolve, reject) => {
  console.log("Executing task2...")
  setTimeout(() => {
    console.log("task2 done")
    resolve(2)
  }, 200)
})

const task3 = new Promise<number>((resolve, reject) => {
  console.log("Executing task3...")
  setTimeout(() => {
    console.log("task3 done")
    reject("Uh oh!")
  }, 300)
})

const program = Promise.any([task1, task2, task3])

program.then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
task2 done
2
task3 done
*/
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const task1 = Effect.gen(function* () {
  console.log("Executing task1...")
  yield* Effect.sleep("100 millis")
  console.log("task1 done")
  return yield* Effect.fail("Something went wrong!")
})

const task2 = Effect.gen(function* () {
  console.log("Executing task2...")
  yield* Effect.sleep("200 millis")
  console.log("task2 done")
  return 2
})

const task3 = Effect.gen(function* () {
  console.log("Executing task3...")
  yield* Effect.sleep("300 millis")
  console.log("task3 done")
  return yield* Effect.fail("Uh oh!")
})

const program = Effect.raceAll([task1, task2, task3])

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
task2 done
2
*/
```

</TabItem>

</Tabs>

### Promise.race()

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const task1 = new Promise<number>((resolve, reject) => {
  console.log("Executing task1...")
  setTimeout(() => {
    console.log("task1 done")
    reject("Something went wrong!")
  }, 100)
})

const task2 = new Promise<number>((resolve, reject) => {
  console.log("Executing task2...")
  setTimeout(() => {
    console.log("task2 done")
    reject("Uh oh!")
  }, 200)
})

const task3 = new Promise<number>((resolve, reject) => {
  console.log("Executing task3...")
  setTimeout(() => {
    console.log("task3 done")
    resolve(3)
  }, 300)
})

const program = Promise.race([task1, task2, task3])

program.then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
Something went wrong!
task2 done
task3 done
*/
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const task1 = Effect.gen(function* () {
  console.log("Executing task1...")
  yield* Effect.sleep("100 millis")
  console.log("task1 done")
  return yield* Effect.fail("Something went wrong!")
})

const task2 = Effect.gen(function* () {
  console.log("Executing task2...")
  yield* Effect.sleep("200 millis")
  console.log("task2 done")
  return yield* Effect.fail("Uh oh!")
})

const task3 = Effect.gen(function* () {
  console.log("Executing task3...")
  yield* Effect.sleep("300 millis")
  console.log("task3 done")
  return 3
})

const program = Effect.raceAll([task1, task2, task3].map(Effect.either)) // or Effect.exit

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
Executing task1...
Executing task2...
Executing task3...
task1 done
{
  _id: "Either",
  _tag: "Left",
  left: "Something went wrong!"
}
*/
```

</TabItem>

</Tabs>
