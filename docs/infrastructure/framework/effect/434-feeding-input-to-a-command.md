## Feeding Input to a Command

You can send input directly to a command's standard input using the `Command.feed` function.

**Example** (Sending Input to a Command's Standard Input)

```ts twoslash
import { Command } from "@effect/platform"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"

const command = Command.make("cat").pipe(Command.feed("Hello"))

const program = Effect.gen(function* () {
  console.log(yield* Command.string(command))
})

NodeRuntime.runMain(program.pipe(Effect.provide(NodeContext.layer)))
// Output: Hello
```
