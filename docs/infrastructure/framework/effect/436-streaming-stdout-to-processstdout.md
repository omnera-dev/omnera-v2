## Streaming stdout to process.stdout

To stream a command's `stdout` directly to `process.stdout`, you can use the following approach:

**Example** (Streaming Command Output Directly to Standard Output)

```ts twoslash
import { Command } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect } from 'effect'

// Create a command to run `cat` on a file and inherit stdout
const program = Command.make('cat', './some-file.txt').pipe(
  Command.stdout('inherit'), // Stream stdout to process.stdout
  Command.exitCode // Get the exit code
)

NodeRuntime.runMain(program.pipe(Effect.provide(NodeContext.layer)))
```

# [FileSystem](https://effect.website/docs/platform/file-system/)
