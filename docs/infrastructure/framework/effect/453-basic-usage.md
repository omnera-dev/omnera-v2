## Basic Usage

The module provides a single `Terminal` [tag](/docs/requirements-management/services/), which serves as the entry point to reading from and writing to standard input and standard output.

**Example** (Using the Terminal Service)

```ts twoslash
import { Terminal } from '@effect/platform'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const terminal = yield* Terminal.Terminal

  // Use `terminal` to interact with standard input and output
})
```
