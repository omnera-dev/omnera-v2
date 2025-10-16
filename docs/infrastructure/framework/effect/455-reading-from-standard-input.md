## Reading from standard input

**Example** (Reading a Line from Standard Input)

```ts twoslash
import { Terminal } from '@effect/platform'
import { NodeRuntime, NodeTerminal } from '@effect/platform-node'
import { Effect } from 'effect'

const program = Effect.gen(function* () {
  const terminal = yield* Terminal.Terminal
  const input = yield* terminal.readLine
  console.log(`input: ${input}`)
})

NodeRuntime.runMain(program.pipe(Effect.provide(NodeTerminal.layer)))
// Input: "hello"
// Output: "input: hello"
```
