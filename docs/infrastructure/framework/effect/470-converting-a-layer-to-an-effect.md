## Converting a Layer to an Effect

Sometimes your entire application might be a Layer, for example, an HTTP server. You can convert that layer to an effect with `Layer.launch`. It constructs the layer and keeps it alive until interrupted.

**Example** (Launching an HTTP Server Layer)

```ts twoslash
import { Console, Context, Effect, Layer } from "effect"

class HTTPServer extends Context.Tag("HTTPServer")<HTTPServer, void>() {}

// Simulating an HTTP server
const server = Layer.effect(
  HTTPServer,
  // Log a message to simulate a server starting
  Console.log("Listening on http://localhost:3000")
)

// Converts the layer to an effect and runs it
Effect.runFork(Layer.launch(server))
/*
Output:
Listening on http://localhost:3000
...
*/
```
