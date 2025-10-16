## Fetching Process Details

You can access details about a running process, such as `exitCode`, `stdout`, and `stderr`.

**Example** (Accessing Exit Code and Streams from a Running Process)

```ts twoslash
import { Command } from '@effect/platform'
import { NodeContext, NodeRuntime } from '@effect/platform-node'
import { Effect, Stream, String, pipe } from 'effect'

// Helper function to collect stream output as a string
const runString = <E, R>(stream: Stream.Stream<Uint8Array, E, R>): Effect.Effect<string, E, R> =>
  stream.pipe(Stream.decodeText(), Stream.runFold(String.empty, String.concat))

const program = Effect.gen(function* () {
  const command = Command.make('ls')

  const [exitCode, stdout, stderr] = yield* pipe(
    // Start running the command and return a handle to the running process
    Command.start(command),
    Effect.flatMap((process) =>
      Effect.all(
        [
          // Waits for the process to exit and returns
          // the ExitCode of the command that was run
          process.exitCode,
          // The standard output stream of the process
          runString(process.stdout),
          // The standard error stream of the process
          runString(process.stderr),
        ],
        { concurrency: 3 }
      )
    )
  )
  console.log({ exitCode, stdout, stderr })
})

NodeRuntime.runMain(Effect.scoped(program).pipe(Effect.provide(NodeContext.layer)))
```
