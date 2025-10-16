## Handling Services with Dependencies

Sometimes a service in your application may depend on other services. To maintain a clean architecture, it's important to manage these dependencies without making them explicit in the service interface. Instead, you can use **layers** to handle these dependencies during the service construction phase.

**Example** (Defining a Logger Service with a Configuration Dependency)

Consider a scenario where multiple services depend on each other. In this case, the `Logger` service requires access to a configuration service (`Config`).

```ts twoslash
import { Effect, Context } from "effect"

// Declaring a tag for the Config service
class Config extends Context.Tag("Config")<Config, {}>() {}

// Declaring a tag for the logging service
class Logger extends Context.Tag("MyLoggerService")<
  Logger,
  {
    // ❌ Avoid exposing Config as a requirement
    readonly log: (message: string) => Effect.Effect<void, never, Config>
  }
>() {}
```

To handle these dependencies in a structured way and prevent them from leaking into the service interfaces, you can use the `Layer` abstraction. For more details on managing dependencies with layers, refer to the [Managing Layers](/docs/requirements-management/layers/) page.

<Aside type="tip" title="Use Layers for Dependencies">
  When a service has its own requirements, it's best to separate
  implementation details into layers. Layers act as **constructors for
  creating the service**, allowing us to handle dependencies at the
  construction level rather than the service level.
</Aside>

# [Introduction](https://effect.website/docs/resource-management/introduction/)
