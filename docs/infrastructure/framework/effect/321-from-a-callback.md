## From a Callback

Creates an `Effect` from a callback-based asynchronous function.

Sometimes you have to work with APIs that don't support `async/await` or `Promise` and instead use the callback style.
To handle callback-based APIs, Effect provides the `Effect.async` constructor.

**Example** (Wrapping a Callback API)

Let's wrap the `readFile` function from Node.js's `fs` module into an Effect-based API (make sure `@types/node` is installed):

```ts twoslash
import { Effect } from "effect"
import * as NodeFS from "node:fs"

const readFile = (filename: string) =>
  Effect.async<Buffer, Error>((resume) => {
    NodeFS.readFile(filename, (error, data) => {
      if (error) {
        // Resume with a failed Effect if an error occurs
        resume(Effect.fail(error))
      } else {
        // Resume with a succeeded Effect if successful
        resume(Effect.succeed(data))
      }
    })
  })

//      ┌─── Effect<Buffer, Error, never>
//      ▼
const program = readFile("example.txt")
```

In the above example, we manually annotate the types when calling `Effect.async`:

```ts showLineNumbers=false "<Buffer, Error>"
Effect.async<Buffer, Error>((resume) => {
  // ...
})
```

because TypeScript cannot infer the type parameters for a callback
based on the return value inside the callback body. Annotating the types ensures that the values provided to `resume` match the expected types.

The `resume` function inside `Effect.async` should be called exactly once. Calling it more than once will result in the extra calls being ignored.

**Example** (Ignoring Subsequent `resume` Calls)

```ts twoslash
import { Effect } from "effect"

const program = Effect.async<number>((resume) => {
  resume(Effect.succeed(1))
  resume(Effect.succeed(2)) // This line will be ignored
})

// Run the program
Effect.runPromise(program).then(console.log) // Output: 1
```

### Advanced Usage

For more advanced use cases, `resume` can optionally return an `Effect` that will be executed if the fiber running this effect is interrupted. This can be useful in scenarios where you need to handle resource cleanup if the operation is interrupted.

**Example** (Handling Interruption with Cleanup)

In this example:

- The `writeFileWithCleanup` function writes data to a file.
- If the fiber running this effect is interrupted, the cleanup effect (which deletes the file) is executed.
- This ensures that resources like open file handles are cleaned up properly when the operation is canceled.

```ts twoslash
import { Effect, Fiber } from "effect"
import * as NodeFS from "node:fs"

// Simulates a long-running operation to write to a file
const writeFileWithCleanup = (filename: string, data: string) =>
  Effect.async<void, Error>((resume) => {
    const writeStream = NodeFS.createWriteStream(filename)

    // Start writing data to the file
    writeStream.write(data)

    // When the stream is finished, resume with success
    writeStream.on("finish", () => resume(Effect.void))

    // In case of an error during writing, resume with failure
    writeStream.on("error", (err) => resume(Effect.fail(err)))

    // Handle interruption by returning a cleanup effect
    return Effect.sync(() => {
      console.log(`Cleaning up ${filename}`)
      NodeFS.unlinkSync(filename)
    })
  })

const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(
    writeFileWithCleanup("example.txt", "Some long data...")
  )
  // Simulate interrupting the fiber after 1 second
  yield* Effect.sleep("1 second")
  yield* Fiber.interrupt(fiber) // This will trigger the cleanup
})

// Run the program
Effect.runPromise(program)
/*
Output:
Cleaning up example.txt
*/
```

If the operation you're wrapping supports interruption, the `resume` function can receive an `AbortSignal` to handle interruption requests directly.

**Example** (Handling Interruption with `AbortSignal`)

```ts twoslash
import { Effect, Fiber } from "effect"

// A task that supports interruption using AbortSignal
const interruptibleTask = Effect.async<void, Error>((resume, signal) => {
  // Handle interruption
  signal.addEventListener("abort", () => {
    console.log("Abort signal received")
    clearTimeout(timeoutId)
  })

  // Simulate a long-running task
  const timeoutId = setTimeout(() => {
    console.log("Operation completed")
    resume(Effect.void)
  }, 2000)
})

const program = Effect.gen(function* () {
  const fiber = yield* Effect.fork(interruptibleTask)
  // Simulate interrupting the fiber after 1 second
  yield* Effect.sleep("1 second")
  yield* Fiber.interrupt(fiber)
})

// Run the program
Effect.runPromise(program)
/*
Output:
Abort signal received
*/
```
