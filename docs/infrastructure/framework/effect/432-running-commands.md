## Running Commands

You need a `CommandExecutor` to run the command, which can capture output in various formats such as strings, lines, or streams.

**Example** (Running a Command and Printing Output)

```ts twoslash
import { Command } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect } from 'effect'

const command = Command.make('ls', '-al')

// The program depends on a CommandExecutor
const program = Effect.gen(function* () {
  // Runs the command returning the output as a string
  const output = yield* Command.string(command)
  console.log(output)
})

// Provide the necessary CommandExecutor
NodeRuntime.runMain(program.pipe(Effect.provide(NodeContext.layer)))
```

### Output Formats

You can choose different methods to handle command output:

| Method        | Description                                                                              |
| ------------- | ---------------------------------------------------------------------------------------- |
| `string`      | Runs the command returning the output as a string (with the specified encoding)          |
| `lines`       | Runs the command returning the output as an array of lines (with the specified encoding) |
| `stream`      | Runs the command returning the output as a stream of `Uint8Array` chunks                 |
| `streamLines` | Runs the command returning the output as a stream of lines (with the specified encoding) |

### exitCode

If you only need the exit code of a command, use `Command.exitCode`.

**Example** (Getting the Exit Code)

```ts twoslash
import { Command } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect } from 'effect'

const command = Command.make('ls', '-al')

const program = Effect.gen(function* () {
  const exitCode = yield* Command.exitCode(command)
  console.log(exitCode)
})

NodeRuntime.runMain(program.pipe(Effect.provide(NodeContext.layer)))
// Output: 0
```
