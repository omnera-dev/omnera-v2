## Overview

import { Aside } from "@astrojs/starlight/components"

Sequential combinators such as [Effect.zip](/docs/getting-started/control-flow/#zip), [Effect.all](/docs/getting-started/control-flow/#all) and [Effect.forEach](/docs/getting-started/control-flow/#foreach) have a "fail fast" policy when it comes to error management. This means that they stop and return immediately when they encounter the first error.

Here's an example using `Effect.zip`, which stops at the first failure and only shows the first error:

**Example** (Fail Fast with `Effect.zip`)

```ts twoslash
import { Effect, Console } from 'effect'

const task1 = Console.log('task1').pipe(Effect.as(1))
const task2 = Effect.fail('Oh uh!').pipe(Effect.as(2))
const task3 = Console.log('task2').pipe(Effect.as(3))
const task4 = Effect.fail('Oh no!').pipe(Effect.as(4))

const program = task1.pipe(Effect.zip(task2), Effect.zip(task3), Effect.zip(task4))

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
task1
(FiberFailure) Error: Oh uh!
*/
```

The `Effect.forEach` function behaves similarly. It applies an effectful operation to each element in a collection, but will stop when it hits the first error:

**Example** (Fail Fast with `Effect.forEach`)

```ts twoslash
import { Effect, Console } from 'effect'

const program = Effect.forEach([1, 2, 3, 4, 5], (n) => {
  if (n < 4) {
    return Console.log(`item ${n}`).pipe(Effect.as(n))
  } else {
    return Effect.fail(`${n} is not less that 4`)
  }
})

Effect.runPromise(program).then(console.log, console.error)
/*
Output:
item 1
item 2
item 3
(FiberFailure) Error: 4 is not less that 4
*/
```

However, there are cases where you may want to collect all errors rather than fail fast. In these situations, you can use functions that accumulate both successes and errors.
