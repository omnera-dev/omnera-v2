## Tapping

The `Layer.tap` and `Layer.tapError` functions allow you to perform additional effects based on the success or failure of a layer. These operations do not modify the layer's signature but are useful for logging or performing side effects during layer construction.

- `Layer.tap`: Executes a specified effect when the layer is successfully acquired.
- `Layer.tapError`: Executes a specified effect when the layer fails to acquire.

**Example** (Logging Success and Failure During Layer Acquisition)

```ts twoslash
import { Config, Context, Effect, Layer, Console } from 'effect'

class HTTPServer extends Context.Tag('HTTPServer')<HTTPServer, void>() {}

// Simulating an HTTP server
const server = Layer.effect(
  HTTPServer,
  Effect.gen(function* () {
    const host = yield* Config.string('HOST')
    console.log(`Listening on http://localhost:${host}`)
  })
).pipe(
  // Log a message if the layer acquisition succeeds
  Layer.tap((ctx) => Console.log(`layer acquisition succeeded with:\n${ctx}`)),
  // Log a message if the layer acquisition fails
  Layer.tapError((err) => Console.log(`layer acquisition failed with:\n${err}`))
)

Effect.runFork(Layer.launch(server))
/*
Output:
layer acquisition failed with:
(Missing data at HOST: "Expected HOST to exist in the process context")
*/
```
