## Overview

import { Aside } from "@astrojs/starlight/components"

When working with Effect, if an error occurs, the default behavior is to fail with the first error encountered.

**Example** (Failing on the First Error)

Here, the program fails with the first error it encounters, `"Oh uh!"`.

```ts twoslash
import { Effect } from "effect"

const fail = Effect.fail("Oh uh!")
const die = Effect.dieMessage("Boom!")

// Run both effects sequentially
const program = Effect.all([fail, die])

Effect.runPromiseExit(program).then(console.log)
/*
Output:
{
  _id: 'Exit',
  _tag: 'Failure',
  cause: { _id: 'Cause', _tag: 'Fail', failure: 'Oh uh!' }
}
*/
```
