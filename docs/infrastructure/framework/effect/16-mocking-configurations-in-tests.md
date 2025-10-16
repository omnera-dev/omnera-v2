## Mocking Configurations in Tests

When testing services, there are times when you need to provide specific configurations for your tests. To simulate this, it's useful to mock the configuration backend that reads these values.

You can achieve this using the `ConfigProvider.fromMap` constructor.
This method allows you to create a configuration provider from a `Map<string, string>`, where the map represents the configuration data.
You can then use this mock provider in place of the default one by calling `Effect.withConfigProvider`.

**Example** (Mocking a Config Provider for Testing)

```ts twoslash
import { Config, ConfigProvider, Effect } from "effect"

class HostPort {
  constructor(readonly host: string, readonly port: number) {}
  get url() {
    return `${this.host}:${this.port}`
  }
}

const config = Config.map(
  Config.all([Config.string("HOST"), Config.number("PORT")]),
  ([host, port]) => new HostPort(host, port)
)

const program = Effect.gen(function* () {
  const hostPort = yield* config
  console.log(`Application started: ${hostPort.url}`)
})

// Create a mock config provider using a map with test data
const mockConfigProvider = ConfigProvider.fromMap(
  new Map([
    ["HOST", "localhost"],
    ["PORT", "8080"]
  ])
)

// Run the program using the mock config provider
Effect.runPromise(Effect.withConfigProvider(program, mockConfigProvider))
// Output: Application started: localhost:8080
```

This approach helps you create isolated tests that don't rely on external environment variables, ensuring your tests run consistently with mock configurations.

### Handling Nested Configuration Values

For more complex setups, configurations often include nested keys. By default, `ConfigProvider.fromMap` uses `.` as the separator for nested keys.

**Example** (Providing Nested Configuration Values)

```ts twoslash
import { Config, ConfigProvider, Effect } from "effect"

const config = Config.nested(Config.number("PORT"), "SERVER")

const program = Effect.gen(function* () {
  const port = yield* config
  console.log(`Server is running on port ${port}`)
})

// Mock configuration using '.' as the separator for nested keys
const mockConfigProvider = ConfigProvider.fromMap(
  new Map([["SERVER.PORT", "8080"]])
)

Effect.runPromise(Effect.withConfigProvider(program, mockConfigProvider))
// Output: Server is running on port 8080
```

### Customizing the Path Delimiter

If your configuration data uses a different separator (such as `_`), you can change the delimiter using the `pathDelim` option in `ConfigProvider.fromMap`.

**Example** (Using a Custom Path Delimiter)

```ts twoslash
import { Config, ConfigProvider, Effect } from "effect"

const config = Config.nested(Config.number("PORT"), "SERVER")

const program = Effect.gen(function* () {
  const port = yield* config
  console.log(`Server is running on port ${port}`)
})

// Mock configuration using '_' as the separator
const mockConfigProvider = ConfigProvider.fromMap(
  new Map([["SERVER_PORT", "8080"]]),
  { pathDelim: "_" }
)

Effect.runPromise(Effect.withConfigProvider(program, mockConfigProvider))
// Output: Server is running on port 8080
```
