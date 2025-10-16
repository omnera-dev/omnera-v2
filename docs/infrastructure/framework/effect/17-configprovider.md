## ConfigProvider

The `ConfigProvider` module in Effect allows applications to load configuration values from different sources.
The default provider reads from environment variables, but you can customize its behavior when needed.

### Loading Configuration from Environment Variables

The `ConfigProvider.fromEnv` function creates a `ConfigProvider` that loads values from environment variables. This is the default provider used by Effect unless another is specified.

If your application requires a custom delimiter for nested configuration keys, you can configure `ConfigProvider.fromEnv` accordingly.

**Example** (Changing the Path Delimiter)

The following example modifies the path delimiter (`"__"`) and sequence delimiter (`"|"`) for environment variables.

```ts twoslash title="index.ts"
import { Config, ConfigProvider, Effect } from "effect"

const program = Effect.gen(function* () {
  // Read SERVER_HOST and SERVER_PORT as nested configuration values
  const port = yield* Config.nested(Config.number("PORT"), "SERVER")
  const host = yield* Config.nested(Config.string("HOST"), "SERVER")
  console.log(`Application started: ${host}:${port}`)
})

Effect.runPromise(
  Effect.withConfigProvider(
    program,
    // Custom delimiters
    ConfigProvider.fromEnv({ pathDelim: "__", seqDelim: "|" })
  )
)
```

To match the custom delimiter (`"__"`), set environment variables like this:

```sh showLineNumbers=false
SERVER__HOST=localhost SERVER__PORT=8080 npx tsx index.ts
```

Output:

```ansi showLineNumbers=false
Application started: localhost:8080
```

### Loading Configuration from JSON

The `ConfigProvider.fromJson` function creates a `ConfigProvider` that loads values from a JSON object.

**Example** (Reading Nested Configuration from JSON)

```ts twoslash
import { Config, ConfigProvider, Effect } from "effect"

const program = Effect.gen(function* () {
  // Read SERVER_HOST and SERVER_PORT as nested configuration values
  const port = yield* Config.nested(Config.number("PORT"), "SERVER")
  const host = yield* Config.nested(Config.string("HOST"), "SERVER")
  console.log(`Application started: ${host}:${port}`)
})

Effect.runPromise(
  Effect.withConfigProvider(
    program,
    ConfigProvider.fromJson(
      JSON.parse(`{"SERVER":{"PORT":8080,"HOST":"localhost"}}`)
    )
  )
)
// Output: Application started: localhost:8080
```

### Using Nested Configuration Namespaces

The `ConfigProvider.nested` function allows **grouping configuration values** under a namespace.
This is helpful when structuring settings logically, such as grouping `SERVER`-related values.

**Example** (Using a Nested Namespace)

```ts twoslash title="index.ts"
import { Config, ConfigProvider, Effect } from "effect"

const program = Effect.gen(function* () {
  const port = yield* Config.number("PORT") // Reads SERVER_PORT
  const host = yield* Config.string("HOST") // Reads SERVER_HOST
  console.log(`Application started: ${host}:${port}`)
})

Effect.runPromise(
  Effect.withConfigProvider(
    program,
    ConfigProvider.fromEnv().pipe(
      // Uses SERVER as a namespace
      ConfigProvider.nested("SERVER")
    )
  )
)
```

Since we defined `"SERVER"` as the namespace, the environment variables must follow this pattern:

```sh showLineNumbers=false
SERVER_HOST=localhost SERVER_PORT=8080 npx tsx index.ts
```

Output:

```ansi showLineNumbers=false
Application started: localhost:8080
```

### Converting Configuration Keys to Constant Case

The `ConfigProvider.constantCase` function transforms all configuration keys into constant case (uppercase with underscores).
This is useful when adapting environment variables to match different naming conventions.

**Example** (Using `constantCase` for Environment Variables)

```ts twoslash title="index.ts"
import { Config, ConfigProvider, Effect } from "effect"

const program = Effect.gen(function* () {
  const port = yield* Config.number("Port") // Reads PORT
  const host = yield* Config.string("Host") // Reads HOST
  console.log(`Application started: ${host}:${port}`)
})

Effect.runPromise(
  Effect.withConfigProvider(
    program,
    // Convert keys to constant case
    ConfigProvider.fromEnv().pipe(ConfigProvider.constantCase)
  )
)
```

Since `constantCase` converts `"Port"` → `"PORT"` and `"Host"` → `"HOST"`, the environment variables must be set as follows:

```sh showLineNumbers=false
HOST=localhost PORT=8080 npx tsx index.ts
```

Output:

```ansi showLineNumbers=false
Application started: localhost:8080
```
