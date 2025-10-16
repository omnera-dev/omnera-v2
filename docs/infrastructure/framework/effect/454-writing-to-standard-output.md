## Writing to standard output

**Example** (Displaying a Message on the Terminal)

```ts twoslash
import { Terminal } from '@effect/platform'
import { NodeRuntime, NodeTerminal } from '@effect/platform-node'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const terminal = yield* Terminal.Terminal
  yield* terminal.display('a message\n')
})

NodeRuntime.runMain(program.pipe(Effect.provide(NodeTerminal.layer)))
// Output: "a message"
```
