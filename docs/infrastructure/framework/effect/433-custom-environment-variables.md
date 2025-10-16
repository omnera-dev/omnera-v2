## Custom Environment Variables

You can customize environment variables in a command by using `Command.env`. This is useful when you need specific variables for the command's execution.

**Example** (Setting Environment Variables)

In this example, the command runs in a shell to ensure environment variables are correctly processed.

```ts twoslash
import { Command } from "@effect/platform"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"

const command = Command.make("echo", "-n", "$MY_CUSTOM_VAR").pipe(
  Command.env({
    MY_CUSTOM_VAR: "Hello, this is a custom environment variable!"
  }),
  // Use shell to interpret variables correctly
  // on Windows and Unix-like systems
  Command.runInShell(true)
)

const program = Effect.gen(function* () {
  const output = yield* Command.string(command)
  console.log(output)
})

NodeRuntime.runMain(program.pipe(Effect.provide(NodeContext.layer)))
// Output: Hello, this is a custom environment variable!
```
