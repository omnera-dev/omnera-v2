## Creating

### Success

Let's compare creating a successful operation using `Promise` and `Effect`:

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const success = Promise.resolve(2)
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const success = Effect.succeed(2)
```

</TabItem>

</Tabs>

### Failure

Now, let's see how to handle failures with `Promise` and `Effect`:

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const failure = Promise.reject("Uh oh!")
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const failure = Effect.fail("Uh oh!")
```

</TabItem>

</Tabs>

### Constructor

Creating operations with custom logic:

<Tabs syncKey="effect-vs-promise">

<TabItem label="Promise">

```ts twoslash
const task = new Promise<number>((resolve, reject) => {
  setTimeout(() => {
    Math.random() > 0.5 ? resolve(2) : reject("Uh oh!")
  }, 300)
})
```

</TabItem>

<TabItem label="Effect">

```ts twoslash
import { Effect } from "effect"

const task = Effect.gen(function* () {
  yield* Effect.sleep("300 millis")
  return Math.random() > 0.5 ? 2 : yield* Effect.fail("Uh oh!")
})
```

</TabItem>

</Tabs>
