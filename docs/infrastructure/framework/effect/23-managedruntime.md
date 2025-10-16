## ManagedRuntime

When developing an Effect application and using `Effect.run*` functions to execute it, the application is automatically run using the default runtime behind the scenes. While it’s possible to adjust specific parts of the application by providing locally scoped configuration layers using `Effect.provide`, there are scenarios where you might want to **customize the runtime configuration for the entire application** from the top level.

In these cases, you can create a top-level runtime by converting a configuration layer into a runtime using the `ManagedRuntime.make` constructor.

**Example** (Creating and Using a Custom Managed Runtime)

In this example, we first create a custom configuration layer called `appLayer`, which replaces the default logger with a simple one that logs messages to the console. Next, we use `ManagedRuntime.make` to turn this configuration layer into a runtime.

```ts twoslash
import { Effect, ManagedRuntime, Logger } from "effect"

// Define a configuration layer that replaces the default logger
const appLayer = Logger.replace(
  Logger.defaultLogger,
  // Custom logger implementation
  Logger.make(({ message }) => console.log(message))
)

// Create a custom runtime from the configuration layer
const runtime = ManagedRuntime.make(appLayer)

const program = Effect.log("Application started!")

// Execute the program using the custom runtime
runtime.runSync(program)

// Clean up resources associated with the custom runtime
Effect.runFork(runtime.disposeEffect)
/*
Output:
[ 'Application started!' ]
*/
```

### Effect.Tag

When working with runtimes that you pass around, `Effect.Tag` can help simplify the access to services. It lets you define a new tag and embed the service shape directly into the static properties of the tag class.

**Example** (Defining a Tag for Notifications)

```ts twoslash
import { Effect } from "effect"

class Notifications extends Effect.Tag("Notifications")<
  Notifications,
  { readonly notify: (message: string) => Effect.Effect<void> }
>() {}
```

In this setup, the fields of the service (in this case, the `notify` method) are turned into static properties of the `Notifications` class, making it easier to access them.

This allows you to interact with the service directly:

**Example** (Using the Notifications Tag)

```ts twoslash
import { Effect } from "effect"

class Notifications extends Effect.Tag("Notifications")<
  Notifications,
  { readonly notify: (message: string) => Effect.Effect<void> }
>() {}

// Create an effect that depends on the Notifications service
//
//      ┌─── Effect<void, never, Notifications>
//      ▼
const action = Notifications.notify("Hello, world!")
```

In this example, the `action` effect depends on the `Notifications` service. This approach allows you to reference services without manually passing them around. Later, you can create a `Layer` that provides the `Notifications` service and build a `ManagedRuntime` with that layer to ensure the service is available where needed.

### Integrations

The `ManagedRuntime` simplifies the integration of services and layers with other frameworks or tools, particularly in environments where Effect is not the primary framework and access to the main entry point is restricted.

For example, in environments like React or other frameworks where you have limited control over the main application entry point, `ManagedRuntime` helps manage the lifecycle of services.

Here's how to manage a service's lifecycle within an external framework:

**Example** (Using `ManagedRuntime` in an External Framework)

```ts twoslash
import { Effect, ManagedRuntime, Layer, Console } from "effect"

// Define the Notifications service using Effect.Tag
class Notifications extends Effect.Tag("Notifications")<
  Notifications,
  { readonly notify: (message: string) => Effect.Effect<void> }
>() {
  // Provide a live implementation of the Notifications service
  static Live = Layer.succeed(this, {
    notify: (message) => Console.log(message)
  })
}

// Example entry point for an external framework
async function main() {
  // Create a custom runtime using the Notifications layer
  const runtime = ManagedRuntime.make(Notifications.Live)

  // Run the effect
  await runtime.runPromise(Notifications.notify("Hello, world!"))

  // Dispose of the runtime, cleaning up resources
  await runtime.dispose()
}
```

# [API Reference](https://effect.website/docs/additional-resources/api-reference/)
